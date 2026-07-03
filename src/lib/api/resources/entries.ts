import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

export interface EntryCycle {
    cycle_id: string;
    start_at: string;
    end_at: string;
    tier: string;
    base_token: number;
    referral_bonus: number;
    total_token: number;
    entry_status: 'active' | 'inactive';
}

export interface EntryHistoryResponse {
    current_cycle: EntryCycle | null;
    history: EntryCycle[];
}

export const getEntryHistory = cache((token: string) => {
    return apiFetch<EntryHistoryResponse>(API.entries.history, { token, cache: 'no-store' });
});
