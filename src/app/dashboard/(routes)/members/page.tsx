import DashboardEmptyState from '@/app/dashboard/_components/dashboard-empty-state';
import { handleApiAuthError } from '@/lib/api/guard';
import { getAdminMembers } from '@/lib/api/resources/admin';
import { getAccessToken } from '@/lib/api/server';

import { type MemberRow, MembersClient } from './members-client';
import { CircleAlert } from 'lucide-react';

export default async function MembersPage() {
    const token = await getAccessToken();

    let rows: MemberRow[] = [];
    let failed = false;

    try {
        const members = token ? await getAdminMembers(token) : [];
        rows = members.map((m) => ({
            id: m.user_id,
            name: m.full_name || '-',
            email: m.email || '-',
            tier: m.tier || '-',
            state: m.state || '-',
            status: m.status || '-',
            registered_at: m.created_at ? m.created_at.slice(0, 10) : '-'
        }));
    } catch (error) {
        handleApiAuthError(error); // expired session → force logout
        failed = true;
    }

    if (failed || rows.length === 0) {
        return (
            <div className='p-4'>
                <DashboardEmptyState
                    icon={CircleAlert}
                    title={failed ? 'Could not load members' : 'No members yet'}
                    description={
                        failed
                            ? 'The members list is unavailable right now. Please try again shortly.'
                            : 'Registered members will appear here.'
                    }
                />
            </div>
        );
    }

    return <MembersClient data={rows} />;
}
