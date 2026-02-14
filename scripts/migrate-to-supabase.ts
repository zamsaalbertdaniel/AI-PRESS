/**
 * One-time migration: inserts the existing article from data/articles.json into Supabase.
 * Run with: npx tsx scripts/migrate-to-supabase.ts
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key);

interface Article {
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
    status: string;
    publishDate: string;
    trendingRank?: number;
}

async function migrate() {
    const filePath = path.join(__dirname, '..', 'data', 'articles.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const articles: Article[] = JSON.parse(raw);

    console.log(`Found ${articles.length} article(s) to migrate.\n`);

    for (const a of articles) {
        const row = {
            title_en: a.titleEn,
            title_ro: a.titleRo,
            summary_en: a.summaryEn,
            summary_ro: a.summaryRo,
            content_en: a.contentEn,
            content_ro: a.contentRo,
            ai_take_en: a.aiTakeEn,
            ai_take_ro: a.aiTakeRo,
            image_prompt: a.imagePrompt,
            image_url: a.imageUrl ?? null,
            category: a.category,
            tag: a.tag,
            read_time: a.readTime,
            status: a.status,
            publish_date: a.publishDate,
            trending_rank: a.trendingRank ?? null,
        };

        const { data, error } = await supabase.from('articles').insert(row).select('id');

        if (error) {
            console.error(`❌ Failed to insert "${a.titleEn}":`, error.message);
        } else {
            console.log(`✅ Inserted "${a.titleEn}" → id: ${data?.[0]?.id}`);
        }
    }

    console.log('\nMigration complete!');
}

migrate();
