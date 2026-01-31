"use client";
import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import styles from './CryptoHub.module.css';

const TOP_10_CRYPTO = [
    { name: "Bitcoin", symbol: "BTC", price: 68420.50, change: "+2.4%" },
    { name: "WBTC", symbol: "WBTC", price: 68390.10, change: "+2.3%" },
    { name: "Ethereum", symbol: "ETH", price: 3450.25, change: "+4.1%" },
    { name: "PAX Gold", symbol: "PAXG", price: 2340.80, change: "+0.2%" },
    { name: "Maker", symbol: "MKR", price: 2150.40, change: "+5.6%" },
    { name: "Bittensor", symbol: "TAO", price: 450.30, change: "+12.1%" },
    { name: "Monero", symbol: "XMR", price: 165.45, change: "-0.5%" },
    { name: "Solana", symbol: "SOL", price: 145.20, change: "+8.9%" },
    { name: "Aave", symbol: "AAVE", price: 120.15, change: "+3.4%" },
    { name: "Fetch.ai", symbol: "FET", price: 2.45, change: "+15.2%" },
];

export default function CryptoHub() {
    const [assets, setAssets] = useState(TOP_10_CRYPTO);

    useEffect(() => {
        const interval = setInterval(() => {
            setAssets(prev => prev.map(a => ({
                ...a,
                price: a.price * (1 + (Math.random() * 0.001 - 0.0005))
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.hub}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Crypto <span className={styles.x}>×</span> AI Economy</h2>
                    <p className={styles.desc}>Tracking the most valuable digital assets in the neural age.</p>
                </div>
                <div className={styles.liveTag}>● Global Neural Market Live</div>
            </div>

            <div className={styles.tickerGrid}>
                {assets.map((asset, idx) => (
                    <div key={asset.symbol} className={styles.tickerRow}>
                        <div className={styles.rank}>#{idx + 1}</div>
                        <div className={styles.nameBlock}>
                            <span className={styles.name}>{asset.name}</span>
                            <span className={styles.symbol}>{asset.symbol}</span>
                        </div>
                        <div className={styles.priceColumn}>
                            <span className={styles.price}>${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className={`${styles.change} ${asset.change.startsWith('+') ? styles.plus : styles.minus}`}>
                                {asset.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
