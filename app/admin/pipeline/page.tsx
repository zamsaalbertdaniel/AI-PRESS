"use client";
import React, { useState, useEffect } from 'react';
import { fetchArticles } from '@/app/actions/articles';
import { processArticleWithAI } from '@/app/actions/ai';
import { deleteArticleAction, saveArticleAction } from '@/app/actions/articles';
import { Article } from '@/types';
import GlassCard from '@/components/ui/GlassCard';
import StatusBadge from '@/components/admin/StatusBadge';
import styles from './page.module.css';

export default function ContentPipeline() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [processing, setProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');

    const loadArticles = async () => {
        const data = await fetchArticles();
        setArticles(data);
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const handleProcess = async (article: Article) => {
        setProcessing(article.id);
        const result = await processArticleWithAI(article);
        if (result.success) {
            await loadArticles();
        }
        setProcessing(null);
    };

    const handlePublish = async (article: Article) => {
        await saveArticleAction({ ...article, status: 'published' });
        await loadArticles();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this article permanently?')) {
            await deleteArticleAction(id);
            await loadArticles();
        }
    };

    const filtered = filter === 'all'
        ? articles
        : articles.filter(a => a.status === filter);

    const counts = {
        all: articles.length,
        draft: articles.filter(a => a.status === 'draft').length,
        'ai-processed': articles.filter(a => a.status === 'ai-processed').length,
        published: articles.filter(a => a.status === 'published').length,
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Content Pipeline</h1>
                    <p className={styles.subtitle}>Manage your entire content workflow — from draft to live.</p>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className={styles.filters}>
                {(['all', 'draft', 'ai-processed', 'published'] as const).map(f => (
                    <button
                        key={f}
                        className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'All' : f === 'ai-processed' ? 'AI Processed' : f.charAt(0).toUpperCase() + f.slice(1)}
                        <span className={styles.count}>{counts[f]}</span>
                    </button>
                ))}
            </div>

            {/* Articles List */}
            <div className={styles.list}>
                {filtered.length === 0 && (
                    <div className={styles.empty}>
                        No articles in this category. Run the Neural Scraper from Mission Control to generate new content.
                    </div>
                )}

                {filtered.map(article => (
                    <GlassCard key={article.id} className={styles.articleCard}>
                        <div className={styles.cardTop}>
                            <div className={styles.cardInfo}>
                                <StatusBadge status={
                                    article.status === 'ai-processed' ? 'ai-processed' :
                                        article.status === 'published' ? 'published' : 'review'
                                } />
                                <span className={styles.category}>
                                    {article.category || 'Uncategorized'}
                                </span>
                                <span className={styles.date}>
                                    {new Date(article.publishDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <h3 className={styles.articleTitle}>{article.titleEn}</h3>
                        <p className={styles.articleSummary}>{article.summaryEn}</p>

                        <div className={styles.cardActions}>
                            {article.status === 'draft' && (
                                <button
                                    className={styles.processBtn}
                                    onClick={() => handleProcess(article)}
                                    disabled={processing === article.id}
                                >
                                    {processing === article.id ? '⏳ Processing...' : '🧠 AI Process'}
                                </button>
                            )}
                            {(article.status === 'ai-processed' || article.status === 'draft') && (
                                <button
                                    className={styles.publishBtn}
                                    onClick={() => handlePublish(article)}
                                >
                                    ✅ Publish
                                </button>
                            )}
                            <a
                                href={`/admin/editor/${article.id}`}
                                className={styles.editBtn}
                            >
                                ✏️ Edit
                            </a>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(article.id)}
                            >
                                🗑️
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
