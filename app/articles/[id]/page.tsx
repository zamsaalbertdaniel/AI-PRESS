import React from 'react';
import { fetchPublishedArticleByIdPublic, fetchPublishedArticlesPublic } from '@/app/actions/articles';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ArticleContent from './ArticleContent';

type Params = Promise<{ id: string }>;

// 1. Dynamic SEO Metadata
export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
    const params = await props.params;
    const article = await fetchPublishedArticleByIdPublic(params.id);

    if (!article) return { title: 'Article Not Found | AIPress' };

    return {
        title: `${article.titleEn} | AIPress`,
        description: article.summaryEn,
        openGraph: {
            title: article.titleEn,
            description: article.summaryEn,
            type: 'article',
            publishedTime: article.publishDate,
            authors: ['AI Press'],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.titleEn,
            description: article.summaryEn,
        }
    };
}

// 2. Pre-render existing published articles (Performance)
export async function generateStaticParams() {
    const articles = await fetchPublishedArticlesPublic();
    return articles.map((article) => ({
        id: article.id,
    }));
}

// 3. ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function ArticlePage(props: { params: Params }) {
    const params = await props.params;
    const article = await fetchPublishedArticleByIdPublic(params.id);

    if (!article) {
        notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aipress.business';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.titleEn,
        description: article.summaryEn,
        datePublished: article.publishDate,
        author: {
            '@type': 'Organization',
            name: 'AIPress',
            url: siteUrl,
        },
        publisher: {
            '@type': 'Organization',
            name: 'AIPress',
            url: siteUrl,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteUrl}/articles/${article.id}`,
        },
        articleSection: article.category,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleContent
                titleEn={article.titleEn}
                titleRo={article.titleRo}
                contentEn={article.contentEn}
                contentRo={article.contentRo}
                aiTakeEn={article.aiTakeEn}
                aiTakeRo={article.aiTakeRo}
                category={article.category}
                readTime={article.readTime}
                publishDate={article.publishDate}
            />
        </>
    );
}

