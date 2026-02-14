import React from 'react';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.notFound}>
            <div className={styles.glitch}>404</div>
            <h1 className={styles.title}>Signal Lost</h1>
            <p className={styles.description}>
                The neural pathway you&apos;re looking for doesn&apos;t exist in our network.
                It may have been moved, deleted, or never existed.
            </p>
            <Link href="/" className={styles.homeLink}>
                ← Return to Home
            </Link>
        </div>
    );
}
