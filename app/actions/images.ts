"use server";

import { requireAdmin } from "@/lib/auth";
import { generateArticleImageCore } from "@/lib/images";

export async function generateArticleImage(articleId: string, contentEn: string, existingPrompt?: string) {
    await requireAdmin();
    return generateArticleImageCore(articleId, contentEn, existingPrompt);
}
