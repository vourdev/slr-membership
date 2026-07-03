'use server';

import {
    type CreateDiscountPayload,
    type DiscountAdmin,
    createDiscount,
    deleteDiscount
} from '@/lib/api/resources/discounts';
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

function toActionError(error: unknown): ActionError {
    if (error instanceof ApiError) {
        const payload = error.payload as { code?: string; requestId?: string } | undefined;

        return { ok: false, message: error.message, status: error.status, code: payload?.code ?? null, requestId: payload?.requestId ?? null };
    }

    return { ok: false, message: 'Something went wrong. Please try again.' };
}

export async function createDiscountAction(payload: CreateDiscountPayload): Promise<ActionResult<DiscountAdmin>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await createDiscount(token, payload);

        return { ok: true, data, message: 'Discount created.' };
    } catch (error) {
        return toActionError(error);
    }
}

export async function deleteDiscountAction(id: string): Promise<ActionResult<null>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        await deleteDiscount(token, id);

        return { ok: true, data: null, message: 'Discount deleted.' };
    } catch (error) {
        return toActionError(error);
    }
}
