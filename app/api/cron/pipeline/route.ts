import { NextResponse } from "next/server";
import { runNeuralScraper } from "@/lib/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Daily automatic run (see vercel.json "crons").
 * Vercel sends "Authorization: Bearer <CRON_SECRET>". New articles land as
 * "ai-processed" drafts — the admin just reviews and presses Publish.
 */
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await runNeuralScraper();
    return NextResponse.json({
        success: result.success,
        created: result.articles?.length ?? 0,
        error: result.error,
    });
}
