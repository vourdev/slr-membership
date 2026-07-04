'use server';

import { type BenyActivateResult, activateBeny } from '@/lib/api/resources/admin';
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

export async function activateBenyAction(id: string): Promise<ActionResult<BenyActivateResult>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await activateBeny(id, token);

        return { ok: true, data, message: 'BENY subscription activated.' };
    } catch (error) {
        return toActionError(error);
    }
}
