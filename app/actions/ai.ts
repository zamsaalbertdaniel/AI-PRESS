"use server";

import { Article } from "@/types";
import { runNeuralScraper, enrichArticle } from "@/lib/pipeline";
import { saveArticleAction } from "./articles";
import { requireAdmin } from "@/lib/auth";

/**
 * Automates the enrichment of an article using AI
 */
export async function processArticleWithAI(article: Article) {
    try {
        await requireAdmin();
        const updatedArticle = await enrichArticle(article);

        // 3. Persist changes
        await saveArticleAction(updatedArticle);

        return { success: true, article: updatedArticle };
    } catch (error) {
        console.error("AI Processing failed:", error);
        return { success: false, error: "Failed to process article with AI" };
    }
}

export async function runNeuralScraperAction() {
    await requireAdmin();
    return runNeuralScraper();
}
