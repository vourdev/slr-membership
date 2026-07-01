import { formatDrawPool, getSubTierMeta, isGiveawayLocked, tierGroupOf } from '@/lib/member';
import type { Giveaway, GiveawayDetail, GiveawayEntryRow, PastWinner, SubTierCode, TierGroup } from '@/types/member';

// ─────────────────────────────────────────────────────────────────────────────
// Mock giveaways for the member area (PRD §4.3). The array below stores only the
// giveaway *facts* (tier, prize, timing). Member-specific state — locked,
// entered, entry_status, total_entries, entry_history — is computed per member
// by resolveForMember() so tier-access is correct for ANY role (Visitor / RED /
// BLUE), not hard-coded. Swap the getters for the Axios API client later.
// ─────────────────────────────────────────────────────────────────────────────

// Giveaway facts, independent of who is viewing.
interface GiveawayFacts {
    id: string;
    title: string;
    tier_group: TierGroup;
    draw_pool: string;
    prize_label: string;
    pool_entries: number;
    draws_at: string;
    prize_description: string;
    rules: string[];
    tpal_note: string;
    entry_history: GiveawayEntryRow[]; // shown only when the member is entered
    past_winners: PastWinner[];
}

const TPAL_NOTE =
    'This giveaway is conducted as an Australian Trade Promotion Lottery (TPAL). Entries are exported per tier and drawn externally at randomdraws.com.au under permit. Permit numbers are available on request. Draw pools are segmented by state and tier.';

function rulesFor(tierLabel: string, state: string): string[] {
    return [
        `Open to SLR ${tierLabel} members with an active subscription in ${state}.`,
        'Entries are allocated automatically each 28-day cycle based on your token count — no manual entry required.',
        'Winners are drawn at random at randomdraws.com.au under TPAL certification.',
        'One prize per winner. Prizes are not transferable or redeemable for cash unless stated otherwise.',
        'Results are published within 48 hours of the scheduled draw time and winners are notified by email.'
    ];
}

const NSW = 'NSW';

function redPastWinners(): PastWinner[] {
    return [
        { name: 'Sarah M.', state: 'VIC', prize: '$12,000 Cash', drawn_at: '2026-06-06' },
        { name: 'James T.', state: 'NSW', prize: '$10,000 Cash', drawn_at: '2026-05-09' },
        { name: 'Priya K.', state: 'QLD', prize: '$8,000 Cash', drawn_at: '2026-04-11' }
    ];
}

function bluePastWinners(): PastWinner[] {
    return [
        { name: 'Daniel R.', state: 'NSW', prize: 'Bali Holiday + $5,000', drawn_at: '2026-06-06' },
        { name: 'Aisha B.', state: 'WA', prize: '$25,000 Cash', drawn_at: '2026-05-09' },
        { name: 'Liam O.', state: 'SA', prize: 'Luxury Car Lease (12mo)', drawn_at: '2026-04-11' }
    ];
}

function visitorPastWinners(): PastWinner[] {
    return [
        { name: 'Mia L.', state: 'NSW', prize: '$25 Coles Credit', drawn_at: '2026-06-27' },
        { name: 'Noah P.', state: 'VIC', prize: '$25 Coles Credit', drawn_at: '2026-06-20' },
        { name: 'Ava S.', state: 'QLD', prize: '$25 Coles Credit', drawn_at: '2026-06-13' }
    ];
}

const RED_HISTORY: GiveawayEntryRow[] = [
    { cycle: 'Cycle 12 · Jun 2026', entries: 4, status: 'active' },
    { cycle: 'Cycle 11 · May 2026', entries: 4, status: 'active' }
];

