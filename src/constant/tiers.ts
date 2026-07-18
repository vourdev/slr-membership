import type { SubTierCode, TierGroup } from '@/types/member';

export interface SubTierMeta {
    code: SubTierCode;
    group: TierGroup;
    label: string; // short code shown on the badge, e.g. 'R4'
    marketingName: string; // customer-facing name, e.g. 'Plus' (never the code)
    tokens: number;
    price_cents: number; // 0 for Visitor; otherwise per 28-day cycle (AUD cents)
}

// Pricing/tokens per CLAUDE.md §1 tier table.
export const SUB_TIERS: Record<SubTierCode, SubTierMeta> = {
    VISITOR: {
        code: 'VISITOR',
        group: 'visitor',
        label: 'Visitor',
        marketingName: 'Visitor',
        tokens: 1,
        price_cents: 0
    },
    R1: { code: 'R1', group: 'red', label: 'R1', marketingName: 'Standard', tokens: 1, price_cents: 1000 },
    R4: { code: 'R4', group: 'red', label: 'R4', marketingName: 'Plus', tokens: 4, price_cents: 2000 },
    R7: { code: 'R7', group: 'red', label: 'R7', marketingName: 'Premium', tokens: 7, price_cents: 3000 },
    B1: { code: 'B1', group: 'blue', label: 'B1', marketingName: 'Standard', tokens: 1, price_cents: 2600 },
    B4: { code: 'B4', group: 'blue', label: 'B4', marketingName: 'Plus', tokens: 4, price_cents: 3900 },
    B7: { code: 'B7', group: 'blue', label: 'B7', marketingName: 'Premium', tokens: 7, price_cents: 5200 },
    B10: { code: 'B10', group: 'blue', label: 'B10', marketingName: 'Elite', tokens: 10, price_cents: 6500 }
};

export interface TierVisual {
    label: string; // group display name, e.g. 'RED'
    poolLabel: string; // used inside the draw-pool string, e.g. 'Red'
    textClass: string;
    badgeBg: string; // inline gradient for the tier pill (matches home-page cards)
    badgeBorder: string; // inline border colour (alpha hex)
}

// Diagonal tier gradients + accents lifted from the home-page tier cards (CLAUDE.md §4.1).
export const TIER_VISUALS: Record<TierGroup, TierVisual> = {
    visitor: {
        label: 'Visitor',
        poolLabel: 'Visitor',
        textClass: 'text-slr-dim',
        badgeBg: 'linear-gradient(154.36deg, #141820 0.82%, #1E2530 49.73%, #141820 98.65%)',
        badgeBorder: '#A0B4D259'
    },
    red: {
        label: 'RED',
        poolLabel: 'Red',
        textClass: 'text-[#E88888]',
        badgeBg: 'linear-gradient(154.36deg, #1C0308 0.82%, #2A0810 49.73%, #1A0306 98.65%)',
        badgeBorder: '#C8152E66'
    },
    blue: {
        label: 'BLUE',
        poolLabel: 'Blue',
        textClass: 'text-[#7FB0F5]',
        badgeBg: 'linear-gradient(154.36deg, #0E1828 0.82%, #142034 49.73%, #0E1828 98.65%)',
        badgeBorder: '#2878E84D'
    }
};
