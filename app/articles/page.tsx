import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchPublishedArticlesPublic } from '@/app/actions/articles';
import GlassCard from '@/components/ui/GlassCard';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Archive | AIPress',
    description: 'The complete AIPress archive — every published story on AI, deep tech, and the future, in English and Romanian.',
    openGraph: {
        title: 'AIPress Archive',
        description: 'Every published story on AI, deep tech, and the future.',
        type: 'website',
    },
};

export const revalidate = 60;

export default async function ArticlesArchivePage() {
    const articles = await fetchPublishedArticlesPublic();

    const categories = Array.from(new Set(articles.map(a => a.category)));

    return (
        <div className={`container-custom ${styles.page}`}>
            <header className={styles.header}>
                <span className={styles.badge}>ARCHIVE</span>
                <h1 className={styles.title}>Every story, distilled.</h1>
                <p className={styles.subtitle}>
                    {articles.length} published {articles.length === 1 ? 'article' : 'articles'}
                    {categories.length > 0 && ` across ${categories.length} categories`}
                </p>
            </header>

            {articles.length === 0 ? (
                <div className={styles.empty}>
                    <p>The neural pipeline is warming up. Published stories will appear here.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {articles.map((article) => (
                        <Link href={`/articles/${article.id}`} key={article.id} className={styles.cardLink}>
                            <GlassCard className={styles.card} hoverEffect={true}>
                                <div className={styles.media}>
                                    {article.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={article.imageUrl} alt={article.titleEn} className={styles.mediaImg} loading="lazy" />
                                    ) : (
                                        <div className={styles.mediaFallback} />
                                    )}
                                    <span className={styles.category}>{article.category}</span>
                                </div>
                                <div className={styles.body}>
                                    <h2 className={styles.cardTitle}>{article.titleEn}</h2>
                                    <p className={styles.excerpt}>{article.summaryEn}</p>
                                    <div className={styles.meta}>
                                        <span>{new Date(article.publishDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        <span>·</span>
                                        <span>{article.readTime}</span>
                                        {article.trendingRank != null && (
                                            <span className={styles.trending}>#{article.trendingRank} Trending</span>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
