// Member-domain types for the SLR member area.
//
// IMPORTANT: draw_pass is INTERNAL-ONLY and must never reach the frontend. The
// API exposes it as `entry_status` (active/inactive). These types deliberately
// omit draw_pass — only `entry_status` is modelled. See CLAUDE.md §1.

export type TierGroup = 'visitor' | 'red' | 'blue';

export type SubTierCode = 'VISITOR' | 'R1' | 'R4' | 'R7' | 'B1' | 'B4' | 'B7' | 'B10';

export type EntryStatus = 'active' | 'inactive';

export type BillingStatus = 'active' | 'past_due' | 'canceled';

export interface CurrentMember {
    name: string;
    sub_tier: SubTierCode;
    state: string; // AU state code, e.g. 'NSW'
}

export interface MembershipSummary {
    sub_tier: SubTierCode;
    state: string;
    billing_status: BillingStatus;
    price_cents: number; // integer cents AUD, billed per 28-day cycle
    next_payment_date: string; // ISO date — next renewal
    beny_addon: boolean; // BENY $4/mo add-on active?
}

export interface DrawStatus {
    giveaway_id: string;
    title: string;
    draw_pool: string; // state + tier, e.g. 'SLR Red · NSW'
    prize_label: string;
    entry_status: EntryStatus; // active/inactive only — never draw_pass
    total_entries: number; // member's entries in this draw (token count, safe to render)
    draws_at: string; // ISO datetime — drives the countdown
}

export interface FeaturedDiscount {
    id: string;
    brand: string;
    category: string;
    value_label: string; // e.g. '5% off', '4¢ / L'
}

export interface UpcomingGiveaway {
    id: string;
    title: string;
    tier_group: TierGroup;
    prize_label: string;
    draws_at: string; // ISO datetime
    locked: boolean; // true when the giveaway tier is above the member's (upgrade required)
}

export interface MemberDashboard {
    member: CurrentMember;
    summary: MembershipSummary;
    draw: DrawStatus;
    featured_discounts: FeaturedDiscount[];
    upcoming_giveaways: UpcomingGiveaway[];
    notifications_count: number;
}
