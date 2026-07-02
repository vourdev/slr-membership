import { auth } from '@/auth';

import 'server-only';

/** Access token from the current NextAuth session — for authenticated server fetches. */
export async function getAccessToken(): Promise<string | undefined> {
    const session = await auth();

    return (session?.user as { accessToken?: string } | undefined)?.accessToken;
}
