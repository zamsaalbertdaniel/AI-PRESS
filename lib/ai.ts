import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AIPress AI Utility Layer - Gemini "SF Magic" Edition
 * Manages communication with Gemini 2.0 Flash for content automation and research.
 */

interface AIResponse {
    success: boolean;
    data?: string;
    error?: string;
}

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY || "";
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

// Request timeout utility
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
        ),
    ]);
}

export async function callAI(
    prompt: string,
    systemPrompt: string = "You are a helpful assistant for AIPress, a futuristic news platform."
): Promise<AIResponse> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("AI Warning: GEMINI_API_KEY is not set.");
        return {
            success: false,
            error: "AI service is not configured. Please set GEMINI_API_KEY in environment variables."
        };
    }

    try {
        const model = getGenAI().getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemPrompt + "\n\nStyle: Warm Futurism. Premium, tech-optimistic, cinematic tone. Language: Romanian/English as requested.",
        });

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            },
        });

        const result = await withTimeout(chat.sendMessage(prompt), 30000);
        const response = await result.response;
        const text = response.text();

        return { success: true, data: text };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gemini API Error";
        console.error("Gemini API Error:", message);
        return { success: false, error: message };
    }
}

/**
 * Advanced Research: Searches for live news using Google Search Grounding
 */
export async function searchAndResearchNews(query: string): Promise<AIResponse> {
    try {
        const model = getGenAI().getGenerativeModel({
            model: "gemini-2.0-flash",
            // Google Search grounding tool — not yet in the @google/generative-ai types
            tools: [{ googleSearch: {} }] as never,
        });

        const prompt = `Research the latest information about: ${query}. 
        Focus on finding at least 3 distinct facts or recent events. 
        Format as a professional summary for a news editor.`;

        const result = await withTimeout(model.generateContent(prompt), 30000);
        const text = result.response.text();

        return { success: true, data: text };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gemini Research Error";
        console.error("Gemini Research Error:", message);
        // Return failure instead of throwing, so the caller can try fallback
        return { success: false, error: message };
    }
}

/**
 * Specifically handles Romanian translation and adaptation
 */
export async function translateToRomanian(content: string): Promise<string> {
    const systemPrompt = "Translate the following English news content into natural, professional Romanian. Ensure a modern, tech-focused tone consistent with a premium news platform.";
    const res = await callAI(content, systemPrompt);
    return res.data || content;
}

/**
 * Generates the 'AIPress Take' (Editorial Perspective)
 */
export async function generateEditorialTake(content: string, language: 'ro' | 'en' = 'ro'): Promise<string> {
    const systemPrompt = `Analyze the provided news and generate a short, insightful 'Editorial Take' (max 2 sentences). 
    The style should be 'Warm Futurism' - optimistic but critical of cold technology, focusing on human benefit.
    Language: ${language === 'ro' ? 'Romanian' : 'English'}.`;

    const res = await callAI(content, systemPrompt);
    return res.data || (language === 'ro' ? "Analiză în curs..." : "Analysis in progress...");
}

/**
 * Generates a prompt for Midjourney/DALL-E/Imagen based on the news
 */
export async function generateImagePrompt(content: string): Promise<string> {
    const systemPrompt = "Create a highly detailed, artistic image prompt for Imagen 3 based on this news. Use a 'Warm Futurism' aesthetic: amber lighting, glass materials, soft gradients, cinematic and clean. Do not include any text in the image.";
    const res = await callAI(content, systemPrompt);
    return res.data || "A futuristic scene involving technology and nature.";
}
