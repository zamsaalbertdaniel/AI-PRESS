import { MetadataRoute } from 'next';
import { fetchPublishedArticles } from '@/app/actions/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipress.business';

    // 1. Fetch ONLY published articles to include in sitemap
    const articles = await fetchPublishedArticles();

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
