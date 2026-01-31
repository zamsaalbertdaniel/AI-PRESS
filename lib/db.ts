import fs from 'fs/promises';
import path from 'path';
import { Article } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'articles.json');

export async function getArticles(): Promise<Article[]> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveArticles(articles: Article[]): Promise<void> {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(articles, null, 2));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
    const articles = await getArticles();
    return articles.find(a => a.id === id);
}

export async function updateArticle(article: Article): Promise<void> {
    const articles = await getArticles();
    const index = articles.findIndex(a => a.id === article.id);

    if (index !== -1) {
        articles[index] = article;
    } else {
        articles.push(article);
    }

    await saveArticles(articles);
}
