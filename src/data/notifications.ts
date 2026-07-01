import type { MemberNotification } from '@/types/member';

// ─────────────────────────────────────────────────────────────────────────────
// Mock member notifications (newest first). read_at = null → unread. Timestamps
// are generated relative to "now" so the relative labels always look sensible.
// Swap getNotifications for the Axios client / notifications table later.
// ─────────────────────────────────────────────────────────────────────────────

export async function getNotifications(): Promise<MemberNotification[]> {
    const now = Date.now();
    const ago = (hours: number) => new Date(now - hours * 3_600_000).toISOString();

    return [
        {
            id: 'n1',
            type: 'draw_win',
            title: 'You won $2,500!',
            body: 'Congratulations — you won the SLR Red · NSW draw. Your payout is on its way.',
            created_at: ago(2),
            read_at: null,
            href: '/member/giveaways'
        },
        {
            id: 'n2',
            type: 'renewal',
            title: 'Renewal in 24 hours',
            body: 'Your cycle renews tomorrow. Spin the wheel now for a chance at a discount.',
            created_at: ago(20),
            read_at: null,
            href: '/member'
        },
        {
            id: 'n3',
            type: 'referral',
            title: 'Referral bonus earned',
            body: '10 friends joined with your code — you earned +3 bonus tokens for next cycle.',
            created_at: ago(28),
            read_at: null,
            href: '/member/referral'
        },
        {
            id: 'n4',
            type: 'draw_result',
            title: 'New RED draw is live',
            body: 'The $30,000 SLR Red Cash Boost is now open. Your entries are in.',
            created_at: ago(50),
            read_at: ago(48),
            href: '/member/giveaways'
        },
        {
            id: 'n5',
            type: 'spin',
            title: 'You won $5 off',
            body: 'Your spin discount was applied to your latest invoice.',
            created_at: ago(96),
            read_at: ago(96),
            href: '/member/profile'
        },
        {
            id: 'n6',
            type: 'tier_change',
            title: 'Upgrade scheduled',
            body: 'Your switch to SLR Blue · Plus takes effect at your next renewal.',
            created_at: ago(120),
            read_at: ago(119),
            href: '/member/profile'
        },
        {
            id: 'n7',
            type: 'beny',
            title: 'BENY is active',
            body: 'Your BENY access is ready — download the BENY app to start saving.',
            created_at: ago(144),
            read_at: ago(143),
            href: '/member/discounts'
        },
        {
            id: 'n8',
            type: 'system',
            title: 'Welcome to SLR',
            body: 'Your membership is active. Explore your dashboard and this cycle’s draws.',
            created_at: ago(168),
            read_at: ago(167),
            href: '/member'
        }
    ];
}
