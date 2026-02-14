import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className="container-custom">
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            AI<span className={styles.logoHighlight}>Press</span>
                        </Link>
                        <p className={styles.brandDescription}>
                            The first AI-native news platform. Bilingual coverage of artificial intelligence,
                            deep tech, and the future — powered by Warm Futurism.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className={styles.columnTitle}>Platform</h4>
                        <div className={styles.columnLinks}>
                            <Link href="/">Home</Link>
                            <Link href="/events">Events</Link>
                            <Link href="#pipeline">Neural Pipeline</Link>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className={styles.columnTitle}>Company</h4>
                        <div className={styles.columnLinks}>
                            <Link href="#about">About Us</Link>
                            <Link href="mailto:contact@aipress.business">Contact</Link>
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className={styles.columnTitle}>Connect</h4>
                        <div className={styles.columnLinks}>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>© {year} AIPress. All rights reserved.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>

            {/* Ambient glow */}
            <div className={styles.ambientGlow}></div>
        </footer>
    );
}
