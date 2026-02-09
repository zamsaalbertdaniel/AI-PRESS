import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_LOGIN_PATH = '/admin/login';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if the user is trying to access the admin area
    if (pathname.startsWith('/admin') && pathname !== ADMIN_LOGIN_PATH) {
        const isAuthenticated = request.cookies.get('aipress_auth')?.value === 'true';

        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/admin/:path*',
};
