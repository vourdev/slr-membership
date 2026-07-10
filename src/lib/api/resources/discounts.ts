import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTO (mirrors the OpenAPI schema) ────────────────────────────────────────

export interface Discount {
    discount_id: string;
    title: string;
    partner_name: string;
    description: string | null;
    category: string;
    is_featured: boolean;
    // ⚠️ Not yet returned by the member API (only on the admin create/PATCH response).
    // Optional so the real value flows through automatically once the backend exposes
    // them on GET /discounts/ + /{id}; until then the card shows placeholders.
    // See docs/BACKEND-ISSUES.md ("member discount DTO is thin").
    value_label?: string | null;
    code?: string | null;
    terms?: string | null;
}

// Admin create/patch responses are camelCase and richer than the member list DTO.
export interface DiscountAdmin {
    id: string;
    title: string;
    partnerName: string;
    description: string | null;
    category: string;
    code: string | null;
    terms: string | null;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDiscountPayload {
    title: string;
    partnerName: string;
    category: string;
    description?: string;
    isFeatured?: boolean;
    isActive?: boolean;
}

// PATCH is a partial merge (verified: sending only { isFeatured } keeps description/terms).
export type UpdateDiscountPayload = Partial<CreateDiscountPayload>;

// ─── Resource functions ──────────────────────────────────────────────────────

/** Partner discounts (RED/BLUE only — API enforces tier gating; admin gets 403). */
export const getDiscounts = cache((token: string) =>
    apiFetch<Discount[]>(API.discounts.list, { token, cache: 'no-store' })
);

/** One discount's detail. ⚠️ tier-gated like the list (admin gets 403); member DTO omits code/terms. */
export const getDiscount = cache((id: string, token: string) =>
    apiFetch<Discount>(API.discounts.detail(id), { token, cache: 'no-store' })
);

/** Admin: create a discount. */
export const createDiscount = (token: string, body: CreateDiscountPayload) =>
    apiFetch<DiscountAdmin>(API.discounts.create, { method: 'POST', token, body });

/** Admin: update a discount (partial merge). Returns the full camelCase record. */
export const updateDiscount = (token: string, id: string, body: UpdateDiscountPayload) =>
    apiFetch<DiscountAdmin>(API.discounts.update(id), { method: 'PATCH', token, body });

/** Admin: delete a discount by id. */
export const deleteDiscount = (token: string, id: string) =>
    apiFetch<null>(API.discounts.remove(id), { method: 'DELETE', token });
