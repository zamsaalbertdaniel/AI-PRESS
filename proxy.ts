import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminJWT } from '@/lib/jwt';

const ADMIN_LOGIN_PATH = '/admin/login';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin') && pathname !== ADMIN_LOGIN_PATH) {
        const token = request.cookies.get('aipress_auth')?.value;
        const secret = process.env.JWT_SECRET;

        const isAuthenticated = !!(token && secret && await verifyAdminJWT(token, secret));

        if (!isAuthenticated) {
            const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
            return NextResponse.redirect(loginUrl, { status: 307 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
