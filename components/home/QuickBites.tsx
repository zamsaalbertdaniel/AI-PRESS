import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import styles from './QuickBites.module.css';

const BITES = [
    { id: 1, time: "10m ago", text: "OpenAI releases GPT-4.5 turbo sneak peek." },
    { id: 2, time: "1h ago", text: "NVIDIA shares jump 5% on new chip news." },
    { id: 3, time: "2h ago", text: "Midjourney v7 alpha testing begins." },
    { id: 4, time: "3h ago", text: "Google DeepMind solves new protein folding." },
];

export default function QuickBites() {
    return (
        <div className={styles.wrapper}>
            <h3 className={styles.label}>Quick Bites</h3>
            <div className={styles.scroll}>
                {BITES.map((bite) => (
                    <GlassCard key={bite.id} className={styles.card}>
                        <span className={styles.time}>{bite.time}</span>
                        <p className={styles.text}>{bite.text}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
