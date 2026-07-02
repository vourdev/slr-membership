import EmptyState from '@/components/common/empty-state';
import { handleApiAuthError } from '@/lib/api/guard';
import { getAdminMembers } from '@/lib/api/resources/admin';
import { getAccessToken } from '@/lib/api/server';

import { type RegistrationRow, RegistrationsClient } from './registrations-client';
import { CircleAlert } from 'lucide-react';

export default async function RegistrationsPage() {
    const token = await getAccessToken();

    let rows: RegistrationRow[] = [];
    let failed = false;

    try {
        const members = token ? await getAdminMembers(token) : [];
        rows = members.map((m) => ({
            id: m.user_id,
            name: m.full_name,
            email: m.email,
            tier: m.tier,
            state: m.state,
            status: m.status,
            registered_at: m.created_at.slice(0, 10)
        }));
    } catch (error) {
        handleApiAuthError(error); // expired session → force logout
        failed = true;
    }

    if (failed || rows.length === 0) {
        return (
            <div className='p-4'>
                <EmptyState
                    icon={CircleAlert}
                    title={failed ? 'Could Not Load Members' : 'No Registrations Yet'}
                    description={
                        failed
                            ? 'The members list is unavailable right now. Please try again shortly.'
                            : 'No members have registered yet.'
                    }
                />
            </div>
        );
    }

    return <RegistrationsClient data={rows} />;
}
