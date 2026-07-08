import { cache } from 'react';

import { formatDrawPool, isGiveawayLocked } from '@/lib/member';
import type { EntryStatus, Giveaway, GiveawayDetail, TierGroup } from '@/types/member';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTOs (mirrored from the live GET /giveaways/winners response) ────────────

export interface GiveawayWinnerGiveaway {
    giveaway_id: string;
    name: string;
    tier: string;
    type: string;
}

export interface GiveawayWinner {
    winner_id: string;
    user_id: string;
    full_name: string;
    state: string;
    prize: string;
    recorded_at: string;
    giveaway: GiveawayWinnerGiveaway;
}

// ─── Resource functions (React.cache = per-request dedup) ─────────────────────

export const getGiveawayWinners = cache((token: string) =>
    apiFetch<GiveawayWinner[]>(API.giveaways.winners, { token, cache: 'no-store' })
);

// ─── Active giveaways (list + detail) ────────────────────────────────────────
//
// ⚠️ UNVERIFIED SHAPE: GET /giveaways/ currently returns 500 INTERNAL_ERROR for
// every tier (winners works, list/detail don't), so these DTOs can't be checked
// against a real body. Modelled off the OpenAPI summary + the winners `giveaway`
// hint ({ giveaway_id, name, tier, type }). Mappers below default every display
// field so a backend fix is a field-name tweak, not a rewrite. See the SP1 spec
// + docs/API-INTEGRATION.md blockers. Pages degrade to EmptyState meanwhile.

export interface ApiGiveaway {
    giveaway_id: string;
    name: string;
    tier: string; // 'VISITOR' | 'RED' | 'BLUE'
    type?: string;
    state?: string | null;
    prize?: string | null;
    entered?: boolean | null;
    entry_status?: EntryStatus | null;
    total_entries?: number | null;
    pool_entries?: number | null;
    draws_at?: string | null;
    draw_at?: string | null;
}

export interface ApiGiveawayDetail extends ApiGiveaway {
    prize_description?: string | null;
    description?: string | null;
    rules?: string[] | null;
    tpal_note?: string | null;
}

function tierGroupFromApi(tier: string | undefined): TierGroup {
    const t = tier?.toUpperCase();
    if (t === 'RED') return 'red';
    if (t === 'BLUE') return 'blue';

    return 'visitor';
}

/** Map an API giveaway → the UI `Giveaway`, resolving lock/pool against the member. */
export function toGiveaway(g: ApiGiveaway, memberGroup: TierGroup, memberState: string): Giveaway {
    const group = tierGroupFromApi(g.tier);
    const locked = isGiveawayLocked(group, memberGroup);
    const entryStatus: EntryStatus = g.entry_status ?? 'inactive';

    return {
        id: g.giveaway_id || '-',
        title: g.name?.trim() || '-',
        tier_group: group,
        draw_pool: formatDrawPool(group, g.state?.trim() || memberState || '-'),
        prize_label: g.prize?.trim() || '-',
        entered: g.entered ?? (!locked && entryStatus === 'active'),
        entry_status: entryStatus,
        total_entries: g.total_entries ?? 0,
        pool_entries: g.pool_entries ?? 0,
        locked,
        draws_at: g.draws_at ?? g.draw_at ?? ''
    };
}

/** Map an API giveaway detail → the UI `GiveawayDetail` (entry history / winners come from other endpoints → empty). */
export function toGiveawayDetail(g: ApiGiveawayDetail, memberGroup: TierGroup, memberState: string): GiveawayDetail {
    return {
        ...toGiveaway(g, memberGroup, memberState),
        prize_description: g.prize_description?.trim() || g.description?.trim() || '-',
        rules: g.rules?.filter(Boolean) ?? [],
        tpal_note: g.tpal_note?.trim() || 'Draws are conducted externally and certified via TPAL (randomdraws.com.au).',
        entry_history: [],
        past_winners: []
    };
}

/** Active giveaways for the member's tier. ⚠️ backend 500 → callers must try/catch → EmptyState. */
export const getGiveaways = cache((token: string) =>
    apiFetch<ApiGiveaway[]>(API.giveaways.list, { token, cache: 'no-store' })
);

/** One giveaway's detail. ⚠️ unverifiable while the list 500s → callers try/catch → notFound. */
export const getGiveaway = cache((id: string, token: string) =>
    apiFetch<ApiGiveawayDetail>(API.giveaways.detail(id), { token, cache: 'no-store' })
);
