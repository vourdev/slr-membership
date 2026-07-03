import { type PropsWithChildren } from 'react';

import { auth } from '@/auth';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { AppSidebar } from '@/components/ui/app-sidebar';

interface AppSidebarLayoutProps extends PropsWithChildren {
    breadcrumbs?: any[];
}

export default async function AppSidebarLayout({ children, breadcrumbs = [] }: AppSidebarLayoutProps) {
    const session = await auth();
    const user = session?.user;

    return (
        <AppShell variant='sidebar'>
            <AppSidebar user={user} />
            <AppContent variant='sidebar' className='overflow-x-hidden'>
                <AppSidebarHeader breadcrumbs={breadcrumbs} user={user} />
                {children}
            </AppContent>
        </AppShell>
    );
}
