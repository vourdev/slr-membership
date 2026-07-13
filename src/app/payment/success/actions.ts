'use server';

import { getBillingStatus } from '@/lib/api/resources/billing';
import { getMyMembership } from '@/lib/api/resources/memberships';
import { getAccessToken } from '@/lib/api/server';

export interface ActivationState {
    /** false = no app session (e.g. checked out without logging in) → show a generic success. */
    authed: boolean;
    active: boolean;
    tierLabel?: string;
    nextRenewalAt?: string | null;
}

// Polled by the success page until the Stripe webhook flips billing to active.
export async function checkActivation(): Promise<ActivationState> {
    const token = await getAccessToken();
    if (!token) return { authed: false, active: false };

    try {
        const [billing, membership] = await Promise.all([
            getBillingStatus(token),
            getMyMembership(token).catch(() => null)
        ]);

        const tier = membership?.subTier;
        const tierLabel = tier ? `SLR ${tier.tier}${tier.marketingName ? ` · ${tier.marketingName}` : ''}` : undefined;

        return {
            authed: true,
            active: billing.billing_status === 'active',
            tierLabel,
            nextRenewalAt: billing.next_renewal_at
        };
    } catch {
        return { authed: true, active: false };
    }
}
