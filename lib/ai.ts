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

export async function callAI(
    prompt: string,
    systemPrompt: string = "You are a helpful assistant for AIPress, a futuristic news platform."
): Promise<AIResponse> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("AI Warning: GEMINI_API_KEY is not set. Returning simulated response.");
        return {
            success: true,
            data: "This is a simulated AI response because your Gemini API key is not yet configured in .env.local."
        };
    }

    try {
        const model = getGenAI().getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemPrompt + "\n\nStyle: Warm Futurism. Premium, tech-optimistic, cinematic tone. Language: Romanian/English as requested.",
        });

        // For "SF Magic" we use a chat-like structure for better grounding
        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, data: text };
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return { success: false, error: error.message || "Gemini API Error" };
    }
}

/**
 * Advanced Research: Searches for live news using Google Search Grounding
 */
export async function searchAndResearchNews(query: string): Promise<AIResponse> {
    try {
        const model = getGenAI().getGenerativeModel({
            model: "gemini-2.0-flash",
            tools: [
                {
                    // @ts-ignore - Google Search Grounding for Gemini 2.0
                    googleSearch: {},
                },
            ],
        });

        const prompt = `Research the latest information about: ${query}. 
        Focus on finding at least 3 distinct facts or recent events. 
        Format as a professional summary for a news editor.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return { success: true, data: text };
    } catch (error: any) {
        console.error("Gemini Research Error:", error);
        return { success: false, error: error.message };
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
