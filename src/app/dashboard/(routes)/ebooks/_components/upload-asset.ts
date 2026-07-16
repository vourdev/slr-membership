'use client';

import { getEbookPresignedUrlAction } from '../actions';

/**
 * Upload one image to storage via a presigned URL and return its public
 * download URL.
 *
 * Each call mints a unique object key (timestamp + random suffix) so multiple
 * uploads — even of files sharing the same original name — never collide and
 * each resolves to its own distinct URL.
 */
export async function uploadEbookAsset(file: File): Promise<string> {
    const dot = file.name.lastIndexOf('.');
    const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : '';
    const base =
        file.name
            .slice(0, dot >= 0 ? dot : undefined)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .slice(0, 40) || 'image';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`;

    console.info('[ebook-upload] requesting presigned URL', { filename: uniqueName, contentType: file.type });

    const res = await getEbookPresignedUrlAction(uniqueName, file.type);
    if (!res.ok) {
        console.error('[ebook-upload] presigned URL request failed', res);
        throw new Error(res.message);
    }

    const upload = await fetch(res.data.upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
    });
    if (!upload.ok) {
        console.error('[ebook-upload] PUT to storage failed', { status: upload.status, key: res.data.object_key });
        throw new Error(`Upload failed (${upload.status})`);
    }

    console.info('[ebook-upload] success', { url: res.data.download_url, key: res.data.object_key });

    return res.data.download_url;
}
