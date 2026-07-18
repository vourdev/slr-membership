'use server';

import { revalidatePath } from 'next/cache';

import { API } from '@/lib/api/endpoints';
import { handleApiAuthError } from '@/lib/api/guard';
import { apiFetch } from '@/lib/api/http';
import { getAccessToken } from '@/lib/api/server';
import { ApiError } from '@/lib/api/types';

// Only name + phone are self-editable. Email and state are admin-approval-only
// (state drives the draw pool), so they are never sent here.
export async function updateProfileAction(input: {
    fullName: string;
    phone: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        await apiFetch(API.users.me, {
            method: 'PATCH',
            token,
            body: { fullName: input.fullName, phone: input.phone }
        });
        revalidatePath('/member/profile');

        return { ok: true };
    } catch (error) {
        handleApiAuthError(error);

        return { ok: false, message: error instanceof ApiError ? error.message : 'Could not update your profile.' };
    }
}
