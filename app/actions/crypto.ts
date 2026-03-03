"use server";

/**
 * Fetches top 10 crypto prices from CoinGecko — FREE, no API key needed.
 * Cached via Next.js ISR for 3 hours (10800 seconds).
 */

export interface CryptoAsset {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    marketCap: number;
    rank: number;
    image: string;
}

const COINGECKO_URL =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h";

let _cache: { data: CryptoAsset[]; timestamp: number } | null = null;
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours in ms

export async function fetchCryptoPrices(): Promise<CryptoAsset[]> {
    // Server-side in-memory cache as backup
    if (_cache && Date.now() - _cache.timestamp < CACHE_DURATION) {
        return _cache.data;
    }

    try {
        const res = await fetch(COINGECKO_URL, {
            next: { revalidate: 10800 }, // 3 hours ISR
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            console.error("CoinGecko API error:", res.status);
            return _cache?.data ?? getFallbackData();
        }

        const raw = await res.json();

        const data: CryptoAsset[] = raw.map(
            (coin: {
                id: string;
                name: string;
                symbol: string;
                current_price: number;
                price_change_percentage_24h: number;
                market_cap: number;
                market_cap_rank: number;
                image: string;
            }) => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h ?? 0,
                marketCap: coin.market_cap,
                rank: coin.market_cap_rank,
                image: coin.image,
            })
        );

        _cache = { data, timestamp: Date.now() };
        return data;
    } catch (err) {
        console.error("CoinGecko fetch error:", err);
        return _cache?.data ?? getFallbackData();
    }
}

/** Fallback if API is unreachable on first load — return empty to avoid showing $0 */
function getFallbackData(): CryptoAsset[] {
    return [];
}
