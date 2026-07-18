'use client';

import { uploadViaPresign } from '@/lib/api/upload-asset';

import { getEbookPresignedUrlAction } from '../actions';

/** Upload an ebook image (cover / chapter) and return its public URL. */
export function uploadEbookAsset(file: File): Promise<string> {
    return uploadViaPresign(file, getEbookPresignedUrlAction);
}
