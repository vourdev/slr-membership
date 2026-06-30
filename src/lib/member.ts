import { SUB_TIERS, TIER_VISUALS } from '@/constant/tiers';
import type { SubTierCode, TierGroup } from '@/types/member';

import { format } from 'date-fns';

export function getSubTierMeta(code: SubTierCode) {
    return SUB_TIERS[code];
}

export function tierGroupOf(code: SubTierCode): TierGroup {
    return SUB_TIERS[code].group;
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
