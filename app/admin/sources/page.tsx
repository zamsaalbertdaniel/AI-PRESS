"use client";
import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import styles from './page.module.css';
import StatusBadge from '@/components/admin/StatusBadge';

interface Source {
    id: number;
    name: string;
    url: string;
    frequency: '1h' | '6h' | '24h';
    lastScrape: string;
    status: 'active' | 'error';
}

const MOCK_SOURCES: Source[] = [
    { id: 1, name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", frequency: '1h', lastScrape: '10 mins ago', status: 'active' },
    { id: 2, name: "Reuters Tech", url: "https://www.reuters.com/technology/artificial-intelligence", frequency: '1h', lastScrape: '45 mins ago', status: 'active' },
    { id: 3, name: "MIT Tech Review", url: "https://www.technologyreview.com/topic/artificial-intelligence", frequency: '24h', lastScrape: '2 hours ago', status: 'error' },
];

export default function SourceManager() {
    const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
    const [isAdding, setIsAdding] = useState(false);

    // New source state
    const [newSource, setNewSource] = useState({ name: '', url: '', frequency: '1h' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const source: Source = {
            id: Date.now(),
            name: newSource.name,
            url: newSource.url,
            frequency: newSource.frequency as '1h' | '6h' | '24h',
            lastScrape: 'Never',
            status: 'active'
        };
        setSources([...sources, source]);
        setIsAdding(false);
        setNewSource({ name: '', url: '', frequency: '1h' });
    };

    const triggerScrape = (id: number) => {
        alert(`Triggering scrape for source ID: ${id}`);
        // Simulate status update
        setSources(sources.map(s => s.id === id ? { ...s, lastScrape: 'Just now', status: 'active' } : s));
    };

    const deleteSource = (id: number) => {
        setSources(sources.filter(s => s.id !== id));
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Source Management Hub</h1>
                <button className={styles.addBtn} onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add Source'}
                </button>
            </header>

            {isAdding && (
                <GlassCard className={styles.addForm}>
                    <form onSubmit={handleAdd} className={styles.formGrid}>
                        <input
                            placeholder="Source Name"
                            className={styles.input}
                            required
                            value={newSource.name}
                            onChange={e => setNewSource({ ...newSource, name: e.target.value })}
                        />
                        <input
                            placeholder="RSS / URL Endpoint"
                            className={styles.input}
                            required
                            value={newSource.url}
                            onChange={e => setNewSource({ ...newSource, url: e.target.value })}
                        />
                        <select
                            className={styles.select}
                            value={newSource.frequency}
                            onChange={e => setNewSource({ ...newSource, frequency: e.target.value })}
                        >
                            <option value="1h">Every 1 Hour</option>
                            <option value="6h">Every 6 Hours</option>
                            <option value="24h">Every 24 Hours</option>
                        </select>
                        <button type="submit" className={styles.submitBtn}>Save Source</button>
                    </form>
                </GlassCard>
            )}

            <div className={styles.list}>
                {sources.map(source => (
                    <GlassCard key={source.id} className={styles.sourceCard} hoverEffect={false}>
                        <div className={styles.info}>
                            <h3 className={styles.sourceName}>{source.name}</h3>
                            <p className={styles.sourceUrl}>{source.url}</p>
                            <div className={styles.meta}>
                                <span className={styles.freqTag}>{source.frequency}</span>
                                <span className={source.status === 'active' ? styles.statusOk : styles.statusErr}>
                                    ● {source.status === 'active' ? 'Operational' : 'Error'}
                                </span>
                                <span className={styles.lastScrape}>Last: {source.lastScrape}</span>
                            </div>
                        </div>
                        <div className={styles.controls}>
                            <button className={styles.scrapeBtn} onClick={() => triggerScrape(source.id)}>
                                Scrape Now
                            </button>
                            <button className={styles.deleteBtn} onClick={() => deleteSource(source.id)}>
                                Delete
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
