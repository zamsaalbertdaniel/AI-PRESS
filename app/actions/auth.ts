"use server";

import bcrypt from "bcryptjs";
import { passwordSchema } from "@/lib/validators";
import { isAdminAuthenticated, setSessionCookie, clearSessionCookie } from "@/lib/auth";

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
        // Create and set a signed JWT session cookie
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
