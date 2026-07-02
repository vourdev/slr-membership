import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// ─── DTOs (mirror the OpenAPI schemas) ──────────────────────────────────────

export interface AdminMember {
    user_id: string;
    full_name: string;
    email: string;
    state: string;
    phone: string;
    status: string;
    tier: string;
    billing_status: string;
    created_at: string;
}

export interface TierCount {
    tier: string;
    count: number;
}

export interface StateCount {
    state: string;
    count: number;
}

export interface DashboardAlerts {
    failed_payments_30d: number;
    pending_beny_activations: number;
}

export interface AdminDashboard {
    total_members: number;
    active_subscriptions: number;
    mrr_cents: number;
    members_by_tier: TierCount[];
    members_by_state: StateCount[];
    alerts: DashboardAlerts;
}

// ─── Resource functions (React.cache = per-request dedup) ────────────────────

export const getAdminMembers = cache((token: string) =>
    apiFetch<AdminMember[]>(API.admin.members, { token, cache: 'no-store' })
);

export const getAdminDashboard = cache((token: string) =>
    apiFetch<AdminDashboard>(API.admin.dashboard, { token, cache: 'no-store' })
);
