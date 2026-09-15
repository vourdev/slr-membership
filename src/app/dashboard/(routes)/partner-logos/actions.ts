'use server';

import { revalidatePath } from 'next/cache';

import type { PresignedUrlResponse } from '@/lib/api/resources/ebooks';
import {
    type PartnerLogo,
    type PartnerLogoPayload,
    createPartnerLogo,
    deletePartnerLogo,
    getPartnerLogoPresignedUrl,
    updatePartnerLogo
} from '@/lib/api/resources/partner-logos';
import { getAccessToken } from '@/lib/api/server';
import { ApiError } from '@/lib/api/types';

export type ActionError = {
    ok: false;
    message: string;
    status?: number;
    code?: string | null;
    requestId?: string | null;
};

export type ActionResult<T> = { ok: true; data: T; message: string } | ActionError;

// The list is rendered on the server and the homepage caches the public logos, so both
// must be invalidated or the change only shows after a hard refresh (list) or 5 minutes (home).
function refreshPartnerLogoPages(): void {
    revalidatePath('/dashboard/partner-logos');
    revalidatePath('/');
}

function toActionError(error: unknown): ActionError {
    if (error instanceof ApiError) {
        const payload = error.payload as { code?: string; requestId?: string } | undefined;

        return {
            ok: false,
            message: error.message,
            status: error.status,
            code: payload?.code ?? null,
            requestId: payload?.requestId ?? null
        };
    }

    return { ok: false, message: 'Something went wrong. Please try again.' };
}

export async function createPartnerLogoAction(payload: PartnerLogoPayload): Promise<ActionResult<PartnerLogo>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await createPartnerLogo(token, payload);
        refreshPartnerLogoPages();

        return { ok: true, data, message: 'Partner logo added.' };
    } catch (error) {
        return toActionError(error);
    }
}

export async function updatePartnerLogoAction(
    id: string,
    payload: PartnerLogoPayload
): Promise<ActionResult<PartnerLogo>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await updatePartnerLogo(token, id, payload);
        refreshPartnerLogoPages();

        return { ok: true, data, message: 'Partner logo updated.' };
    } catch (error) {
        return toActionError(error);
    }
}

export async function deletePartnerLogoAction(id: string): Promise<ActionResult<null>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        await deletePartnerLogo(token, id);
        refreshPartnerLogoPages();

        return { ok: true, data: null, message: 'Partner logo deleted.' };
    } catch (error) {
        return toActionError(error);
    }
}

export async function getPartnerLogoPresignedUrlAction(
    filename: string,
    contentType: string,
    fileSize: number
): Promise<ActionResult<PresignedUrlResponse>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await getPartnerLogoPresignedUrl(token, { filename, contentType, fileSize });

        return { ok: true, data, message: 'Upload URL ready.' };
    } catch (error) {
        return toActionError(error);
    }
}
