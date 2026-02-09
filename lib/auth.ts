import { cookies } from "next/headers";

export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.get("aipress_auth")?.value === "true";
}

export async function requireAdmin(): Promise<void> {
    if (!(await isAdminAuthenticated())) {
        throw new Error("Unauthorized");
    }
}
