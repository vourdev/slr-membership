'use server';

import { revalidatePath, updateTag } from 'next/cache';

import { handleApiAuthError } from '@/lib/api/guard';
import {
    type AnnouncementItem,
    DRAW_RULES_TYPE,
    createAnnouncement,
    updateAnnouncement
} from '@/lib/api/resources/announcements';
import { type PresignedUrlResponse, getEbookPresignedUrl } from '@/lib/api/resources/ebooks';
import { PRIZE_CONTENT_TAG, updateAdminPrizeContent } from '@/lib/api/resources/prizes';
import { getAccessToken } from '@/lib/api/server';
import { ApiError } from '@/lib/api/types';
import type { PrizeContent, PrizeContentUpdatePayload } from '@/types/member';

export type ActionError = {
    ok: false;
    message: string;
    status?: number;
    code?: string | null;
    requestId?: string | null;
};

export type ActionResult<T> = { ok: true; data: T; message: string } | ActionError;

function toActionError(error: unknown): ActionError {
    handleApiAuthError(error);

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

export async function savePrizeContentAction(payload: PrizeContentUpdatePayload): Promise<ActionResult<PrizeContent>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await updateAdminPrizeContent(token, payload);

        revalidatePath('/dashboard/prizes');

        updateTag(PRIZE_CONTENT_TAG);

        return { ok: true, data, message: 'Prize content saved.' };
    } catch (error) {
        return toActionError(error);
    }
}

// Draw rules live in the Announcements CMS (type DRAW_RULES) but are edited here,
// next to the prize pool they belong to. One document: create it the first time,
// update it after that.
export async function saveDrawRulesAction(
    content: string,
    existingId: string | null
): Promise<ActionResult<AnnouncementItem>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    const body = {
        type: DRAW_RULES_TYPE,
        title: 'Draw Rules',
        content,
        link_url: null,
        is_active: true,
        sort_order: 0
    };

    try {
        const data = existingId
            ? await updateAnnouncement(token, existingId, body)
            : await createAnnouncement(token, body);

        revalidatePath('/dashboard/prizes');
        revalidatePath('/member/prizes');

        return { ok: true, data, message: 'Draw rules saved.' };
    } catch (error) {
        return toActionError(error);
    }
}

// Same single presigned-upload endpoint the rest of the CMS uses.
export async function getPrizePresignedUrlAction(
    filename: string,
    contentType: string,
    fileSize: number
): Promise<ActionResult<PresignedUrlResponse>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await getEbookPresignedUrl(token, { filename, contentType, fileSize });

        return { ok: true, data, message: 'Upload URL ready.' };
    } catch (error) {
        return toActionError(error);
    }
}
