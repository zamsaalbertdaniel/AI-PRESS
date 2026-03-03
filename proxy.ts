import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_LOGIN_PATH = '/admin/login';
const SESSION_COOKIE = 'aipress_session';

function getSecretKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('CRITICAL: JWT_SECRET environment variable is not set.');
    return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect admin routes (except login)
    if (pathname.startsWith('/admin') && pathname !== ADMIN_LOGIN_PATH) {
        const sessionCookie = request.cookies.get(SESSION_COOKIE);

        if (!sessionCookie?.value) {
            return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
        }

        try {
            const { payload } = await jwtVerify(sessionCookie.value, getSecretKey(), {
                algorithms: ['HS256'],
            });

            if (payload.role !== 'admin') {
                return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
            }
        } catch {
            // Token expired or invalid — clear it and redirect
            const response = NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
            response.cookies.delete(SESSION_COOKIE);
            return response;
        }
    }

    return NextResponse.next();
}

export const proxyConfig = {
    matcher: '/admin/:path*',
};
