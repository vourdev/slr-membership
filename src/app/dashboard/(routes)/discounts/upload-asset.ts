'use client';

import { uploadViaPresign } from '@/lib/api/upload-asset';

import { getDiscountPresignedUrlAction } from './actions';

/** Upload a discount thumbnail and return its public URL. */
export function uploadDiscountAsset(file: File): Promise<string> {
    return uploadViaPresign(file, getDiscountPresignedUrlAction);
}
