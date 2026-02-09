"use server";

import { cookies } from 'next/headers';
import bcrypt from "bcryptjs";
import { passwordSchema } from "@/lib/validators";
import { isAdminAuthenticated } from "@/lib/auth";

export async function loginAdminAction(password: string) {
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
        const cookieStore = await cookies();
        cookieStore.set('aipress_auth', 'true', {
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
