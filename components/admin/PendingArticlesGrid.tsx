"use client";
import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import StatusBadge from './StatusBadge';
import styles from './PendingArticlesGrid.module.css';
import Link from 'next/link';

interface Article {
    id: string;
    title: string;
    source: string;
    status: 'draft' | 'ai-processed' | 'published' | 'review';
    date: string;
}

interface Props {
    articles: Article[];
}

export default function PendingArticlesGrid({ articles }: Props) {
    if (articles.length === 0) {
        return <div className={styles.empty}>No pending articles. Run the scraper.</div>
    }

    return (
        <div className={styles.grid}>
            {articles.map((article) => (
                <GlassCard key={article.id} className={styles.card}>
                    <div className={styles.header}>
                        <span className={styles.source}>{article.source}</span>
                        <StatusBadge status={article.status} />
                    </div>
                    <h3 className={styles.title}>{article.title}</h3>
                    <div className={styles.footer}>
                        <span className={styles.date}>{article.date}</span>
                        <div className={styles.actions}>
                            <Link href={`/admin/editor/${article.id}`} className={styles.editBtn}>
                                Edit / Verify
                            </Link>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
