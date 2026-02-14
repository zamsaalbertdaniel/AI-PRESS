import { NextRequest, NextResponse } from "next/server";
import { searchAndResearchNews } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const allowed = checkRateLimit(`ai-search:${ip}`, 8, 60_000);

    if (!allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Try again shortly." }, { status: 429 });
    }

    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";

    if (query.length < 3) {
      return NextResponse.json({ success: false, error: "Query must contain at least 3 characters." }, { status: 400 });
    }

    const result = await searchAndResearchNews(query);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "AI search failed." }, { status: 502 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("AI Search API error", error);
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }
}
