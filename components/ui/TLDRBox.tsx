import React from 'react';
import styles from './TLDRBox.module.css';

interface TLDRProps {
    bullets: string[];
}

export default function TLDRBox({ bullets }: TLDRProps) {
    return (
        <div className={styles.box}>
            <h4 className={styles.title}>
                <span className={styles.icon}>⚡</span> AI Quick Insight
            </h4>
            <ul className={styles.list}>
                {bullets.map((bullet, index) => (
                    <li key={index} className={styles.item}>{bullet}</li>
                ))}
            </ul>
        </div>
    );
}
