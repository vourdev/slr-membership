import { redirect } from 'next/navigation';

import { ApiError } from './types';
import 'server-only';

/**
 * Force a full logout when the API rejects the session (401 — expired/invalid
 * token). Call inside a catch in server components/pages: on 401 it redirects
 * to /api/auth/logout (which signs out + sends to /sign-in) and never returns;
 * otherwise it returns so the caller can handle the error (e.g. show EmptyState).
 */
export function handleApiAuthError(error: unknown): void {
    if (error instanceof ApiError && error.status === 401) {
        redirect('/api/auth/logout');
    }
}
