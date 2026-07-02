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

// ─── Resource functions ──────────────────────────────────────────────────────

/** Partner discounts (RED/BLUE only — API enforces tier gating). */
export const getDiscounts = cache((token: string) =>
    apiFetch<Discount[]>(API.discounts.list, { token, cache: 'no-store' })
);
