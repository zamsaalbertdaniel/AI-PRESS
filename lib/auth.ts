import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

/**
 * AIPress Auth Layer — JWT-based session management
 * Uses HMAC-SHA256 signed tokens stored in httpOnly cookies
 */

const JWT_SECRET_KEY = process.env.JWT_SECRET;
if (!JWT_SECRET_KEY) throw new Error('CRITICAL: JWT_SECRET environment variable is not set.');
const SESSION_COOKIE = "aipress_session";
const SESSION_DURATION = 24 * 60 * 60; // 24 hours in seconds

function getSecretKey() {
    return new TextEncoder().encode(JWT_SECRET_KEY);
}

export interface SessionPayload {
    role: "admin";
    iat: number;
    exp: number;
}

/**
 * Creates a signed JWT session token
 */
export async function createSessionToken(): Promise<string> {
    const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DURATION}s`)
        .sign(getSecretKey());

    return token;
}

/**
 * Verifies a JWT session token and returns the payload
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey(), {
            algorithms: ["HS256"],
        });
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

/**
 * Sets the session cookie with a valid JWT token
 */
export async function setSessionCookie(): Promise<void> {
    const token = await createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        path: "/",
        maxAge: SESSION_DURATION,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    });
}

/**
 * Clears the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}

/**
 * Checks if the current request has a valid admin session
 */
export async function isAdminAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (!sessionCookie?.value) {
        return false;
    }

    const payload = await verifySessionToken(sessionCookie.value);
    return payload !== null && payload.role === "admin";
}

/**
 * Guard: throws if not authenticated (use in server actions)
 */
export async function requireAdmin(): Promise<void> {
    if (!(await isAdminAuthenticated())) {
        throw new Error("Unauthorized");
    }
}
