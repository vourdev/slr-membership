import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type CheckoutTier = 'RED' | 'BLUE';

export interface CheckoutSession {
    url: string;
    sessionId?: string;
}

export interface PortalSession {
    url: string;
}

// ─── Resource functions ──────────────────────────────────────────────────────
// Hosted Stripe: the app only redirects to `url`; the backend handles webhooks.
// ⚠️ Seed dev accounts have placeholder Stripe customer ids → 400 "No such
// customer"; real (checked-out) members return a live URL.

export const createCheckoutSession = (token: string, body: { tier: CheckoutTier; couponId?: string }) =>
    apiFetch<CheckoutSession>(API.stripe.checkout, { method: 'POST', token, body });

export const createPortalSession = (token: string) =>
    apiFetch<PortalSession>(API.stripe.portal, { method: 'POST', token });
