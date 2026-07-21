'use server';

import { revalidatePath } from 'next/cache';

import { MIN_PASSWORD_LENGTH } from '@/constant/password';
import { handleApiAuthError } from '@/lib/api/guard';
import { changePassword } from '@/lib/api/resources/auth';
import { updateMyProfile } from '@/lib/api/resources/users';
import { getAccessToken } from '@/lib/api/server';
import { ApiError, apiErrorMessage } from '@/lib/api/types';

// A 'use server' module may only export async functions, so shared constants
// live in @/constant/password — exporting one here breaks every action in the file.
type ActionResult = { ok: true } | { ok: false; message: string };

// Only name, phone and date of birth are self-editable. Email and state are
// admin-approval-only (state drives the draw pool), so they are never sent here.
export async function updateProfileAction(input: {
    fullName: string;
    phone: string;
    dob: string;
}): Promise<ActionResult> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        await updateMyProfile(
            { fullName: input.fullName, phone: input.phone, ...(input.dob ? { dob: input.dob } : {}) },
            token
        );
        revalidatePath('/member/profile');

        return { ok: true };
    } catch (error) {
        handleApiAuthError(error);

        return { ok: false, message: error instanceof ApiError ? error.message : 'Could not update your profile.' };
    }
}

export async function changePasswordAction(input: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}): Promise<ActionResult> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    if (input.newPassword.length < MIN_PASSWORD_LENGTH) {
        return { ok: false, message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
    }
    if (input.newPassword !== input.confirmPassword) {
        return { ok: false, message: 'New passwords do not match.' };
    }
    if (input.newPassword === input.currentPassword) {
        return { ok: false, message: 'New password must be different from your current password.' };
    }

    try {
        await changePassword(token, {
            current_password: input.currentPassword,
            new_password: input.newPassword,
            confirm_password: input.confirmPassword
        });

        // No sign-out here: by design the backend keeps existing sessions alive
        // on a password change, so the member's own token stays valid.
        return { ok: true };
    } catch (error) {
        // A wrong current password also answers 401 — surface it in the form
        // instead of force-logging the member out.
        if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
            return { ok: false, message: apiErrorMessage(error) || 'Current password is incorrect.' };
        }
        handleApiAuthError(error);

        return {
            ok: false,
            message: error instanceof ApiError ? apiErrorMessage(error) : 'Could not change your password.'
        };
    }
}
