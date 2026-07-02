import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTOs (mirror the OpenAPI schemas) ──────────────────────────────────────

export interface LoginResult {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in: number;
    user: {
        user_id: string;
        role: string;
        tier: string;
        sub_tier: string | null;
    };
}

export interface CurrentCycle {
    cycle_id: string;
    start_at: string;
    end_at: string;
    next_renewal_at: string;
}

export interface PendingUpgrade {
    target_sub_tier: string;
    effective_at: string;
}

export interface MeResult {
    user_id: string;
    full_name: string;
    email: string;
    phone: string;
    state: string;
    tier: string;
    sub_tier: string | null;
    token: number;
    billing_status: string;
    current_cycle: CurrentCycle | null;
    beny_active: boolean;
    pending_upgrade: PendingUpgrade | null;
    referral_code: string | null;
}

// ─── Resource functions ──────────────────────────────────────────────────────

export const login = (email: string, password: string) =>
    apiFetch<LoginResult>(API.auth.login, { method: 'POST', body: { email, password } });

export const getMe = (token: string) => apiFetch<MeResult>(API.auth.me, { token, cache: 'no-store' });
