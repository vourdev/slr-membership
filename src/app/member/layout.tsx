import type { ReactNode } from 'react';

import { auth } from '@/auth';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { getMemberDashboard } from '@/data/member-dashboard';
import { getNotifications } from '@/data/notifications';

import { MemberHeader } from './_components/member-header';
import { MemberSidebar } from './_components/member-sidebar';

export default async function MemberLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    const user = session?.user ?? null;

    // Membership attributes (tier, state) aren't on the session yet — pull them
    // from the mock API. Swap these for the Axios client later.
    const [{ member }, notifications] = await Promise.all([getMemberDashboard(), getNotifications()]);

    return (
        <div className='slr-member dark bg-background text-foreground min-h-screen'>
            <AppShell variant='sidebar'>
                <MemberSidebar user={user} member={member} />
                <AppContent variant='sidebar' className='flex min-h-svh flex-col'>
                    <MemberHeader user={user} member={member} notifications={notifications} />
                    {children}
                </AppContent>
            </AppShell>
        </div>
    );
}
