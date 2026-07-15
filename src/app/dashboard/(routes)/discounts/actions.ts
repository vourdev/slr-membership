'use server';

import {
    type CreateDiscountPayload,
    type Discount,
    type DiscountAdmin,
    type UpdateDiscountPayload,
    createDiscount,
    deleteDiscount,
    getDiscount,
    updateDiscount
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

/** Fetch one discount to prefill the edit form. Admin GET works since 2026-07-09 (was 403). */
export async function getDiscountAction(id: string): Promise<ActionResult<Discount>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await getDiscount(id, token);

        return { ok: true, data, message: 'OK' };
    } catch (error) {
        return toActionError(error);
    }
}

export async function updateDiscountAction(
    id: string,
    payload: UpdateDiscountPayload
): Promise<ActionResult<DiscountAdmin>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await updateDiscount(token, id, payload);

        return { ok: true, data, message: 'Discount updated.' };
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
