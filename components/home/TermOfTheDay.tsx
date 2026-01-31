"use client";
import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import styles from './TermOfTheDay.module.css';

export default function TermOfTheDay() {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <GlassCard
            className={styles.card}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.label}>Term of the Day</span>
                    <span className={styles.icon}>?</span>
                </div>

                {!isFlipped ? (
                    <div className={styles.front}>
                        <h3 className={styles.term}>Neuro-Symbolic AI</h3>
                        <p className={styles.tapHint}>Tap to explain</p>
                    </div>
                ) : (
                    <div className={styles.back}>
                        <p className={styles.definition}>
                            A hybrid approach combining neural networks (learning) with symbolic logic (reasoning).
                            It aims to fix AI "hallucinations" by enforcing logical rules.
                        </p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
