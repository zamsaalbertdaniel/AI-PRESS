"use server";

import { z } from "zod";
import { searchAndResearchNews, callAI } from "@/lib/ai";

/**
 * Rate limiting: simple in-memory counter per minute
 * In production, use Redis or similar
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(key: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW });
        return true;
    }

    if (entry.count >= RATE_LIMIT) {
        return false;
    }

    entry.count++;
    return true;
}

const searchQuerySchema = z.string().min(3, "Query must be at least 3 characters").max(200, "Query too long");

/**
 * AI-powered search action for the floating search component
 * Uses Gemini with Google Search grounding for live data
 */
export async function searchWithAI(query: string) {
    // 1. Validate input
    const parsed = searchQuerySchema.safeParse(query);
    if (!parsed.success) {
        return { success: false, error: parsed.error.errors[0].message };
    }

    // 2. Rate limit check
    if (!checkRateLimit("global_search")) {
        return { success: false, error: "Too many requests. Please wait a moment and try again." };
    }

    // 3. Try Google Search grounding first, fall back to regular AI
    try {
        const result = await searchAndResearchNews(parsed.data);

        if (result.success && result.data) {
            return { success: true, data: result.data };
        }

        // Fallback: use regular AI if search grounding fails
        const fallback = await callAI(
            `Answer this question about AI and technology news: ${parsed.data}. Be concise and informative.`
        );

        if (fallback.success && fallback.data) {
            return { success: true, data: fallback.data };
        }

        return { success: false, error: "AI is temporarily unavailable. Please try again later." };
    } catch (error) {
        console.error("AI Search error:", error);
        return { success: false, error: "An error occurred while searching. Please try again." };
    }
}
