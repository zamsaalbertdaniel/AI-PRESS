"use client";
import React, { useState } from 'react';
import styles from './SmartTabs.module.css';

const TABS = [
    { id: 'foryou', label: 'For You' },
    { id: 'creative', label: 'Creative AI' },
    { id: 'business', label: 'Business & Dev' },
    { id: 'crypto', label: 'Crypto & AI' },
    { id: 'recap', label: 'Daily Recap' },
];

export default function SmartTabs() {
    const [activeTab, setActiveTab] = useState('foryou');

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                        {activeTab === tab.id && <span className={styles.indicator} />}
                    </button>
                ))}
            </div>
        </div>
    );
}
