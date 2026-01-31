"use client";
import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import styles from './page.module.css';

const TABS = [
    { id: 'branding', label: 'Branding' },
    { id: 'personality', label: 'AI Personality' },
    { id: 'scraper', label: 'Scraper Rules' },
    { id: 'ads', label: 'Ads & Social' },
    { id: 'security', label: 'Security' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('branding');

    // Mock State
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [aiTemp, setAiTemp] = useState(0.7);
    const [tone, setTone] = useState('warm');

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>System Settings Hub</h1>
                {activeTab === 'security' && maintenanceMode && (
                    <div className={styles.maintBadge}>⚠️ Maintenance Mode Active</div>
                )}
            </header>

            <div className={styles.tabs}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <GlassCard className={styles.content}>
                {activeTab === 'branding' && (
                    <div className={styles.section}>
                        <h2 className={styles.secTitle}>Branding Identity</h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label>Logo URL</label>
                                <input type="text" className={styles.input} defaultValue="/logo-aipress.png" />
                            </div>
                            <div className={styles.field}>
                                <label>Favicon URL</label>
                                <input type="text" className={styles.input} defaultValue="/favicon.ico" />
                            </div>
                            <div className={styles.field}>
                                <label>Default Language</label>
                                <select className={styles.select}>
                                    <option value="en">English (Default)</option>
                                    <option value="ro">Romanian</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'personality' && (
                    <div className={styles.section}>
                        <h2 className={styles.secTitle}>AI Editorial Personality</h2>
                        <div className={styles.field}>
                            <label>Creativity Temperature (0.0 - 1.0)</label>
                            <div className={styles.sliderRow}>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.1"
                                    value={aiTemp}
                                    onChange={(e) => setAiTemp(parseFloat(e.target.value))}
                                    className={styles.slider}
                                />
                                <span className={styles.val}>{aiTemp}</span>
                            </div>
                            <p className={styles.hint}>Higher interaction = More creative, possibly hallucinogenic.</p>
                        </div>
                        <div className={styles.field}>
                            <label>Editorial Tone (AIPress Take)</label>
                            <select className={styles.select} value={tone} onChange={(e) => setTone(e.target.value)}>
                                <option value="neutral">Neutral & Objective</option>
                                <option value="warm">Warm Futurism (Default)</option>
                                <option value="provocative">Provocative / Critical</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'scraper' && (
                    <div className={styles.section}>
                        <h2 className={styles.secTitle}>Scraper Rules Engine</h2>
                        <div className={styles.field}>
                            <label>Global Keyword Blacklist (One per line)</label>
                            <textarea className={styles.textarea} defaultValue={`gambling\ncasino\ncheap-meds`} />
                        </div>
                        <div className={styles.field}>
                            <label>Default Scrape Frequency</label>
                            <select className={styles.select}>
                                <option>Every 1 Hour</option>
                                <option>Every 6 Hours</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'ads' && (
                    <div className={styles.section}>
                        <h2 className={styles.secTitle}>Ads & Social Integration</h2>
                        <div className={styles.grid}>
                            <div className={styles.field}>
                                <label>Facebook API Key</label>
                                <input type="password" className={styles.input} defaultValue="fb_mock_key_****" />
                            </div>
                            <div className={styles.field}>
                                <label>TikTok App ID</label>
                                <input type="text" className={styles.input} defaultValue="tt_mock_id_123" />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.toggleLabel}>
                                <input type="checkbox" defaultChecked /> Enable Ad Slots (Native)
                            </label>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className={styles.section}>
                        <h2 className={styles.secTitle}>Security Protocol</h2>

                        <div className={styles.dangerZone}>
                            <h3 className={styles.warnTitle}>Maintenance Mode</h3>
                            <p className={styles.warnText}>Use this when performing major grid updates. Visitors will see a "Be Right Back" screen.</p>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={maintenanceMode}
                                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                                />
                                <span className={styles.sliderRound}></span>
                            </label>
                        </div>

                        <div className={styles.field} style={{ marginTop: '24px' }}>
                            <label>Admin IP Whitelist (Comma separated)</label>
                            <input type="text" className={styles.input} placeholder="192.168.1.1, 10.0.0.1" />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.toggleLabel}>
                                <input type="checkbox" defaultChecked disabled /> Enforce 2FA (System Wide)
                            </label>
                        </div>
                    </div>
                )}

                <div className={styles.actions}>
                    <button className={styles.saveBtn}>Save Changes</button>
                </div>
            </GlassCard>
        </div>
    );
}
