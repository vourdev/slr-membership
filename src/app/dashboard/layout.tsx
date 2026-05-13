import { ReactNode } from 'react';

import AppSidebarLayout from './app/app-sidebar-layout';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: any[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        <Toaster />
        {children}
    </AppSidebarLayout>
);
