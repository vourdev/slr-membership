import type { PrizePool } from '@/types/member';

// ─────────────────────────────────────────────────────────────────────────────
// Mock prize-pool data (PRD §"Sistem Stage Prize Pool"). Values mirror the
// Stage 1 example from the latest design and represent what the admin CMS would
// supply — every field is plain text/number, no system logic. Swap getPrizePool
// for the CMS/Axios source once available.
// ─────────────────────────────────────────────────────────────────────────────

const PRIZE_POOL: PrizePool = {
    headline: '$2,100',
    prizes_sublabel: '@ 22 Prizes • One Month',
    stage_label: 'For 100 Members • Stage 1',
    current_stage: 1,
    current_members: 142,
    odds_label: '9 in 10 wins yearly',
    tiers: [
        {
            tier_group: 'visitor',
            tier_label: 'Visitor',
            price_label: 'Free to join',
            weekly: '$25 Coles Digital Credit',
            monthly: null
        },
        {
            tier_group: 'red',
            tier_label: 'SLR RED',
            price_label: 'from $10/month',
            weekly: '$25 Coles Credits + $50 Cash',
            monthly: '$300 Bonus Monthly Credit'
        },
        {
            tier_group: 'blue',
            tier_label: 'SLR BLUE',
            price_label: 'from $26/month',
            weekly: '$25 Coles Credits + $150 Cash',
            monthly: '$700 Bonus Monthly Credit'
        }
    ],
    stages: [
        { stage: 1, members_required: 100 },
        { stage: 2, members_required: 200 },
        { stage: 3, members_required: 300 },
        { stage: 4, members_required: 400 },
        { stage: 5, members_required: 500 },
        { stage: 6, members_required: 1000 },
        { stage: 7, members_required: 2000 }
    ]
};

export async function getPrizePool(): Promise<PrizePool> {
    return PRIZE_POOL;
}
