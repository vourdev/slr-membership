import { formatDrawPool } from '@/lib/member';
import type { CurrentMember, MemberDashboard } from '@/types/member';

// ─────────────────────────────────────────────────────────────────────────────
// Mock member-dashboard data. Swap these getters for the Axios API client
// (NEXT_PUBLIC_API_URL) once the Express endpoints land — the return shapes are
// the contract. Demo member is an SLR RED (R4) in NSW so the UI exercises a
// sub-tier badge and a tier-locked upcoming giveaway (the BLUE draw).
// ─────────────────────────────────────────────────────────────────────────────

const MEMBER: CurrentMember = {
    name: 'James Carter',
    sub_tier: 'R4',
    state: 'NSW'
};

const DASHBOARD: MemberDashboard = {
    member: MEMBER,
    summary: {
        sub_tier: 'R4',
        state: 'NSW',
        billing_status: 'active',
        price_cents: 2000,
        next_payment_date: '2026-07-14',
        beny_addon: true
    },
    draw: {
        giveaway_id: 'gw_red_nsw_2607',
        title: 'SLR Red Mega Cash Draw',
        draw_pool: formatDrawPool('red', 'NSW'),
        prize_label: '$15,000 Cash',
        entry_status: 'active',
        total_entries: 4,
        draws_at: '2026-07-03T20:00:00+10:00'
    },
    featured_discounts: [
        { id: 'd_coles', brand: 'Coles', category: 'Groceries', value_label: '5% off' },
        { id: 'd_bp', brand: 'BP', category: 'Fuel', value_label: '4¢ / L' },
        { id: 'd_jbhifi', brand: 'JB Hi-Fi', category: 'Electronics', value_label: '10% off' },
        { id: 'd_woolworths', brand: 'Woolworths', category: 'Groceries', value_label: '5% off' },
        { id: 'd_bunnings', brand: 'Bunnings', category: 'Home', value_label: '$10 off' },
        { id: 'd_kmart', brand: 'Kmart', category: 'Retail', value_label: '10% off' }
    ],
    upcoming_giveaways: [
        {
            id: 'gw_visitor_0507',
            title: 'Weekly Coles Credit',
            tier_group: 'visitor',
            prize_label: '$25 Coles Digital Credit',
            draws_at: '2026-07-05T20:00:00+10:00',
            locked: false
        },
        {
            id: 'gw_red_1007',
            title: 'SLR Red Cash Boost',
            tier_group: 'red',
            prize_label: '$30,000 Cash',
            draws_at: '2026-07-10T20:00:00+10:00',
            locked: false
        },
        {
            id: 'gw_blue_1207',
            title: 'Premium Holiday Escape',
            tier_group: 'blue',
            prize_label: 'Bali Holiday + $5,000',
            draws_at: '2026-07-12T20:00:00+10:00',
            locked: true
        }
    ],
    notifications_count: 3
};

export async function getCurrentMember(): Promise<CurrentMember> {
    return MEMBER;
}

export async function getMemberDashboard(): Promise<MemberDashboard> {
    return DASHBOARD;
}
