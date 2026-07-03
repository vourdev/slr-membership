import { cache } from 'react';

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
