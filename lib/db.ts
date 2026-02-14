import { Article } from "@/types";
import { getPublicClient, getAdminClient } from "./supabase";

/**
 * AIPress DB Layer — Supabase Edition
 *
 * Public reads go through the anon client (RLS-filtered).
 * Writes go through the service_role client (full access).
 */

// ────────────────── helpers ──────────────────

/** Map a Supabase snake_case row to the app's camelCase Article type */
function toArticle(row: Record<string, unknown>): Article {
    return {
        id: row.id as string,
        titleEn: row.title_en as string,
        titleRo: row.title_ro as string,
        summaryEn: row.summary_en as string,
        summaryRo: row.summary_ro as string,
        contentEn: row.content_en as string,
        contentRo: row.content_ro as string,
        aiTakeEn: row.ai_take_en as string,
        aiTakeRo: row.ai_take_ro as string,
        imagePrompt: row.image_prompt as string,
        imageUrl: (row.image_url as string) || undefined,
        category: row.category as string,
        tag: row.tag as string,
        readTime: row.read_time as string,
        status: row.status as Article["status"],
        publishDate: row.publish_date as string,
        trendingRank: row.trending_rank != null ? (row.trending_rank as number) : undefined,
    };
}

/** Map a camelCase Article to Supabase snake_case columns */
function toRow(article: Article): Record<string, unknown> {
    return {
        title_en: article.titleEn,
        title_ro: article.titleRo,
        summary_en: article.summaryEn,
        summary_ro: article.summaryRo,
        content_en: article.contentEn,
        content_ro: article.contentRo,
        ai_take_en: article.aiTakeEn,
        ai_take_ro: article.aiTakeRo,
        image_prompt: article.imagePrompt,
        image_url: article.imageUrl ?? null,
        category: article.category,
        tag: article.tag,
        read_time: article.readTime,
        status: article.status,
        publish_date: article.publishDate,
        trending_rank: article.trendingRank ?? null,
        updated_at: new Date().toISOString(),
    };
}

// ────────────────── reads ──────────────────

/**
 * Fetch all articles (admin view — uses service_role to bypass RLS)
 */
export async function getArticles(): Promise<Article[]> {
    const { data, error } = await getAdminClient()
        .from("articles")
        .select("*")
        .order("publish_date", { ascending: false });

    if (error) {
        console.error("getArticles error:", error.message);
        return [];
    }

    return (data ?? []).map(toArticle);
}

/**
 * Fetch only published articles (public-facing — uses anon key + RLS)
 */
export async function getPublishedArticles(): Promise<Article[]> {
    const { data, error } = await getPublicClient()
        .from("articles")
        .select("*")
        .order("publish_date", { ascending: false });

    if (error) {
        console.error("getPublishedArticles error:", error.message);
        return [];
    }

    return (data ?? []).map(toArticle);
}

/**
 * Fetch a single article by ID (admin — bypasses RLS so drafts are visible)
 */
export async function getArticleById(id: string): Promise<Article | undefined> {
    const { data, error } = await getAdminClient()
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return undefined;
    return toArticle(data);
}

/**
 * Fetch a single published article by ID (public-facing — uses anon key + RLS)
 */
export async function getPublishedArticleById(id: string): Promise<Article | undefined> {
    const { data, error } = await getPublicClient()
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !data) return undefined;
    return toArticle(data);
}

// ────────────────── writes ──────────────────

/**
 * Upsert (insert or update) an article.
 * If article.id exists in the DB → update, otherwise → insert.
 */
export async function updateArticle(article: Article): Promise<void> {
    const row = toRow(article);

    // Use upsert — inserts if ID doesn't exist, updates if it does
    const { error } = await getAdminClient()
        .from("articles")
        .upsert({ ...row, id: article.id }, { onConflict: "id" });

    if (error) {
        console.error("updateArticle upsert error:", error.message);
    }
}

/**
 * Delete an article by ID
 */
export async function deleteArticle(id: string): Promise<void> {
    const { error } = await getAdminClient()
        .from("articles")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("deleteArticle error:", error.message);
    }
}

/**
 * Overwrite all articles (legacy compat — prefer updateArticle / deleteArticle)
 */
export async function saveArticles(articles: Article[]): Promise<void> {
    const admin = getAdminClient();

    // Delete removed articles, upsert remaining
    const { error: clearError } = await admin.from("articles").delete().neq("id", "");
    if (clearError) {
        console.error("saveArticles clear error:", clearError.message);
        return;
    }

    if (articles.length === 0) return;

    const rows = articles.map((a) => ({ ...toRow(a), id: a.id || undefined }));
    const { error: insertError } = await admin.from("articles").insert(rows);
    if (insertError) {
        console.error("saveArticles insert error:", insertError.message);
    }
}
