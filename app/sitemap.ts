import { MetadataRoute } from 'next';
import { fetchPublishedArticlesPublic } from '@/app/actions/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipress.business';

    // 1. Fetch ONLY published articles to include in sitemap
    const articles = await fetchPublishedArticlesPublic();

    const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.id}`,
        lastModified: new Date(article.publishDate),
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    // 2. Static pages + dynamic articles
    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/events`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...articleEntries,
    ];
}
