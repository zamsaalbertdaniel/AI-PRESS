import { GoogleGenerativeAI } from "@google/generative-ai";

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

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => {
            setTimeout(() => reject(new Error(`AI request timed out after ${timeoutMs}ms`)), timeoutMs);
        }),
    ]);
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

        const chat = model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.7,
            },
        });

        const result = await withTimeout(chat.sendMessage(prompt), 12000);
        const response = await result.response;
        const text = response.text();

        return { success: true, data: text };
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return { success: false, error: error.message || "Gemini API Error" };
    }
}

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

        const result = await withTimeout(model.generateContent(prompt), 12000);
        const text = result.response.text();

        return { success: true, data: text };
    } catch (error: any) {
        console.error("Gemini Research Error:", error);
        return { success: false, error: error.message };
    }
}

export async function translateToRomanian(content: string): Promise<string> {
    const systemPrompt = "Translate the following English news content into natural, professional Romanian. Ensure a modern, tech-focused tone consistent with a premium news platform.";
    const res = await callAI(content, systemPrompt);
    return res.data || content;
}

export async function generateEditorialTake(content: string, language: 'ro' | 'en' = 'ro'): Promise<string> {
    const systemPrompt = `Analyze the provided news and generate a short, insightful 'Editorial Take' (max 2 sentences). 
    The style should be 'Warm Futurism' - optimistic but critical of cold technology, focusing on human benefit.
    Language: ${language === 'ro' ? 'Romanian' : 'English'}.`;

    const res = await callAI(content, systemPrompt);
    return res.data || (language === 'ro' ? "Analiză în curs..." : "Analysis in progress...");
}

export async function generateImagePrompt(content: string): Promise<string> {
    const systemPrompt = "Create a highly detailed, artistic image prompt for Imagen 3 based on this news. Use a 'Warm Futurism' aesthetic: amber lighting, glass materials, soft gradients, cinematic and clean. Do not include any text in the image.";
    const res = await callAI(content, systemPrompt);
    return res.data || "A futuristic scene involving technology and nature.";
}
