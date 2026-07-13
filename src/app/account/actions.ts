'use server';

import { createPortalSession } from '@/lib/api/resources/stripe';
import { getAccessToken } from '@/lib/api/server';
import { ApiError } from '@/lib/api/types';

// Opens the Stripe Billing Portal. Returns the hosted URL for the client to
// redirect to (manage cards / cancel). Real members get a URL; seed dev accounts
// return 400 "No such customer".
export async function openBillingPortal(): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const { url } = await createPortalSession(token);

        return { ok: true, url };
    } catch (error) {
        return { ok: false, message: error instanceof ApiError ? error.message : 'Could not open the billing portal.' };
    }
}
