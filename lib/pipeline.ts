import { Article } from "@/types";
import { translateToRomanian, generateEditorialTake, generateImagePrompt, callAI } from "@/lib/ai";
import { updateArticle } from "@/lib/db";
import { articleSchema } from "@/lib/validators";
import { generateArticleImageCore } from "@/lib/images";
import { randomUUID } from "crypto";

/**
 * Fully automatic pipeline: research → write → translate → editorial take → image.
 * Results are saved as "ai-processed" drafts. The admin only presses Publish.
 */
export async function enrichArticle(article: Article): Promise<Article> {
    const src = article.contentEn;
    const [translated, editorialRo, editorialEn, imagePrompt] = await Promise.all([
        translateToRomanian(src),
        generateEditorialTake(src, "ro"),
        generateEditorialTake(src, "en"),
        article.imagePrompt ? Promise.resolve(article.imagePrompt) : generateImagePrompt(src),
    ]);
    return { ...article, contentRo: translated, aiTakeRo: editorialRo, aiTakeEn: editorialEn, imagePrompt, status: "ai-processed" };
}

async function attachImage(article: Article): Promise<Article> {
    // Save first so the image step can find the article, then attach the image URL.
    await updateArticle(article);
    const r = await generateArticleImageCore(article.id, article.contentEn, article.imagePrompt).catch(() => null);
    return r?.success && r.imageUrl ? { ...article, imageUrl: r.imageUrl } : article;
}

/**
 * Neural Scraper — Uses Gemini to research real AI news and create articles.
 * Generates 2-3 articles per run based on real trending topics.
 */
export async function runNeuralScraper(): Promise<{
    success: boolean;
    articles?: Article[];
    error?: string;
}> {
    try {
        // Step 1: Ask Gemini to research the latest AI news
        const researchResult = await callAI(
            `You are a senior news researcher for AIPress, a premium AI & technology news platform.
            Find 2-3 real, high-impact AI/tech news stories from the last 24-48 hours.
            
            For EACH story, return a JSON array with objects containing:
            - "titleEn": Compelling, click-worthy English headline (max 80 chars)
            - "titleRo": Sophisticated Romanian translation of the headline
            - "summaryEn": 2-3 sentence punchy summary in English
            - "summaryRo": Romanian translation of the summary
            - "contentEn": A detailed 300-500 word article in English. Professional, analytical, and cinematic journalist style.
            - "category": one of "AI Research", "Industry", "Robotics", "Neuroscience", "Ethics", "Infrastructure"
            - "tag": one of "Breaking", "Analysis", "Trending", "Deep Dive"
            - "imagePrompt": A professional, minimalist 3D tech visualization of the core topic. Sleek, high-end CGI, cinematic lighting, corporate-tech aesthetic (slate, amber, white light).
            
            IMPORTANT: Return ONLY a valid JSON array. No conversational text, no markdown code blocks.
            Make the stories factual, citing real companies if possible.`,
            "You are a professional tech journalist AI. You output ONLY valid JSON arrays."
        );

        if (!researchResult.success || !researchResult.data) {
            return { success: false, error: researchResult.error || "AI research failed" };
        }

        // Step 2: Parse the AI response
        let rawArticles: Array<{
            titleEn: string;
            titleRo: string;
            summaryEn: string;
            summaryRo: string;
            contentEn: string;
            category: string;
            tag: string;
            imagePrompt: string;
        }>;

        try {
            // Clean potential markdown code fences
            let cleaned = researchResult.data.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }
            rawArticles = JSON.parse(cleaned);
        } catch {
            console.error("Failed to parse AI response:", researchResult.data);
            return { success: false, error: "Failed to parse AI-generated articles" };
        }

        if (!Array.isArray(rawArticles) || rawArticles.length === 0) {
            return { success: false, error: "AI returned no articles" };
        }

        // Step 3: Create and save each article
        const savedArticles: Article[] = [];
        const wordCount = (text: string) => Math.ceil(text.split(/\s+/).length / 200);

        for (const raw of rawArticles.slice(0, 3)) {
            const article: Article = {
                id: randomUUID(),
                titleEn: raw.titleEn || "Untitled",
                titleRo: raw.titleRo || raw.titleEn || "Fără titlu",
                summaryEn: raw.summaryEn || "",
                summaryRo: raw.summaryRo || raw.summaryEn || "",
                contentEn: raw.contentEn || "",
                contentRo: "",
                aiTakeEn: "",
                aiTakeRo: "",
                imagePrompt: raw.imagePrompt || "A futuristic scene involving technology and nature.",
                category: raw.category || "AI Research",
                tag: raw.tag || "Trending",
                readTime: `${Math.max(2, wordCount(raw.contentEn || ""))} min read`,
                status: "draft",
                publishDate: new Date().toISOString(),
            };

            try {
                const enriched = await enrichArticle(article);
                const withImage = await attachImage(enriched);
                articleSchema.parse(withImage);
                await updateArticle(withImage);
                savedArticles.push(withImage);
            } catch (e) {
                console.error("Pipeline: failed to save article", e);
            }
        }

        return {
            success: true,
            articles: savedArticles,
        };
    } catch (error) {
        console.error("Neural Scraper error:", error);
        return { success: false, error: "Neural scraper failed" };
    }
}
