"use server";

import { getAdminClient } from "@/lib/supabase";
import { generateImagePrompt } from "@/lib/ai";

/**
 * Server-side image generation for articles.
 * 1. Generates an image prompt via Gemini AI
 * 2. Fetches the image from Pollinations.ai server-side (with retry)
 * 3. Uploads to Supabase Storage for permanent hosting
 * 4. Returns the public URL
 */

const POLLINATIONS_URL = "https://image.pollinations.ai/prompt";
const IMAGE_BUCKET = "article-images";

async function fetchImageWithRetry(prompt: string, maxRetries = 3): Promise<Buffer | null> {
    const url = `${POLLINATIONS_URL}/${encodeURIComponent(prompt)}?width=1080&height=720&nologo=true`;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[ImageGen] Attempt ${attempt}/${maxRetries}...`);
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

            const response = await fetch(url, {
                signal: controller.signal,
                headers: { 'Accept': 'image/*' },
            });
            clearTimeout(timeout);

            if (!response.ok) {
                console.warn(`[ImageGen] HTTP ${response.status} on attempt ${attempt}`);
                continue;
            }

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.startsWith('image/')) {
                console.warn(`[ImageGen] Unexpected content-type: ${contentType}`);
                continue;
            }

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (err) {
            console.warn(`[ImageGen] Attempt ${attempt} failed:`, err instanceof Error ? err.message : err);
        }
    }
    return null;
}

async function ensureBucketExists() {
    const admin = getAdminClient();
    const { data: buckets } = await admin.storage.listBuckets();
    const exists = buckets?.some(b => b.name === IMAGE_BUCKET);
    if (!exists) {
        await admin.storage.createBucket(IMAGE_BUCKET, {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
        });
    }
}

async function uploadToStorage(imageBuffer: Buffer, articleId: string): Promise<string | null> {
    const admin = getAdminClient();
    await ensureBucketExists();

    const filename = `${articleId}-${Date.now()}.png`;
    const { error } = await admin.storage
        .from(IMAGE_BUCKET)
        .upload(filename, imageBuffer, {
            contentType: 'image/png',
            upsert: true,
        });

    if (error) {
        console.error("[ImageGen] Upload error:", error.message);
        return null;
    }

    const { data: urlData } = admin.storage
        .from(IMAGE_BUCKET)
        .getPublicUrl(filename);

    return urlData.publicUrl;
}

export async function generateArticleImage(
    articleId: string,
    contentEn: string,
    existingPrompt?: string
): Promise<{ success: boolean; imageUrl?: string; imagePrompt?: string; error?: string }> {
    try {
        // 1. Generate or reuse prompt
        const prompt = existingPrompt || await generateImagePrompt(contentEn);
        console.log(`[ImageGen] Prompt: ${prompt.slice(0, 80)}...`);

        // 2. Fetch image from Pollinations server-side
        const imageBuffer = await fetchImageWithRetry(prompt);
        if (!imageBuffer) {
            return {
                success: false,
                imagePrompt: prompt,
                error: "Image generation service is temporarily unavailable. The prompt was saved — you can retry later."
            };
        }

        // 3. Upload to Supabase Storage
        const imageUrl = await uploadToStorage(imageBuffer, articleId);
        if (!imageUrl) {
            return {
                success: false,
                imagePrompt: prompt,
                error: "Failed to upload image to storage. Please check Supabase configuration."
            };
        }

        // 4. Update article with imageUrl
        const admin = getAdminClient();
        await admin.from("articles").update({
            image_url: imageUrl,
            image_prompt: prompt,
        }).eq("id", articleId);

        return { success: true, imageUrl, imagePrompt: prompt };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[ImageGen] Error:", message);
        return { success: false, error: message };
    }
}
