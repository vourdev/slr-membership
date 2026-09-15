'use client';

import { uploadViaPresign } from '@/lib/api/upload-asset';

import { getPartnerLogoPresignedUrlAction } from '../actions';

export function uploadPartnerLogo(file: File): Promise<string> {
    return uploadViaPresign(file, getPartnerLogoPresignedUrlAction);
}
