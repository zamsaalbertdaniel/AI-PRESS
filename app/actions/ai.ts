"use server";

import { Article } from "@/types";
import { translateToRomanian, generateEditorialTake, generateImagePrompt } from "@/lib/ai";
import { saveArticleAction } from "./articles";

/**
 * Automates the enrichment of an article using AI
 */
export async function processArticleWithAI(article: Article) {
    try {
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
            status: 'ai-processed' // Upgrade status
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
 * Advanced: Simulates a "Neuromorphic Scraper" that finds new content
 */
export async function runNeuralScraperAction() {
    // In a real app, this would fetch from RSS or another API
    // For this demo, we'll create a new trending draft
    const newArticle: Article = {
        id: Date.now().toString(),
        titleEn: "Neuralink unveils 'Telepathy 2.0' for artistic creation",
        titleRo: "Neuralink dezvăluie 'Telepathy 2.0' pentru creația artistică",
        summaryEn: "A new neural bridge allows direct digital painting from visual imagination.",
        summaryRo: "O nouă punte neuronală permite pictura digitală direct din imaginația vizuală.",
        contentEn: "Today Elon Musk's Neuralink showcased a breakthrough in BCIs. The new firmware update enables users to stream high-resolution mental images into digital canvases. The latency is under 20ms, making it feel like a sub-perceptual extension of the body.",
        contentRo: "", // AI will fill this
        aiTakeEn: "", // AI will fill this
        aiTakeRo: "", // AI will fill this
        imagePrompt: "", // AI will fill this
        category: "Neuroscience",
        tag: "Breaking",
        readTime: "4 min read",
        status: "draft",
        publishDate: new Date().toISOString()
    };

    await saveArticleAction(newArticle);
    return { success: true, article: newArticle };
}
