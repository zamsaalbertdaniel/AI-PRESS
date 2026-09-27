import { promises as fs } from "fs";
import path from "path";
import { Article } from "@/types";
import { githubEnabled, ghGetFile, ghListDir, ghPutFile, ghDeleteFile } from "./github";

/**
 * AIPress DB Layer — Git Edition (free, never pauses)
 *
 * Each article is one compact JSON file in content/articles/<id>.json.
 * - Public reads: local filesystem (bundled with every deploy → instant, no network).
 * - Admin reads: GitHub API when GITHUB_TOKEN is set (sees fresh drafts), else filesystem.
 * - Writes: GitHub commits. Drafts use a "[draft]" commit message → Vercel skips the
 *   build (see vercel.json ignoreCommand). Publishing triggers a normal deploy.
 */

const DIR = "content/articles";
const localDir = () => path.join(process.cwd(), DIR);

const byDateDesc = (a: Article, b: Article) =>
    (b.publishDate || "").localeCompare(a.publishDate || "");

async function readLocal(): Promise<Article[]> {
    try {
        const files = (await fs.readdir(localDir())).filter((f) => f.endsWith(".json"));
        const list = await Promise.all(
            files.map(async (f) => JSON.parse(await fs.readFile(path.join(localDir(), f), "utf8")) as Article)
        );
        return list.sort(byDateDesc);
    } catch (e) {
        console.error("readLocal failed:", e);
        return [];
    }
}

async function readRemote(): Promise<Article[]> {
    const names = (await ghListDir(DIR)).filter((f) => f.endsWith(".json"));
    const list = await Promise.all(
        names.map(async (n) => {
            const f = await ghGetFile(`${DIR}/${n}`);
            return f ? (JSON.parse(f.content.toString("utf8")) as Article) : null;
        })
    );
    return (list.filter(Boolean) as Article[]).sort(byDateDesc);
}

const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");

// ────────────────── reads ──────────────────

export async function getArticles(): Promise<Article[]> {
    if (githubEnabled()) {
        try {
            return await readRemote();
        } catch (e) {
            console.error("getArticles remote failed, using local:", e);
        }
    }
    return readLocal();
}

export async function getPublishedArticles(): Promise<Article[]> {
    return (await readLocal()).filter((a) => a.status === "published");
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    return (await getArticles()).find((a) => a.id === id);
}

export async function getPublishedArticleById(id: string): Promise<Article | undefined> {
    return (await getPublishedArticles()).find((a) => a.id === id);
}

// ────────────────── writes ──────────────────

export async function updateArticle(article: Article): Promise<void> {
    const { createdAt: _c, updatedAt: _u, ...clean } = article;
    void _c; void _u;
    const json = JSON.stringify(clean);
    const tag = article.status === "published" ? "publish" : "[draft]";
    await ghPutFile(`${DIR}/${safeId(article.id)}.json`, json, `${tag} ${article.titleEn.slice(0, 60)}`);
}

export async function deleteArticle(id: string): Promise<void> {
    const sid = safeId(id);
    await ghDeleteFile(`${DIR}/${sid}.json`, `remove article ${sid}`);
    for (const ext of ["webp", "png"]) {
        await ghDeleteFile(`public/images/articles/${sid}.${ext}`, `[draft] remove image ${sid}`).catch(() => {});
    }
}
