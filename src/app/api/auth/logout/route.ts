import { NextResponse } from 'next/server';

import { signOut } from '@/auth';

export async function GET(request: Request) {
    await signOut({ redirect: false });

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'https';

    if (host) {
        return NextResponse.redirect(`${proto}://${host}/sign-in`);
    }

    return NextResponse.redirect(new URL('/sign-in', request.url));
}
