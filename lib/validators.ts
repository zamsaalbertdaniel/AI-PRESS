import { z } from "zod";

export const articleSchema = z.object({
    id: z.string().min(1),
    titleEn: z.string().min(1),
    titleRo: z.string().min(1),
    summaryEn: z.string().min(1),
    summaryRo: z.string(),
    contentEn: z.string().min(1),
    contentRo: z.string(),          // empty until AI Processing
    aiTakeEn: z.string(),
    aiTakeRo: z.string(),
    imagePrompt: z.string(),
    imageUrl: z.string().optional(),
    category: z.string().min(1),
    tag: z.string().min(1),
    readTime: z.string().min(1),
    status: z.enum(["draft", "ai-processed", "published"]),
    publishDate: z.string().min(1),
    trendingRank: z.number().int().optional(),
});

export const idSchema = z.string().min(1);
export const passwordSchema = z.string().min(8);
