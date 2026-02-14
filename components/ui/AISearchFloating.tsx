"use client";
import React, { FormEvent, useState } from 'react';
import styles from './AISearchFloating.module.css';

type SearchState = {
    loading: boolean;
    result: string;
    error: string;
};

export default function AISearchFloating() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [state, setState] = useState<SearchState>({ loading: false, result: '', error: '' });

    const submitSearch = async (event: FormEvent) => {
        event.preventDefault();

        if (query.trim().length < 3) {
            setState({ loading: false, result: '', error: 'Please type at least 3 characters.' });
            return;
        }

        setState({ loading: true, result: '', error: '' });

        try {
            const res = await fetch('/api/ai/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query.trim() }),
            });

            const payload = await res.json();

            if (!res.ok || !payload.success) {
                setState({ loading: false, result: '', error: payload.error || 'Search failed.' });
                return;
            }

            setState({ loading: false, result: payload.data || 'No answer available.', error: '' });
        } catch {
            setState({ loading: false, result: '', error: 'Could not connect to AI service.' });
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
                    <p className={styles.welcomeMsg}>Ask me anything about today's AI news...</p>
                    {state.loading && <p className={styles.welcomeMsg}>Searching with Gemini...</p>}
                    {!!state.error && <p className={styles.welcomeMsg}>{state.error}</p>}
                    {!!state.result && <p className={styles.welcomeMsg}>{state.result}</p>}
                </div>
                <form className={styles.chatInputArea} onSubmit={submitSearch}>
                    <input
                        type="text"
                        placeholder="What happened in robotics today?"
                        className={styles.input}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </form>
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
