import React from 'react';
import { fetchPublishedArticles } from '@/app/actions/articles';
import { Article } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import styles from './QuickBites.module.css';

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default async function QuickBites() {
    const published = await fetchPublishedArticles();

    // Get last 4 published articles for quick bites
    const recent = published.slice(0, 4);

    // If no published articles, show placeholder
    const bites = recent.length > 0
        ? recent.map((a: Article) => ({
            id: a.id,
            time: timeAgo(a.publishDate),
            text: a.summaryEn.slice(0, 80) + (a.summaryEn.length > 80 ? '...' : ''),
        }))
        : [
            { id: '1', time: 'Now', text: 'AIPress neural pipeline is initializing...' },
            { id: '2', time: 'Now', text: 'Waiting for published articles...' },
        ];

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.label}>Quick Bites</h3>
            <div className={styles.scroll}>
                {bites.map((bite) => (
                    <GlassCard key={bite.id} className={styles.card}>
                        <span className={styles.time}>{bite.time}</span>
                        <p className={styles.text}>{bite.text}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
