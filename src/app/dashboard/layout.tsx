import { ReactNode } from 'react';

import AppSidebarLayout from './app/app-sidebar-layout';
import { Toaster } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: any[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <div className='slr-admin dark bg-background text-foreground min-h-screen'>
        <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
            <Toaster />
            {children}
        </AppSidebarLayout>
    </div>
);
