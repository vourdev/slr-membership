import DashboardEmptyState from '@/app/dashboard/_components/dashboard-empty-state';
import Heading from '@/components/ui/heading';
import { handleApiAuthError } from '@/lib/api/guard';
import { getAdminMembers } from '@/lib/api/resources/admin';
import { type SubTierCount, getMembershipStats } from '@/lib/api/resources/memberships';
import { getAccessToken } from '@/lib/api/server';

import { SubTierStats } from './_components/sub-tier-stats';
import { type MemberRow, MembersClient } from './members-client';
import { CircleAlert } from 'lucide-react';

export default async function MembersPage() {
    const token = await getAccessToken();

    // Independent fetches — parallel, and settle independently so a broken
    // members list (currently 400s) cannot blank the stats card.
    const [statsResult, membersResult] = await Promise.allSettled([
        token ? getMembershipStats(token) : Promise.resolve<SubTierCount[]>([]),
        token ? getAdminMembers(token) : Promise.resolve([])
    ]);

    if (statsResult.status === 'rejected') handleApiAuthError(statsResult.reason);
    if (membersResult.status === 'rejected') handleApiAuthError(membersResult.reason);

    const statsOk = statsResult.status === 'fulfilled';
    const listOk = membersResult.status === 'fulfilled';

    const counts: SubTierCount[] = statsOk ? statsResult.value : [];
    const total = counts.reduce((sum, c) => sum + c.count, 0);

    const rows: MemberRow[] = listOk
        ? membersResult.value.map((m) => ({
              id: m.user_id,
              name: m.full_name || '-',
              email: m.email || '-',
              tier: m.tier || '-',
              state: m.state || '-',
              status: m.status || '-',
              registered_at: m.created_at ? m.created_at.slice(0, 10) : '-'
          }))
        : [];

    if (!statsOk && !listOk) {
        return (
            <div className='p-4'>
                <DashboardEmptyState
                    icon={CircleAlert}
                    title='Could not load members'
                    description='The members area is unavailable right now. Please try again shortly.'
                />
            </div>
        );
    }

    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6'>
            <Heading title='Members' description='Registered members' />

            {statsOk ? <SubTierStats counts={counts} total={total} /> : null}

            {listOk ? (
                <MembersClient data={rows} />
            ) : (
                <DashboardEmptyState
                    icon={CircleAlert}
                    title='Member list unavailable'
                    description='Sub-tier totals are shown above. The full member list is temporarily unavailable.'
                />
            )}
        </div>
    );
}
