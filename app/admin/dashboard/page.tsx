"use client";
import React, { useState, useEffect } from 'react';
import PendingArticlesGrid from '@/components/admin/PendingArticlesGrid';
import styles from './page.module.css';
import { fetchArticles } from '@/app/actions/articles';
import { runNeuralScraperAction } from '@/app/actions/ai';
import { Article } from '@/types';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState<Article[]>([]);

    const loadArticles = async () => {
        const data = await fetchArticles();
        setArticles(data);
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const runScraper = async () => {
        setLoading(true);
        const result = await runNeuralScraperAction();
        if (result.success) {
            await loadArticles();
        }
        setLoading(false);
    };

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Mission Control</h1>
                    <p className={styles.subtitle}>Neural orchestration & content pipeline management.</p>
                </div>
                <div className={styles.topActions}>
                    <button
                        onClick={runScraper}
                        disabled={loading}
                        className={`${styles.scrapeBtn} ${loading ? styles.busy : ''}`}
                    >
                        {loading ? 'Neural Link Active...' : '✨ Run Neural Scraper'}
                    </button>
                </div>
            </header>

            <div className={styles.mainGrid}>
                {/* Content Pipeline - 2/3 of space */}
                <section className={styles.pipelineSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Neural Content Inbound</h2>
                        <span className={styles.badgeCount}>{articles.length} total</span>
                    </div>
                    <PendingArticlesGrid articles={articles.map(a => ({
                        id: String(a.id),
                        title: a.titleEn,
                        source: "Neural Fetch",
                        status: (a.status === 'ai-processed' ? 'ai-processed' : (a.status === 'published' ? 'published' : 'review')) as "ai-processed" | "published" | "review",
                        date: "Today"
                    }))} />
                </section>

                {/* Sidebar Stats - 1/3 of space */}
                <aside className={styles.sidebar}>
                    <div className={styles.sideSection}>
                        <h3 className={styles.sideTitle}>System Health</h3>
                        <div className={styles.statCard}>
                            <div className={styles.statValueGood}>
                                Core System: Operational
                            </div>
                            <div className={styles.latency}>Latency: 12ms</div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '92%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.sideSection}>
                        <h3 className={styles.sideTitle}>Intelligence Metrics</h3>
                        <div className={styles.miniStatsGrid}>
                            <div className={styles.miniCard}>
                                <span className={styles.miniLabel}>Pending</span>
                                <span className={styles.miniValue}>{articles.filter(a => a.status !== 'published').length}</span>
                            </div>
                            <div className={styles.miniCard}>
                                <span className={styles.miniLabel}>Active</span>
                                <span className={styles.miniValue}>{articles.filter(a => a.status === 'published').length}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.sideSection}>
                        <h3 className={styles.sideTitle}>Command Log</h3>
                        <div className={styles.logBox}>
                            <div className={styles.logLine}>[SYS] Neural link established...</div>
                            <div className={styles.logLine}>[DB] Read success (articles.json)</div>
                            {loading && <div className={styles.logLine}>[AI] Initializing scraper...</div>}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
