import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTOs (mirrored from the live responses) ─────────────────────────────────
// GET /beny/status → { beny_status }. POST/DELETE /beny/subscribe → { beny_status }.
// Enum observed live: inactive → pending_activation → active → canceled.

export type BenyStatusValue = 'inactive' | 'pending_activation' | 'active' | 'canceled';

export interface BenyStatusResponse {
    beny_status: BenyStatusValue;
}

// POST /beny/subscribe requires `name` (not `full_name`), plus email + phone.
export interface BenySubscribePayload {
    name: string;
    email: string;
    phone: string;
}

// ─── Resource functions ──────────────────────────────────────────────────────

/** Current member's BENY add-on status (RED/BLUE add-on; visitor stays inactive). */
export const getBenyStatus = cache((token: string) =>
    apiFetch<BenyStatusResponse>(API.beny.status, { token, cache: 'no-store' })
);

/** Subscribe to the BENY add-on. Collects contact details; backend creates a pending record. */
export const subscribeBeny = (token: string, body: BenySubscribePayload) =>
    apiFetch<BenyStatusResponse>(API.beny.subscribe, { method: 'POST', token, body });

/** Cancel the BENY add-on. Backend returns NOT_FOUND unless the subscription is active. */
export const cancelBeny = (token: string) =>
    apiFetch<BenyStatusResponse>(API.beny.subscribe, { method: 'DELETE', token });
