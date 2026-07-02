import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTOs (mirror the OpenAPI schemas) ──────────────────────────────────────

export interface TierOption {
    sub_tier: string;
    marketing_name: string;
    price_cents: number;
    token: number;
    /** INTERNAL-ONLY per PRD — never render this in the UI. */
    draw_pass: number;
    spin: boolean;
    spin_discount_cents: number;
}

export interface VisitorTier {
    price_cents: number;
    token: number;
    draw_pass: string;
}

export interface MembershipTiers {
    red: TierOption[];
    blue: TierOption[];
    visitor: VisitorTier;
}

// ─── Resource functions ──────────────────────────────────────────────────────

/**
 * Public — active membership tiers. Wrapped in React.cache for per-request
 * dedup; revalidated hourly (pricing changes rarely).
 */
export const getMembershipTiers = cache(() => apiFetch<MembershipTiers>(API.memberships.tiers, { revalidate: 3600 }));
