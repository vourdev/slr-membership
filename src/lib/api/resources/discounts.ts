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

// ─── Resource functions ──────────────────────────────────────────────────────

/** Partner discounts (RED/BLUE only — API enforces tier gating; admin gets 403). */
export const getDiscounts = cache((token: string) =>
    apiFetch<Discount[]>(API.discounts.list, { token, cache: 'no-store' })
);

/** Admin: create a discount. */
export const createDiscount = (token: string, body: CreateDiscountPayload) =>
    apiFetch<DiscountAdmin>(API.discounts.create, { method: 'POST', token, body });

/** Admin: delete a discount by id. */
export const deleteDiscount = (token: string, id: string) =>
    apiFetch<null>(API.discounts.remove(id), { method: 'DELETE', token });
