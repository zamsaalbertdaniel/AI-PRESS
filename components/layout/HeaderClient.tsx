"use client";
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Header.module.css';

interface HeaderClientProps {
    tickerText: string;
}

export default function HeaderClient({ tickerText }: HeaderClientProps) {
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <header className={styles.header}>
            {/* Top Bar: Live Ticker & Socials */}
            <div className={styles.topBar}>
                <div className={`container-custom ${styles.topContainer}`}>
                    <div className={styles.ticker}>
                        <span className={styles.liveDot}>● LIVE DATA</span>
                        <div className={styles.tickerWrapper}>
                            <span className={styles.tickerText}>
                                {tickerText} &nbsp; • &nbsp; {tickerText}
                            </span>
                        </div>
                    </div>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialIcon} aria-label="Facebook">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="TikTok">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <div className={`container-custom ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    AI<span className={styles.highlight}>Press</span>
                </Link>

                <div className={styles.rightGroup}>
                    <nav className={styles.nav}>
                        <Link href="/about" className={styles.link}>{t('nav.about')}</Link>
                        <Link href="#events" className={styles.link}>{t('nav.events')}</Link>
                    </nav>

                    <button onClick={toggleLanguage} className={styles.langToggle} aria-label="Toggle Language">
                        <span className={language === 'ro' ? styles.active : styles.inactive}>RO</span>
                        <span className={styles.divider}>/</span>
                        <span className={language === 'en' ? styles.active : styles.inactive}>EN</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
