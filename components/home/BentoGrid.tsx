"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchPublishedArticlesPublic } from '@/app/actions/articles';
import { Article } from '@/types';
import styles from './BentoGrid.module.css';

export default function BentoGrid({ language = 'en' }: { language?: string }) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchPublishedArticlesPublic();
            setArticles(data);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className={styles.grid}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={`${styles.item} ${styles.skeleton}`} />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {articles.map((article, idx) => {
                const isHero = idx === 0;
                const isWide = idx === 1;
                const isTall = idx === 4;

                return (
                    <Link
                        href={`/articles/${article.id}`}
                        key={article.id}
                        className={`
                            ${styles.item} 
                            ${isHero ? styles.heroItem : ''} 
                            ${isWide ? styles.wideItem : ''}
                            ${isTall ? styles.tallItem : ''}
                        `}
                    >
                        {article.imageUrl && (
                            <div className={styles.media}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={article.imageUrl} alt={article.titleEn} className={styles.mediaImg} loading="lazy" />
                            </div>
                        )}
                        <span className={styles.tagOrange}>{article.tag}</span>
                        <h2 className={isHero ? styles.heroTitle : styles.stdTitle}>
                            {language === 'ro' ? article.titleRo : article.titleEn}
                        </h2>
                        {isHero && (
                            <p className={styles.heroSummary}>
                                {language === 'ro' ? article.summaryRo : article.summaryEn}
                            </p>
                        )}
                        <div className={styles.meta}>
                            <span>{article.readTime}</span>
                            {article.trendingRank && <span className={styles.trend}>#{article.trendingRank} Trending</span>}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
