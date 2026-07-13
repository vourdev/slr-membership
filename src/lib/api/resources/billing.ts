import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTOs (mirrored from the live responses) ─────────────────────────────────

export interface BillingStatus {
    billing_status: 'active' | 'grace' | 'inactive' | string;
    next_renewal_at: string | null;
    grace_period: { started_at: string; expires_at: string } | null;
    stripe_subscription_id: string | null;
}

// GET /billing/invoices → `data` is the invoice array (meta holds pagination).
// ⚠️ Item fields per the FE Stripe guide — seed invoices are empty, so unverified live.
export interface BillingInvoice {
    invoice_id: string;
    amount_cents: number;
    discount_cents: number;
    stripe_invoice_id: string | null;
    paid_at: string | null;
    type: 'initial' | 'renewal' | 'manual_grace' | string;
}

// ─── Resource functions ──────────────────────────────────────────────────────

export const getBillingStatus = cache((token: string) =>
    apiFetch<BillingStatus>(API.billing.status, { token, cache: 'no-store' })
);

export const getBillingInvoices = cache((token: string, page = 1, perPage = 10) =>
    apiFetch<BillingInvoice[]>(`${API.billing.invoices}?page=${page}&per_page=${perPage}`, {
        token,
        cache: 'no-store'
    })
);
