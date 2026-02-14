"use client";
import React, { useState, useRef } from 'react';
import styles from './AISearchFloating.module.css';

interface ChatMessage {
    role: 'user' | 'ai';
    content: string;
}

export default function AISearchFloating() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = query.trim();
        if (!trimmed || loading) return;

        // Add user message
        const userMsg: ChatMessage = { role: 'user', content: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setLoading(true);

        try {
            const { searchWithAI } = await import('@/app/actions/search');
            const result = await searchWithAI(trimmed);

            const aiMsg: ChatMessage = {
                role: 'ai',
                content: result.success && result.data
                    ? result.data
                    : result.error || 'Sorry, I could not process that request.'
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', content: 'Connection error. Please try again.' }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <>
            <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
                <div className={styles.chatHeader}>
                    <span>AI Insight</span>
                    <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>×</button>
                </div>
                <div className={styles.chatBody}>
                    {messages.length === 0 && (
                        <p className={styles.welcomeMsg}>Ask me anything about AI &amp; tech news...</p>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                            <span className={styles.msgLabel}>{msg.role === 'user' ? 'You' : 'AI'}</span>
                            <p className={styles.msgText}>{msg.content}</p>
                        </div>
                    ))}
                    {loading && (
                        <div className={`${styles.message} ${styles.ai}`}>
                            <span className={styles.msgLabel}>AI</span>
                            <p className={styles.msgText}>Thinking...</p>
                        </div>
                    )}
                </div>
                <form className={styles.chatInputArea} onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="What happened in robotics today?"
                        className={styles.input}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                </form>
            </div>

            <button
                className={`${styles.floatBtn} ${isOpen ? styles.hideBtn : ''}`}
                onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        </>
    );
}
