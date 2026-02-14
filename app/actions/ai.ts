"use server";

import { Article } from "@/types";
import { translateToRomanian, generateEditorialTake, generateImagePrompt, callAI } from "@/lib/ai";
import { saveArticleAction } from "./articles";
import { requireAdmin } from "@/lib/auth";
import { randomUUID } from "crypto";

/**
 * Automates the enrichment of an article using AI
 */
export async function processArticleWithAI(article: Article) {
    try {
        await requireAdmin();
        const sourceContent = article.contentEn;

        // 1. Run AI tasks in parallel for speed
        const [translated, editorialRo, editorialEn, imagePrompt] = await Promise.all([
            translateToRomanian(sourceContent),
            generateEditorialTake(sourceContent, 'ro'),
            generateEditorialTake(sourceContent, 'en'),
            generateImagePrompt(sourceContent)
        ]);

        // 2. Update article object
        const updatedArticle: Article = {
            ...article,
            contentRo: translated,
            aiTakeRo: editorialRo,
            aiTakeEn: editorialEn,
            imagePrompt: imagePrompt,
            status: 'ai-processed'
        };

        // 3. Persist changes
        await saveArticleAction(updatedArticle);

        return { success: true, article: updatedArticle };
    } catch (error) {
        console.error("AI Processing failed:", error);
        return { success: false, error: "Failed to process article with AI" };
    }
}

/**
 * Neural Scraper — Uses Gemini to research real AI news and create articles.
 * Generates 2-3 articles per run based on real trending topics.
 */
export async function runNeuralScraperAction(): Promise<{
    success: boolean;
    articles?: Article[];
    error?: string;
}> {
    await requireAdmin();

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

            const result = await saveArticleAction(article);
            if (result.success) {
                savedArticles.push(article);
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
