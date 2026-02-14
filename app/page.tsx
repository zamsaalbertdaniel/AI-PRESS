import React from 'react';
import styles from './page.module.css';
import dynamic from 'next/dynamic';
import QuickBites from '@/components/home/QuickBites';
import CryptoHub from '@/components/home/CryptoHub';
import GlassCard from '@/components/ui/GlassCard';
import HomeHero from '@/components/home/HomeHero';
import HomePipeline from '@/components/home/HomePipeline';

const AISearchFloating = dynamic(() => import('@/components/ui/AISearchFloating'));

const TRENDING_ITEMS = [
  {
    id: 1,
    badge: "#1 RANKED",
    title: "AGI in 2026: The Dawn of Reasoning",
    excerpt: "DeepMind's new logic engine bridges the gap between neural intuition and symbolic truth.",
    meta: "Research • 6 min read",
  },
  {
    id: 2,
    badge: "CORE TECH",
    title: "NVIDIA Blackwell Architecture",
    excerpt: "A new paradigm for large-scale model training with sub-20ms latency.",
    meta: "Infrastructure • 4 min read",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.nebula1}></div>
      <div className={styles.nebula2}></div>


      <div className="container-custom">
        {/* 2. Hero Header */}
        <HomeHero />

        {/* 3. Trending & Quick Bites (Dashboard Style) */}
        <section className={styles.upperDashboard}>
          <div className={styles.trendingCase}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Trending Now</h2>
            </div>
            <div className={styles.trendingGrid}>
              {TRENDING_ITEMS.map((item, index) => (
                <GlassCard key={item.id} className={styles.trendingCard} hoverEffect={true}>
                  <div className={`${styles.trendingMedia} ${index === 0 ? styles.mediaAurora : styles.mediaCircuit}`}>
                    <div className={styles.mediaOverlay}></div>
                    <span className={styles.cardBadge}>{item.badge}</span>
                  </div>
                  <div className={styles.trendingBody}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardExcerpt}>{item.excerpt}</p>
                    <div className={styles.cardMeta}>{item.meta}</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className={styles.quickBitesCase}>
            <QuickBites />
          </div>
        </section>

        {/* 4. Main News Grid (Bento) */}
        <HomePipeline />

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
                  <a className={styles.socialIcon} href="https://x.com" aria-label="X">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.9 2H22l-7.2 8.2L23 22h-6.7l-4.9-6.4L5.8 22H2.7l7.8-8.9L1 2h6.8l4.4 5.9L18.9 2z" />
                    </svg>
                  </a>
                  <a className={styles.socialIcon} href="https://facebook.com" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M13.5 9.2V7.3c0-.8.2-1.2 1.3-1.2h1.7V3.3h-2.6C11.6 3.3 10 4.6 10 7v2.2H8v2.9h2V22h3.5v-9.9H16l.4-2.9h-2.9z" />
                    </svg>
                  </a>
                  <a className={styles.socialIcon} href="https://instagram.com" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M16.8 3H7.2C4.9 3 3 4.9 3 7.2v9.6C3 19.1 4.9 21 7.2 21h9.6c2.3 0 4.2-1.9 4.2-4.2V7.2C21 4.9 19.1 3 16.8 3zm-4.8 5.3a3.7 3.7 0 1 1 0 7.4 3.7 3.7 0 0 1 0-7.4zm7 9.4c0 1-0.8 1.8-1.8 1.8H7.2c-1 0-1.8-0.8-1.8-1.8V7.2c0-1 0.8-1.8 1.8-1.8h9.6c1 0 1.8 0.8 1.8 1.8v9.6z" />
                      <circle cx="17.6" cy="6.4" r="1.1" />
                    </svg>
                  </a>
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
