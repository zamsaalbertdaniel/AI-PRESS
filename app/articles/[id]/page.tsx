import React from 'react';
import TLDRBox from '@/components/ui/TLDRBox';
import styles from './page.module.css';
import { fetchPublishedArticleByIdPublic, fetchPublishedArticlesPublic } from '@/app/actions/articles';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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

    // Simplified language handling for the demo Article Page
    const language: string = 'en';

    const title = language === 'ro' ? article.titleRo : article.titleEn;
    const content = language === 'ro' ? (article.contentRo || article.contentEn) : article.contentEn;
    const aiTake = language === 'ro' ? (article.aiTakeRo || article.aiTakeEn) : article.aiTakeEn;

    return (
        <div className={styles.article}>
            <header className={styles.header}>
                <div className="container-custom">
                    <span className={styles.category}>{article.category}</span>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.meta}>
                        <span>By AI Press</span> • <span>{article.readTime}</span> • <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </header>

            <div className={`container-custom ${styles.content}`}>
                <TLDRBox bullets={[aiTake]} />

                <div className={styles.body}>
                    {content.split('\n').filter(Boolean).map((paragraph, idx) => (
                        <p key={idx} style={{ marginBottom: '1em', lineHeight: 1.8 }}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
