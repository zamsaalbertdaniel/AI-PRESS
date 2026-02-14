import { cookies } from "next/headers";
import { verifyAdminJWT } from "@/lib/jwt";

export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get("aipress_auth")?.value;
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
        return false;
    }

    return verifyAdminJWT(token, secret);
}

export async function requireAdmin(): Promise<void> {
    if (!(await isAdminAuthenticated())) {
        throw new Error("Unauthorized");
    }
}
