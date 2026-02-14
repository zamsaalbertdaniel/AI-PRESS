"use server";

import { cookies } from 'next/headers';
import { timingSafeEqual } from 'node:crypto';
import { passwordSchema } from "@/lib/validators";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateAdminJWT } from "@/lib/jwt";

function safeStringEqual(a: string, b: string): boolean {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);

    if (aBuffer.length !== bBuffer.length) {
        return false;
    }

    return timingSafeEqual(aBuffer, bBuffer);
}

export async function loginAdminAction(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const parsedPassword = passwordSchema.safeParse(password);

    if (!adminPassword) {
        console.error("CRITICAL: ADMIN_PASSWORD environment variable is NOT SET.");
        return { success: false, error: 'System configuration error. Please contact tech support.' };
    }

    if (!parsedPassword.success) {
        return { success: false, error: 'Password does not meet requirements.' };
    }

    const matches = safeStringEqual(password, adminPassword);
    if (matches) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("CRITICAL: JWT_SECRET environment variable is NOT SET.");
            return { success: false, error: 'System configuration error. Please contact tech support.' };
        }

        const token = await generateAdminJWT(jwtSecret);
        const cookieStore = await cookies();
        cookieStore.set('aipress_auth', token, {
            path: '/',
            maxAge: 86400,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
        });
        return { success: true };
    }

    return { success: false, error: 'Invalid password' };
}

export async function logoutAdminAction() {
    const cookieStore = await cookies();
    cookieStore.delete('aipress_auth');
}

export async function getAdminSession() {
    return { authenticated: await isAdminAuthenticated() };
}
