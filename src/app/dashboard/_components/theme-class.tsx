'use client';

import { useEffect } from 'react';

/**
 * Applies the dashboard theme to <html> while the dashboard is mounted, so that
 * portaled UI (dialogs, dropdowns, the mobile sidebar sheet, tooltips) — which
 * renders on document.body, outside the layout wrapper — inherits the theme
 * instead of falling back to the light `:root` tokens. Removed on unmount so the
 * member/public areas keep their own themes.
 */
export function DashboardThemeClass() {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('dashboard-theme', 'dark');

        return () => root.classList.remove('dashboard-theme', 'dark');
    }, []);

    return null;
}
