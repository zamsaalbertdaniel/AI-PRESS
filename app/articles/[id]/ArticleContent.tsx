"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import TLDRBox from '@/components/ui/TLDRBox';
import styles from './page.module.css';

interface ArticleContentProps {
    titleEn: string;
    titleRo: string;
    contentEn: string;
    contentRo: string;
    aiTakeEn: string;
    aiTakeRo: string;
    category: string;
    readTime: string;
    publishDate: string;
}

export default function ArticleContent({
    titleEn, titleRo,
    contentEn, contentRo,
    aiTakeEn, aiTakeRo,
    category, readTime, publishDate,
}: ArticleContentProps) {
    const { language } = useLanguage();

    const title = language === 'ro' ? (titleRo || titleEn) : titleEn;
    const content = language === 'ro' ? (contentRo || contentEn) : contentEn;
    const aiTake = language === 'ro' ? (aiTakeRo || aiTakeEn) : aiTakeEn;

    return (
        <div className={styles.article}>
            <header className={styles.header}>
                <div className="container-custom">
                    <span className={styles.category}>{category}</span>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.meta}>
                        <span>By AI Press</span> • <span>{readTime}</span> • <span>{new Date(publishDate).toLocaleDateString()}</span>
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
