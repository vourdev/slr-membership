import type { ReactNode } from 'react';

import { auth } from '@/auth';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { getMemberDashboard } from '@/data/member-dashboard';

import { MemberHeader } from './_components/member-header';
import { MemberSidebar } from './_components/member-sidebar';

export default async function MemberLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    const user = session?.user ?? null;

    // Membership attributes (tier, state) aren't on the session yet — pull them
    // from the mock API. Swap getMemberDashboard for the Axios client later.
    const { member, notifications_count } = await getMemberDashboard();

    return (
        <div className='slr-member dark bg-background text-foreground min-h-screen'>
            <AppShell variant='sidebar'>
                <MemberSidebar user={user} member={member} />
                <AppContent variant='sidebar' className='flex min-h-svh flex-col overflow-x-hidden'>
                    <MemberHeader user={user} member={member} notificationsCount={notifications_count} />
                    {children}
                </AppContent>
            </AppShell>
        </div>
    );
}
