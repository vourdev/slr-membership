// AppShell.tsx
'use client';

import * as React from 'react';

import { SidebarProvider } from '@/components/ui/sidebar';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
    /**
     * Untuk Next.js, kita bisa kirim default open dari props,
     * misal nanti baca dari cookie / setting user, dll.
     */
    sidebarDefaultOpen?: boolean;
}

export function AppShell({ children, variant = 'header', sidebarDefaultOpen = true }: AppShellProps) {
    if (variant === 'header') {
        return <div className='flex min-h-screen w-full flex-col'>{children}</div>;
    }

    // Mode sidebar
    return <SidebarProvider defaultOpen={sidebarDefaultOpen}>{children}</SidebarProvider>;
}
