import { cache } from 'react';

import { API } from '../endpoints';
import { apiFetch } from '../http';

// ── DTOs ──────────────────────────────────────────────────────────────────────

// Mirrors the live GET /admin/dashboard response.
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

export interface AdminDashboardMetrics {
    total_members: number;
    active_subscriptions: number;
    mrr_cents: number;
    members_by_tier: TierCount[];
    members_by_state: StateCount[];
    alerts: DashboardAlerts;
}

export interface AdminMemberListItem {
    user_id: string;
    full_name: string;
    email: string;
    phone: string;
    state: string;
    status: 'active' | 'suspended' | 'deactivated';
    tier: string; // e.g., 'RED R4'
    created_at: string;
}

export interface AdminMemberDetailMembership {
    tier: string;
    tier_code: string;
    billing_status: string;
    renew_at: string | null;
}

export interface AdminMemberDetailSubscription {
    stripe_subscription_id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
}

export interface AdminMemberDetailCycle {
    cycle_id: string;
    start_at: string;
    end_at: string;
    tier: string;
    base_token: number;
    referral_bonus: number;
    total_token: number;
    draw_pass: number;
    status: string;
}

export interface AdminMemberDetailWin {
    // TODO: Define win structure once backend provides examples
    win_id: string;
    giveaway_name: string;
    won_at: string;
}

export interface AdminMemberDetail {
    user_id: string;
    full_name: string;
    email: string;
    phone: string;
    state: string;
    status: 'active' | 'suspended' | 'deactivated' | string;
    created_at: string;
    membership: AdminMemberDetailMembership;
    subscription: AdminMemberDetailSubscription | null;
    cycles: AdminMemberDetailCycle[];
    wins: AdminMemberDetailWin[];
}

// ── Resource functions ──────────────────────────────────────────────────────

export const getAdminDashboardMetrics = cache((token: string) => {
    return apiFetch<AdminDashboardMetrics>(API.admin.dashboard, { token, cache: 'no-store' });
});

export const getAdminMembers = cache((token: string) => {
    // Note: Backend currently returns 400 for any parameters, so no filters are passed.
    return apiFetch<AdminMemberListItem[]>(API.admin.members, { token, cache: 'no-store' });
});

export const getAdminMemberDetail = cache((userId: string, token: string) => {
    return apiFetch<AdminMemberDetail>(API.admin.memberDetail(userId), { token, cache: 'no-store' });
});

export const deleteAdminMember = (userId: string, token: string) => {
    return apiFetch<null>(API.admin.deleteMember(userId), { method: 'DELETE', token });
};
