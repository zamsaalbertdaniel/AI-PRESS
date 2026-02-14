"use server";

import { revalidatePath } from "next/cache";
import { Article } from "@/types";
import { getArticles, getPublishedArticles, getArticleById, updateArticle, deleteArticle } from "@/lib/db";
import { articleSchema, idSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/auth";

export async function fetchPublishedArticles() {
    return await getPublishedArticles();
}

export async function fetchArticles() {
    return await getArticles();
}

export async function fetchArticleById(id: string) {
    return await getArticleById(id);
}

export async function saveArticleAction(article: Article) {
    await requireAdmin();
    const parsed = articleSchema.safeParse(article);
    if (!parsed.success) {
        const errorMsg = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        console.error("Validation failed:", errorMsg);
        return { success: false, error: `Validation failed: ${errorMsg}` };
    }
    await updateArticle(article);
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/articles/${article.id}`);
    return { success: true };
}

export async function deleteArticleAction(id: string) {
    await requireAdmin();
    const parsed = idSchema.safeParse(id);
    if (!parsed.success) {
        return { success: false, error: "Invalid article id." };
    }
    await deleteArticle(id);
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
}