const GIVEAWAYS: GiveawayFacts[] = [
    // ── Visitor (weekly, free) ───────────────────────────────────────────────
    {
        id: 'gw_visitor_weekly',
        title: 'Weekly Visitor Draw',
        tier_group: 'visitor',
        draw_pool: formatDrawPool('visitor', NSW),
        prize_label: '$25 Coles Digital Credit',
        pool_entries: 5400,
        draws_at: '2026-07-05T20:00:00+10:00',
        prize_description:
            'Every week one Visitor member wins a $25 Coles Digital Credit — free to enter, just keep your account active.',
        rules: rulesFor('Visitor', NSW),
        tpal_note: TPAL_NOTE,
        entry_history: [{ cycle: 'This week', entries: 1, status: 'active' }],
        past_winners: visitorPastWinners()
    },

    // ── RED ──────────────────────────────────────────────────────────────────
    {
        id: 'gw_red_nsw_2607',
        title: 'SLR Red Mega Cash Draw',
        tier_group: 'red',
        draw_pool: formatDrawPool('red', NSW),
        prize_label: '$15,000 Cash',
        pool_entries: 1840,
        draws_at: '2026-07-03T20:00:00+10:00',
        prize_description:
            'A single lucky RED member takes home $15,000 in cash, paid directly to their nominated account within 5 business days of the draw.',
        rules: rulesFor('RED', NSW),
        tpal_note: TPAL_NOTE,
        entry_history: [
            { cycle: 'Cycle 12 · Jun 2026', entries: 4, status: 'active' },
            { cycle: 'Cycle 11 · May 2026', entries: 4, status: 'active' },
            { cycle: 'Cycle 10 · Apr 2026', entries: 4, status: 'active' }
        ],
        past_winners: redPastWinners()
    },
    {
        id: 'gw_red_wknd',
        title: 'Red Weekend Escape',
        tier_group: 'red',
        draw_pool: formatDrawPool('red', NSW),
        prize_label: '$5,000 Travel Voucher',
        pool_entries: 1620,
        draws_at: '2026-07-06T20:00:00+10:00',
        prize_description:
            'A $5,000 travel voucher redeemable with our partner travel agency — flights, stays, and experiences across Australia and beyond.',
        rules: rulesFor('RED', NSW),
        tpal_note: TPAL_NOTE,
        entry_history: RED_HISTORY,
        past_winners: redPastWinners()
    },
    {
        id: 'gw_red_1007',
        title: 'SLR Red Cash Boost',
        tier_group: 'red',
        draw_pool: formatDrawPool('red', NSW),
        prize_label: '$30,000 Cash',
        pool_entries: 2110,
        draws_at: '2026-07-10T20:00:00+10:00',
        prize_description:
            'The biggest RED draw of the cycle — $30,000 cash to one member. Entries close at the scheduled draw time.',
        rules: rulesFor('RED', NSW),
        tpal_note: TPAL_NOTE,
        entry_history: RED_HISTORY,
        past_winners: redPastWinners()
    },
    {
        id: 'gw_red_tech',
        title: 'Red Tech Bundle',
        tier_group: 'red',
        draw_pool: formatDrawPool('red', NSW),
        prize_label: '$3,500 Tech Pack',
        pool_entries: 1490,
        draws_at: '2026-07-17T20:00:00+10:00',
        prize_description:
            'A curated $3,500 tech bundle — latest laptop, phone, and accessories, delivered to your door.',
        rules: rulesFor('RED', NSW),
        tpal_note: TPAL_NOTE,
        entry_history: [{ cycle: 'Cycle 12 · Jun 2026', entries: 4, status: 'active' }],
        past_winners: redPastWinners()
    },

    // ── BLUE ─────────────────────────────────────────────────────────────────
    {
        id: 'gw_blue_1207',
        title: 'Premium Holiday Escape',
        tier_group: 'blue',
        draw_pool: formatDrawPool('blue', NSW),
        prize_label: 'Bali Holiday + $5,000',
        pool_entries: 980,
        draws_at: '2026-07-12T20:00:00+10:00',
        prize_description:
            'A 7-night luxury Bali holiday for two plus $5,000 spending money. Exclusive to SLR BLUE members.',
        rules: rulesFor('BLUE', NSW),
        tpal_note: TPAL_NOTE,
        entry_history: [
            { cycle: 'Cycle 12 · Jun 2026', entries: 4, status: 'active' },
            { cycle: 'Cycle 11 · May 2026', entries: 4, status: 'active' }
        ],
        past_winners: bluePastWinners()
    },
    {
        id: 'gw_blue_car',
        title: 'Blue Luxury Car Draw',
        tier_group: 'blue',
        draw_pool: formatDrawPool('blue', NSW),
        prize_label: 'Tesla Model 3',
        pool_entries: 1240,
        draws_at: '2026-07-20T20:00:00+10:00',
        prize_description: 'Drive away in a brand-new Tesla Model 3, on-road costs included. BLUE members only.',
        rules: rulesFor('BLUE', NSW),
        tpal_note: TPAL_NOTE,
        entry_history: [{ cycle: 'Cycle 12 · Jun 2026', entries: 4, status: 'active' }],
        past_winners: bluePastWinners()
    },
    {
        id: 'gw_blue_vault',
        title: 'Premium Cash Vault',
        tier_group: 'blue',
        draw_pool: formatDrawPool('blue', NSW),
        prize_label: '$50,000 Cash',
        pool_entries: 1705,
        draws_at: '2026-07-27T20:00:00+10:00',
        prize_description: 'The headline BLUE prize — $50,000 cash to one lucky Premium member.',
        rules: rulesFor('BLUE', NSW),
        tpal_note: TPAL_NOTE,
        entry_history: [{ cycle: 'Cycle 12 · Jun 2026', entries: 4, status: 'active' }],
        past_winners: bluePastWinners()
    }
];

// Resolve a giveaway's member-specific state from the viewer's tier (PRD §4.3):
// tier above the member → locked/upsell; equal or below → entered. entry_status
// (never draw_pass) drives the badge; total_entries = the member's token count.
function resolveForMember(facts: GiveawayFacts, memberSubTier: SubTierCode): GiveawayDetail {
    const memberGroup = tierGroupOf(memberSubTier);
    const locked = isGiveawayLocked(facts.tier_group, memberGroup);
    const entered = !locked;
    const tokens = getSubTierMeta(memberSubTier).tokens;

    return {
        id: facts.id,
        title: facts.title,
        tier_group: facts.tier_group,
        draw_pool: facts.draw_pool,
        prize_label: facts.prize_label,
        pool_entries: facts.pool_entries,
        draws_at: facts.draws_at,
        locked,
        entered,
        entry_status: entered ? 'active' : 'inactive',
        total_entries: entered ? tokens : 0,
        prize_description: facts.prize_description,
        rules: facts.rules,
        tpal_note: facts.tpal_note,
        entry_history: entered ? facts.entry_history : [],
        past_winners: facts.past_winners
    };
}

export async function getGiveaways(memberSubTier: SubTierCode): Promise<Giveaway[]> {
    return GIVEAWAYS.map((facts) => resolveForMember(facts, memberSubTier));
}

export async function getGiveawayById(id: string, memberSubTier: SubTierCode): Promise<GiveawayDetail | null> {
    const facts = GIVEAWAYS.find((g) => g.id === id);

    return facts ? resolveForMember(facts, memberSubTier) : null;
}
