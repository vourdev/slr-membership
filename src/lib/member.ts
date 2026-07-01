import { SUB_TIERS, TIER_VISUALS } from '@/constant/tiers';
import type { SubTierCode, TierGroup } from '@/types/member';

import { format } from 'date-fns';

export function getSubTierMeta(code: SubTierCode) {
    return SUB_TIERS[code];
}

export function tierGroupOf(code: SubTierCode): TierGroup {
    return SUB_TIERS[code].group;
}

// ── Giveaway tier-access rules (PRD §4.3 role visibility) ─────────────────────

const TIER_RANK: Record<TierGroup, number> = { visitor: 0, red: 1, blue: 2 };

export function tierRank(group: TierGroup): number {
    return TIER_RANK[group];
}

/**
 * Tier tabs a member may see on the Giveaways page (PRD §4.3).
 * Visitor sees NO RED/BLUE segmented control — only the weekly Visitor draw.
 * RED and BLUE members both see the RED and BLUE tabs.
 */
export function visibleGiveawayTabs(memberGroup: TierGroup): TierGroup[] {
    return memberGroup === 'visitor' ? [] : ['red', 'blue'];
}

/**
 * A giveaway is locked (upsell) when its tier is above the member's tier.
 * Equal/below → the member is entered (BLUE has full access to RED + BLUE).
 */
export function isGiveawayLocked(giveawayTier: TierGroup, memberGroup: TierGroup): boolean {
    return tierRank(giveawayTier) > tierRank(memberGroup);
}

const audFormatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

/** Format integer cents (AUD) as currency, e.g. 2000 -> "$20", 3950 -> "$39.50". */
export function formatAud(cents: number): string {
    return audFormatter.format(cents / 100);
}

/** Draw pool = state + tier, e.g. "SLR Red · NSW". */
export function formatDrawPool(group: TierGroup, state: string): string {
    return `SLR ${TIER_VISUALS[group].poolLabel} · ${state}`;
}

/** Short date, e.g. "28 Jul 2026". */
export function formatShortDate(iso: string): string {
    return format(new Date(iso), 'd MMM yyyy');
}

/** Draw date + time, e.g. "Fri, 3 Jul · 8:00 PM". */
export function formatDrawDateTime(iso: string): string {
    return format(new Date(iso), 'EEE, d MMM · h:mm a');
}
