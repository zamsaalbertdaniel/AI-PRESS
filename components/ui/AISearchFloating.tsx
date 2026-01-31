"use client";
import React, { useState } from 'react';
import styles from './AISearchFloating.module.css';

export default function AISearchFloating() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
                <div className={styles.chatHeader}>
                    <span>AI Insight</span>
                    <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>×</button>
                </div>
                <div className={styles.chatBody}>
                    <p className={styles.welcomeMsg}>Ask me anything about today's AI news...</p>
                    {/* Placeholder for chat interface */}
                </div>
                <div className={styles.chatInputArea}>
                    <input type="text" placeholder="What happened in robotics today?" className={styles.input} />
                </div>
            </div>

            <button
                className={`${styles.floatBtn} ${isOpen ? styles.hideBtn : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        </>
    );
}
