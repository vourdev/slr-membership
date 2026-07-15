import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

export type EbookTier = 'VISITOR' | 'RED' | 'BLUE';

// ─── DTOs (mirrored from the live responses) ─────────────────────────────────

// GET /ebooks/ — snake_case list (admin-visible).
export interface EbookListItem {
    ebook_id: string;
    title: string;
    subtitle: string | null;
    cover_url: string | null;
    description: string | null;
    category: string | null;
    footnote: string | null;
    reading_time_minutes: number;
    chapter_count: number;
    is_locked: boolean;
}

// POST/PATCH /ebooks/ — camelCase mutation response.
export interface EbookAdmin {
    id: string;
    title: string;
    subtitle: string | null;
    coverUrl: string | null;
    description: string | null;
    category: string | null;
    footnote: string | null;
    tierAccess: EbookTier;
    readingTimeMinutes: number;
    chapterCount: number;
    isActive: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface EbookPayload {
    title: string;
    subtitle?: string;
    coverUrl?: string;
    description?: string;
    category?: string;
    footnote?: string;
    tierAccess: EbookTier;
    readingTimeMinutes: number;
}

// GET /ebooks/{id} — unlocked content (403 FORBIDDEN when the member's tier is
// below the ebook's tierAccess; caller renders an upgrade gate on 403).
export interface EbookChapter {
    chapter_number: number;
    title: string;
    image_url: string | null;
    body: string;
    pull_quote: string | null;
}

export interface EbookDetail {
    ebook_id: string;
    title: string;
    subtitle: string | null;
    cover_url: string | null;
    footnote: string | null;
    reading_time_minutes: number;
    chapter_count: number;
    published_at: string | null;
    chapters: EbookChapter[];
}

// ─── Resource functions ──────────────────────────────────────────────────────

export const getEbooks = cache((token: string) =>
    apiFetch<EbookListItem[]>(API.ebooks.list, { token, cache: 'no-store' })
);

/** One ebook's full content + chapters. Throws ApiError(403) when the member's tier is too low. */
export const getEbook = cache((id: string, token: string) =>
    apiFetch<EbookDetail>(API.ebooks.detail(id), { token, cache: 'no-store' })
);

export const createEbook = (token: string, body: EbookPayload) =>
    apiFetch<EbookAdmin>(API.ebooks.create, { method: 'POST', token, body });

// PATCH resets unsent numeric fields — always send the full payload.
export const updateEbook = (token: string, id: string, body: EbookPayload) =>
    apiFetch<EbookAdmin>(API.ebooks.update(id), { method: 'PATCH', token, body });

export const deleteEbook = (token: string, id: string) =>
    apiFetch<null>(API.ebooks.remove(id), { method: 'DELETE', token });
