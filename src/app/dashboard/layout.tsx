import { ReactNode } from 'react';

import AppSidebarLayout from './app/app-sidebar-layout';
import { DashboardThemeClass } from './_components/theme-class';
import { Toaster } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: any[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <div className='dashboard-theme dark bg-background text-foreground min-h-screen'>
        <DashboardThemeClass />
        <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
            <Toaster />
            {children}
        </AppSidebarLayout>
    </div>
);
