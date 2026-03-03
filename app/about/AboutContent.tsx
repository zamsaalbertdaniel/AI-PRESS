"use client";
import React from 'react';
import styles from './page.module.css';
import GlassCard from '@/components/ui/GlassCard';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutContent() {
    const { t } = useLanguage();

    return (
        <div className={styles.about}>
            <div className="container-custom">
                <header className={styles.hero}>
                    <div className={styles.bananaBadge}>🛡️ {t('about.badge')}</div>
                    <h1 className={styles.title}>{t('about.title')}</h1>
                    <p className={styles.subtitle}>
                        {t('about.subtitle')}
                    </p>
                </header>

                <div className={styles.visual}>
                    <div className={styles.neuralPulse}></div>
                    <div className={styles.neuralBanana}>🧠</div>
                    <div style={{ position: 'absolute', bottom: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 600, letterSpacing: '6px' }}>
                        SYSTEM CORE: ONLINE
                    </div>
                </div>

                <div className={styles.grid}>
                    <GlassCard className={styles.contentBlock}>
                        <h2>{t('about.mission.title')}</h2>
                        <p>{t('about.mission.p1')}</p>
                        <p>{t('about.mission.p2')}</p>
                    </GlassCard>

                    <GlassCard className={styles.contentBlock}>
                        <h2>{t('about.vision.title')}</h2>
                        <p>{t('about.vision.p1')}</p>
                        <p>{t('about.vision.p2')}</p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
