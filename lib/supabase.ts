import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * AIPress — Supabase clients
 *
 * publicClient  → uses the anon key, respects RLS (read-only for published articles)
 * adminClient   → uses the service_role key, bypasses RLS (full CRUD from server actions)
 *
 * Both are lazily initialised so the env vars are guaranteed to be loaded by Next.js
 * before the first call.
 */

function getSupabaseUrl(): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_URL");
    return url;
}

// ---------- Public (anon) ----------
let _public: SupabaseClient | null = null;

export function getPublicClient(): SupabaseClient {
    if (!_public) {
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!key) throw new Error("Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY");
        _public = createClient(getSupabaseUrl(), key);
    }
    return _public;
}

// ---------- Admin (service_role) ----------
let _admin: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
    if (!_admin) {
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!key) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
        _admin = createClient(getSupabaseUrl(), key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    return _admin;
}
