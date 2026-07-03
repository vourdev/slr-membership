import { handleApiAuthError } from '@/lib/api/guard';
import { getEbooks } from '@/lib/api/resources/ebooks';
import { getAccessToken } from '@/lib/api/server';
import { ApiError } from '@/lib/api/types';

import { EbooksClient, type EbookRow, type ListError } from './ebooks-client';

export default async function EbooksPage() {
    const token = await getAccessToken();

    let rows: EbookRow[] = [];
    let listError: ListError | null = null;

    try {
        const ebooks = token ? await getEbooks(token) : [];
        rows = ebooks.map((e) => ({
            id: e.ebook_id,
            title: e.title || '-',
            subtitle: e.subtitle ?? '',
            description: e.description ?? '',
            coverUrl: e.cover_url ?? '',
            category: e.category || '-',
            reading: e.reading_time_minutes ?? 0,
            chapters: e.chapter_count ?? 0,
            locked: e.is_locked ? 'Yes' : 'No'
        }));
    } catch (error) {
        handleApiAuthError(error); // 401 → force logout; other errors fall through
        if (error instanceof ApiError) {
            const payload = error.payload as { code?: string; requestId?: string } | undefined;
            listError = {
                status: error.status,
                message: error.message,
                code: payload?.code ?? null,
                requestId: payload?.requestId ?? null
            };
        } else {
            listError = { status: 0, message: String(error), code: null, requestId: null };
        }
    }

    return <EbooksClient initialRows={rows} listError={listError} />;
}
