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

// Sub-tier identifiers accepted by POST /memberships/change-tier (`subTierId`).
export type MemberSubTierId = 'visitor' | 'r1' | 'r4' | 'r7' | 'b1' | 'b4' | 'b7' | 'b10';

// Nested sub-tier config on the change-tier response.
export interface MembershipSubTier {
    id: string;
    tier: string; // 'VISITOR' | 'RED' | 'BLUE'
    marketingName: string;
    priceCents: number;
    token: number;
    /** INTERNAL-ONLY per PRD — never render this in the UI. */
    drawPassDefault: number;
    hasSpin: boolean;
    spinDiscountCents: number;
    stripePriceId: string | null;
    createdAt: string;
    updatedAt: string;
}

// Mirrors the live POST /memberships/change-tier response `data`.
export interface MembershipRecord {
    id: string;
    userId: string;
    subTierId: string;
    billingStatus: string;
    activatedAt: string;
    pendingBonusNextCycle: number;
    createdAt: string;
    updatedAt: string;
    subTier: MembershipSubTier;
}
/** Display-ready tier fields derived from the live API (never exposes draw_pass). */
export interface TierDisplay {
    price: string;
    tokens: string;
    name: string;
    spin: string | null;
}

// ─── Resource functions ──────────────────────────────────────────────────────

/**
 * Public — active membership tiers. Wrapped in React.cache for per-request
 * dedup; revalidated hourly (pricing changes rarely).
 */
export const getMembershipTiers = cache(() => apiFetch<MembershipTiers>(API.memberships.tiers, { revalidate: 3600 }));

/**
 * Admin: change a member's tier/sub-tier (callable on behalf of any member
 * with an admin token). Body `{ userId, subTierId }`. This sets tier + sub-tier
 * granularity; it does NOT change the member's state.
 */
export const changeMemberTier = (userId: string, subTierId: MemberSubTierId, token: string) => {
    return apiFetch<MembershipRecord>(API.memberships.changeTier, {
        method: 'POST',
        body: { userId, subTierId },
        token
    });
};
