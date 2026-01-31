import { MetadataRoute } from 'next';
import { fetchArticles } from '@/app/actions/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://aipress.ro'; // Placeholder for your future domain

    // 1. Fetch all articles to include in sitemap
    const articles = await fetchArticles();

    const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.id}`,
        lastModified: new Date(article.publishDate),
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    // 2. Static pages
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        ...articleEntries,
    ];
}
