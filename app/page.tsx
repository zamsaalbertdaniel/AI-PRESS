"use client";
import React from 'react';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import BentoGrid from '@/components/home/BentoGrid';
import AISearchFloating from '@/components/ui/AISearchFloating';
import SmartTabs from '@/components/home/SmartTabs';
import QuickBites from '@/components/home/QuickBites';
import CryptoHub from '@/components/home/CryptoHub';
import GlassCard from '@/components/ui/GlassCard';

export default function Home() {
  const { language } = useLanguage();

  return (
    <main className={styles.main}>
      <div className={styles.nebula1}></div>
      <div className={styles.nebula2}></div>

      {/* 1. Neural News Ticker (Extreme top) */}
      <div className={styles.neuralTicker}>
        <div className="container-custom">
          <div className={styles.tickerFlex}>
            <span className={styles.tickerBadge}>LIVE NEURAL FEED</span>
            <p className={styles.tickerText}>
              AGI Breakthrough announced by DeepMind • NVIDIA releases Blackwell chips with 20 Petaflops • Midjourney v7 alpha testing begins for Pro users • OpenAI GPT-5 training cluster operational in Iowa
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom">
        {/* 2. Hero Header */}
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>
            {language === 'ro' ? 'Futurism Cald' : 'Warm Futurism'}<span className={styles.dot}>.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {language === 'ro'
              ? 'Instrumente pentru Revoluția AI. O platformă de știri neurale de înaltă fidelitate.'
              : 'Instrumentation for the AI Revolution. A high-fidelity neural news platform.'}
          </p>
        </header>

        {/* 3. Trending & Quick Bites (Dashboard Style) */}
        <section className={styles.upperDashboard}>
          <div className={styles.trendingCase}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Trending Now</h2>
            </div>
            <div className={styles.trendingGrid}>
              <GlassCard className={styles.trendingCard} hoverEffect={true}>
                <span className={styles.cardBadge}>#1 RANKED</span>
                <h3 className={styles.cardTitle}>AGI in 2026: The Dawn of Reasoning</h3>
                <p className={styles.cardExcerpt}>DeepMind's new logic engine bridges the gap between neural intuition and symbolic truth.</p>
              </GlassCard>
              <GlassCard className={styles.trendingCard} hoverEffect={true}>
                <span className={styles.cardBadge}>CORE TECH</span>
                <h3 className={styles.cardTitle}>NVIDIA Blackwell Architecture</h3>
                <p className={styles.cardExcerpt}>A new paradigm for large-scale model training with sub-20ms latency.</p>
              </GlassCard>
            </div>
          </div>

          <div className={styles.quickBitesCase}>
            <QuickBites />
          </div>
        </section>

        {/* 4. Main News Grid (Bento) */}
        <section className={styles.contentSection}>
          <div className={styles.contentHeader}>
            <h2 className={styles.sectionTitle}>Neural Pipeline</h2>
            <div className={styles.tabsWrapper}>
              <SmartTabs />
            </div>
          </div>
          <BentoGrid language={language} />
        </section>

        {/* 5. Data & Economy (Crypto Hub) */}
        <section className={styles.dataSection}>
          <div className={styles.dataGrid}>
            <div className={styles.marketColumn}>
              <CryptoHub />
            </div>
            <div className={styles.explainerColumn}>
              <GlassCard className={styles.explainerCard}>
                <h3 className={styles.explainerTitle}>AI Explained: The Prompt</h3>
                <p className={styles.explainerText}>The bridge between human intent and machine execution. Discover how latent space mapping works.</p>
                <button className={styles.explainerBtn}>Neural Guide →</button>
              </GlassCard>
              <div className={styles.socialStrip}>
                <span className={styles.socialLabel}>JOIN THE FEED:</span>
                <div className={styles.socialIcons}>
                  <span>𝕏</span> <span>FB</span> <span>IG</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AISearchFloating />
    </main>
  );
}
