import { NextResponse } from 'next/server';

import { signOut } from '@/auth';

export async function GET(request: Request) {
    await signOut({ redirect: false });

    return NextResponse.redirect(new URL('/sign-in', request.url));
}
