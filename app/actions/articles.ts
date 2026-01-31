"use server";

import { revalidatePath } from "next/cache";
import { Article } from "@/types";
import { getArticles, getArticleById, updateArticle } from "@/lib/db";

export async function fetchArticles() {
    return await getArticles();
}

export async function fetchArticleById(id: string) {
    return await getArticleById(id);
}

export async function saveArticleAction(article: Article) {
    await updateArticle(article);
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath(`/articles/${article.id}`);
    return { success: true };
}

export async function deleteArticleAction(id: string) {
    const articles = await getArticles();
    const filtered = articles.filter((a) => a.id !== id);
    const { saveArticles } = await import("@/lib/db");
    await saveArticles(filtered);
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
}
