import React from 'react';
import { fetchCryptoPrices, CryptoAsset } from '@/app/actions/crypto';
import styles from './CryptoHub.module.css';

export default async function CryptoHub() {
    const assets = await fetchCryptoPrices();

    return (
        <div className={styles.hub}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Crypto <span className={styles.x}>×</span> AI Economy</h2>
                    <p className={styles.desc}>Top digital assets by market cap — updated every 3 hours.</p>
                </div>
                <div className={styles.liveTag}>● Live Market Data</div>
            </div>

            <div className={styles.tickerGrid}>
                {assets.map((asset: CryptoAsset, idx: number) => (
                    <div key={asset.id} className={styles.tickerRow}>
                        <div className={styles.rank}>#{idx + 1}</div>
                        <div className={styles.nameBlock}>
                            <span className={styles.name}>{asset.name}</span>
                            <span className={styles.symbol}>{asset.symbol}</span>
                        </div>
                        <div className={styles.priceColumn}>
                            <span className={styles.price}>
                                ${asset.price.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                            <span
                                className={`${styles.change} ${asset.change24h >= 0 ? styles.plus : styles.minus
                                    }`}
                            >
                                {asset.change24h >= 0 ? '+' : ''}
                                {asset.change24h.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
