'use server';

import { type CheckoutTier, createCheckoutSession, createPortalSession } from '@/lib/api/resources/stripe';
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

// Starts a hosted Stripe Checkout for a paid tier and returns the URL for the
// client to redirect to. Stripe sends the member to /payment/success (which
// polls until the webhook activates them) or /payment/cancel.
//
// Only offer this to members with no live subscription (Visitor). A paid→paid
// change is POST /memberships/upgrade (scheduled at renewal) — running checkout
// for an existing subscriber would open a second subscription.
export async function startTierCheckout(
    tier: CheckoutTier
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const { url } = await createCheckoutSession(token, { tier });

        return { ok: true, url };
    } catch (error) {
        return { ok: false, message: error instanceof ApiError ? error.message : 'Could not start checkout.' };
    }
}
