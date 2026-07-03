'use server';

import { revalidatePath } from 'next/cache';

import { deleteAdminMember } from '@/lib/api/resources/admin';
import { getAccessToken } from '@/lib/api/server';

export async function deleteMemberAction(userId: string) {
    const token = await getAccessToken();
    if (!token) throw new Error('Authentication token missing.');

    await deleteAdminMember(userId, token);
    revalidatePath('/dashboard/members');
}
