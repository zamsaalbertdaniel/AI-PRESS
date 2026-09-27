import { ghPutFile } from "@/lib/github";
import { getArticleById, updateArticle } from "@/lib/db";
import { generateImagePrompt } from "@/lib/ai";

/**
 * Server-side image generation for articles.
 * Uses Gemini 2.0 Flash native image generation (no third-party dependencies).
 * 1. Generates an image prompt via Gemini AI (text model)
 * 2. Generates the actual image via Gemini REST API (image model)
 * 3. Compresses to WebP and commits it to the repo (public/images/articles)
 * 4. Returns the public URL
 */

async function generateImageWithGemini(prompt: string): Promise<Buffer | null> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("[ImageGen] GEMINI_API_KEY not set");
        return null;
    }

    try {
        // Use Gemini 2.0 Flash experimental with image generation
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Generate a high-quality, professional image based on this description. No text or watermarks in the image:\n\n${prompt}`
                    }]
                }],
                generationConfig: {
                    responseModalities: ["IMAGE", "TEXT"],
                    responseMimeType: "text/plain",
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[ImageGen] Gemini API error ${response.status}:`, errorText);
            return null;
        }

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];

        // Find the image part in the response
        for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith("image/")) {
                const base64 = part.inlineData.data;
                return Buffer.from(base64, "base64");
            }
        }

        console.warn("[ImageGen] No image data in Gemini response");
        return null;
    } catch (err) {
        console.error("[ImageGen] Gemini image generation error:", err instanceof Error ? err.message : err);
        return null;
    }
}

async function compress(buf: Buffer): Promise<{ data: Buffer; ext: "webp" | "png" }> {
    // Keep the repo small: resize to 1200px wide WebP (~60-120 KB instead of ~1-2 MB PNG)
    try {
        const sharp = (await import("sharp")).default;
        const data = await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 70 }).toBuffer();
        return { data, ext: "webp" };
    } catch (e) {
        console.warn("[ImageGen] sharp unavailable, storing PNG:", e instanceof Error ? e.message : e);
        return { data: buf, ext: "png" };
    }
}

async function uploadToStorage(imageBuffer: Buffer, articleId: string): Promise<string | null> {
    const sid = articleId.replace(/[^a-zA-Z0-9_-]/g, "");
    const { data, ext } = await compress(imageBuffer);
    try {
        await ghPutFile(`public/images/articles/${sid}.${ext}`, data, `[draft] image ${sid}`);
        return `/images/articles/${sid}.${ext}`;
    } catch (e) {
        console.error("[ImageGen] Upload error:", e instanceof Error ? e.message : e);
        return null;
    }
}

export async function generateArticleImageCore(
    articleId: string,
    contentEn: string,
    existingPrompt?: string
): Promise<{ success: boolean; imageUrl?: string; imagePrompt?: string; error?: string }> {
    try {
        // 1. Generate or reuse prompt
        const prompt = existingPrompt || await generateImagePrompt(contentEn);
        console.log(`[ImageGen] Prompt: ${prompt.slice(0, 80)}...`);

        // 2. Generate image with Gemini
        const imageBuffer = await generateImageWithGemini(prompt);
        if (!imageBuffer) {
            return {
                success: false,
                imagePrompt: prompt,
                error: "Image generation failed. The prompt was saved — try editing and retrying."
            };
        }

        console.log(`[ImageGen] Image generated: ${imageBuffer.length} bytes`);

        // 3. Upload to Supabase Storage
        const imageUrl = await uploadToStorage(imageBuffer, articleId);
        if (!imageUrl) {
            return {
                success: false,
                imagePrompt: prompt,
                error: "Failed to upload image to storage. Check the GITHUB_TOKEN setting."
            };
        }

        // 4. Update article with imageUrl
        const existing = await getArticleById(articleId);
        if (existing) await updateArticle({ ...existing, imageUrl, imagePrompt: prompt });

        return { success: true, imageUrl, imagePrompt: prompt };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[ImageGen] Error:", message);
        return { success: false, error: message };
    }
}
