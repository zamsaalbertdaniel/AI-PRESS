import React from 'react';
import { fetchCryptoPrices } from '@/app/actions/crypto';
import { fetchPublishedArticlesPublic } from '@/app/actions/articles';
import HeaderClient from './HeaderClient';

export default async function Header() {
    // Fetch data server-side (public — no auth required)
    const [cryptoData, articles] = await Promise.all([
        fetchCryptoPrices(),
        fetchPublishedArticlesPublic(),
    ]);

    // Build ticker items from crypto prices
    const cryptoTicker = cryptoData.slice(0, 5).map(coin => {
        const sign = coin.change24h >= 0 ? '+' : '';
        return `${coin.symbol} $${coin.price.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${sign}${coin.change24h.toFixed(1)}%)`;
    });

    // Build ticker items from latest articles
    const articleTicker = articles
        .filter(a => a.status === 'published')
        .slice(0, 3)
        .map(a => a.titleEn.slice(0, 60) + (a.titleEn.length > 60 ? '...' : ''));

    const tickerText = [
        ...cryptoTicker,
        'AIPress AI Core: Fully Operational',
        ...articleTicker,
    ].join('   •   ');

    return <HeaderClient tickerText={tickerText} />;
}
