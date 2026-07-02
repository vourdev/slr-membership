import { API_BASE_URL } from './endpoints';
import { type ApiEnvelope, ApiError } from './types';

type ApiFetchOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    /** JSON body — serialized automatically. */
    body?: unknown;
    /** Bearer token for authenticated calls. */
    token?: string;
    headers?: Record<string, string>;
    /** Next.js fetch cache mode (server). */
    cache?: RequestCache;
    /** ISR revalidate seconds, or false to opt out (server). */
    revalidate?: number | false;
    /** Cache tags for on-demand revalidation (server). */
    tags?: string[];
    signal?: AbortSignal;
};

/**
 * Single entry point for hitting the SLR API. Works in Server Components,
 * route handlers, server actions, and the client. Unwraps the `{ success,
 * message, data }` envelope and throws `ApiError` on failure.
 *
 * Build typed resource functions on top of this (see `resources/*`) rather
 * than calling it directly from components.
 */
export async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
    const { method = 'GET', body, token, headers, cache, revalidate, tags, signal } = opts;

    const next =
        revalidate !== undefined || tags
            ? { revalidate: revalidate === false ? undefined : revalidate, tags }
            : undefined;

    const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            Accept: 'application/json',
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
        ...(cache ? { cache } : {}),
        ...(next ? { next } : {})
    });

    let json: ApiEnvelope<T> | undefined;
    try {
        json = (await res.json()) as ApiEnvelope<T>;
    } catch {
        // Non-JSON response (e.g. gateway error page).
    }

    if (!res.ok || !json?.success) {
        throw new ApiError(res.status, json?.message ?? `Request failed (${res.status})`, json);
    }

    return json.data;
}
