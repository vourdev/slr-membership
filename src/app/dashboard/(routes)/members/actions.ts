'use server';

import { revalidatePath } from 'next/cache';

import {
    type AdminMemberStatusUpdate,
    type AdminMemberStatusValue,
    deleteAdminMember,
    updateAdminMemberStatus
} from '@/lib/api/resources/admin';
import { type MemberSubTierId, type MembershipRecord, changeMemberTier } from '@/lib/api/resources/memberships';
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

export async function deleteMemberAction(userId: string) {
    const token = await getAccessToken();
    if (!token) throw new Error('Authentication token missing.');

    await deleteAdminMember(userId, token);
    revalidatePath('/dashboard/members');
}

export async function updateMemberStatusAction(
    userId: string,
    status: AdminMemberStatusValue
): Promise<ActionResult<AdminMemberStatusUpdate>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await updateAdminMemberStatus(userId, status, token);
        revalidatePath(`/dashboard/members/${userId}`);
        revalidatePath('/dashboard/members');

        return { ok: true, data, message: 'Member status updated.' };
    } catch (error) {
        return toActionError(error);
    }
}

export async function changeMemberTierAction(
    userId: string,
    subTierId: MemberSubTierId
): Promise<ActionResult<MembershipRecord>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await changeMemberTier(userId, subTierId, token);
        revalidatePath(`/dashboard/members/${userId}`);
        revalidatePath('/dashboard/members');

        return { ok: true, data, message: 'Member tier updated.' };
    } catch (error) {
        return toActionError(error);
    }
}
