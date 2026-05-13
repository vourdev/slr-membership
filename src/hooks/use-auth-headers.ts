'use client';

import { useSession } from 'next-auth/react';

export function useAuthHeaders() {
    const { data: session } = useSession();

    const accessToken = (session?.user as any)?.accessToken as string | undefined;

    const buildAuthHeaders = () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : {});

    return {
        accessToken,
        buildAuthHeaders,
        session
    };
}
