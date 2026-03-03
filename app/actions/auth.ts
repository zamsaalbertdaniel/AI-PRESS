"use server";

import bcrypt from "bcryptjs";
import { passwordSchema } from "@/lib/validators";
import { isAdminAuthenticated, setSessionCookie, clearSessionCookie } from "@/lib/auth";

/**
 * Rate limiting: max 5 login attempts per 15-minute window.
 * Resets on successful login.
 */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkLoginRateLimit(): { allowed: boolean; retryAfterMin?: number } {
    const key = "admin_login";
    const now = Date.now();
    const entry = loginAttempts.get(key);

    if (!entry || now > entry.resetAt) {
        loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return { allowed: true };
    }

    if (entry.count >= MAX_ATTEMPTS) {
        const retryAfterMin = Math.ceil((entry.resetAt - now) / 60000);
        return { allowed: false, retryAfterMin };
    }

    entry.count++;
    return { allowed: true };
}

function clearLoginRateLimit() {
    loginAttempts.delete("admin_login");
}

export async function loginAdminAction(password: string) {
    // 1. Rate limit check
    const rateCheck = checkLoginRateLimit();
    if (!rateCheck.allowed) {
        return {
            success: false,
            error: `Too many login attempts. Try again in ${rateCheck.retryAfterMin} minute(s).`
        };
    }

    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const parsedPassword = passwordSchema.safeParse(password);

    if (!adminPasswordHash) {
        console.error("CRITICAL: ADMIN_PASSWORD_HASH environment variable is NOT SET.");
        return { success: false, error: 'System configuration error. Please contact tech support.' };
    }

    if (!parsedPassword.success) {
        return { success: false, error: 'Password does not meet requirements.' };
    }

    const matches = await bcrypt.compare(password, adminPasswordHash);
    if (matches) {
        // Success — clear rate limit and create session
        clearLoginRateLimit();
        await setSessionCookie();
        return { success: true };
    }

    return { success: false, error: 'Invalid password' };
}

export async function logoutAdminAction() {
    await clearSessionCookie();
}

export async function getAdminSession() {
    return { authenticated: await isAdminAuthenticated() };
}
