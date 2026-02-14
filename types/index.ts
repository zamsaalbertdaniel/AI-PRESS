export type ArticleStatus = 'draft' | 'ai-processed' | 'published';

export interface Article {
    id: string;
    titleEn: string;
    titleRo: string;
    summaryEn: string;
    summaryRo: string;
    contentEn: string;
    contentRo: string;
    aiTakeEn: string;
    aiTakeRo: string;
    imagePrompt: string;
    imageUrl?: string;
    category: string;
    tag: string;
    readTime: string;
    status: ArticleStatus;
    publishDate: string;
    trendingRank?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Source {
    id: string;
    name: string;
    url: string;
    lastFetched: string;
    status: 'active' | 'inactive';
}
