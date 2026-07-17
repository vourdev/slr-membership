import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTOs (mirrored from the live responses) ─────────────────────────────────
// GET /beny/status → { beny_status }. POST /beny/subscribe → { beny_status }.
// DELETE /beny/subscribe carries NO beny_status — see cancelBeny below.
// Flow: inactive → pending_activation → (admin activates) → active → cancelled.
//
// The API spells the terminal state "cancelled" (AU/British). Earlier notes here
// said "canceled" — that was never observed live (nobody could cancel until BENY
// was activated on a seed account 2026-07-17). Both are accepted so a backend
// spelling change can't silently strand members on the cancelled screen.
export type BenyStatusValue = 'inactive' | 'pending_activation' | 'active' | 'cancelled' | 'canceled';

/** True for either spelling of the cancelled state. */
export const isBenyCancelled = (status: BenyStatusValue) => status === 'cancelled' || status === 'canceled';

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

/**
 * Cancel the BENY add-on.
 *
 * Verified live 2026-07-17: `data` is `{ success, message }` (or `null`) — it does
 * NOT carry `beny_status`, so callers must assume "cancelled" or re-read
 * `getBenyStatus`. Returns 404 `NOT_FOUND` unless the subscription is already
 * `active`; a `pending_activation` member cannot cancel, which contradicts the
 * PRD ("user bisa cancel kapan saja"). See docs/BACKEND-ISSUES.md.
 */
export const cancelBeny = (token: string) =>
    apiFetch<{ success?: boolean; message?: string } | null>(API.beny.subscribe, { method: 'DELETE', token });
