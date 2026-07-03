import { getSessionIdentity } from '@/lib/session-member';
import type { MemberProfile } from '@/types/member';

// ─────────────────────────────────────────────────────────────────────────────
// Mock member profile (PRD §4.7). Consistent with the dashboard/entry-history
// mocks: James Carter, SLR RED (R4), NSW, upgraded Visitor → R1 → R4. Includes a
// SCHEDULED pending upgrade (R4 → B4) to demo the cancelable Paid→Paid flow.
// Swap getMemberProfile for the Axios API client later.
// ─────────────────────────────────────────────────────────────────────────────

const PROFILE: MemberProfile = {
    name: 'James Carter',
    email: 'james.carter@example.com',
    sub_tier: 'R4',
    state: 'NSW',
    member_id: 'SLR-NSW-004821',
    joined_at: '2026-02-13',
    billing_status: 'active',
    next_payment_date: '2026-07-14',
    price_cents: 2000,
    pending_upgrade: { to_sub_tier: 'B4', effective_date: '2026-07-14' },
    invoices: [
        {
            id: 'inv6',
            date: '2026-06-05',
            description: 'SLR RED (R4) — 28-day cycle',
            amount_cents: 2000,
            status: 'paid'
        },
        {
            id: 'inv5',
            date: '2026-05-08',
            description: 'SLR RED (R4) — 28-day cycle',
            amount_cents: 2000,
            status: 'paid'
        },
        {
            id: 'inv4',
            date: '2026-04-10',
            description: 'SLR RED (R1) — 28-day cycle',
            amount_cents: 1000,
            status: 'paid'
        },
        {
            id: 'inv3',
            date: '2026-03-13',
            description: 'SLR RED (R1) — 28-day cycle',
            amount_cents: 1000,
            status: 'paid'
        }
    ]
};

export async function getMemberProfile(): Promise<MemberProfile> {
    const id = await getSessionIdentity();

    return {
        ...PROFILE,
        name: id.name ?? PROFILE.name,
        email: id.email ?? PROFILE.email,
        sub_tier: id.sub_tier ?? PROFILE.sub_tier,
        state: id.state ?? PROFILE.state
    };
}
