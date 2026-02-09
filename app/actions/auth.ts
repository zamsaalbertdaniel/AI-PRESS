"use server";

import { cookies } from 'next/headers';

export async function loginAdminAction(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.error("CRITICAL: ADMIN_PASSWORD environment variable is NOT SET.");
        return { success: false, error: 'System configuration error. Please contact tech support.' };
    }

    if (password === adminPassword) {
        const cookieStore = await cookies();
        cookieStore.set('aipress_auth', 'true', {
            path: '/',
            maxAge: 86400,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
        return { success: true };
    }

    return { success: false, error: 'Invalid password' };
}

export async function logoutAdminAction() {
    const cookieStore = await cookies();
    cookieStore.delete('aipress_auth');
}
