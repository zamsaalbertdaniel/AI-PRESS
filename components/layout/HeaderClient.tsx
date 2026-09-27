"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './Header.module.css';

interface HeaderClientProps {
    tickerText: string;
}

export default function HeaderClient({ tickerText }: HeaderClientProps) {
    const { language, toggleLanguage, t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);

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
                        <a href="https://x.com/aipress" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X (Twitter)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4l7.2 9.3L4.4 20h2.5l5.4-5.4L16.8 20H20l-7.5-9.7L19.3 4h-2.5l-4.9 4.9L8.2 4H4z" fill="currentColor" /></svg>
                        </a>
                        <a href="https://github.com/zamsaalbertdaniel/AI-PRESS" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0 0 12 2z" fill="currentColor" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <div className={`container-custom ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    AI<span className={styles.highlight}>Press</span>
                </Link>

                {/* Hamburger button (mobile) */}
                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen1 : ''}`} />
                    <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen2 : ''}`} />
                    <span className={`${styles.hamburgerLine} ${menuOpen ? styles.hamburgerOpen3 : ''}`} />
                </button>

                <div className={`${styles.rightGroup} ${menuOpen ? styles.rightGroupOpen : ''}`}>
                    <nav className={styles.nav}>
                        <Link href="/about" className={styles.link} onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
                        <Link href="/events" className={styles.link} onClick={() => setMenuOpen(false)}>{t('nav.events')}</Link>
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
