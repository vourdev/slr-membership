'use client';

import { useEffect, useRef } from 'react';

import { usePathname } from 'next/navigation';

// Proactive deployment-skew guard. The build id is baked into this client bundle at
// build time; /api/version returns the LIVE deployment's id. When they diverge a new
// build is out — we refresh at a calm moment (tab hidden, or the next navigation) so
// the user never hits a stale-chunk / stale-action crash. Complements global-error
// (the last-resort catch) and client-side login (removes the login-gate trigger).
const CURRENT = process.env.NEXT_PUBLIC_BUILD_ID;
const POLL_MS = 60_000;

export function VersionWatcher() {
    const stale = useRef(false);
    const pathname = usePathname();

    // A new build was detected earlier → reload on this navigation (a hard load that
    // lands entirely on the new deployment). Skip the very first mount.
    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;

            return;
        }
        if (stale.current) window.location.reload();
    }, [pathname]);

    useEffect(() => {
        if (!CURRENT) return;

        const check = async () => {
            try {
                const res = await fetch('/api/version', { cache: 'no-store' });
                if (!res.ok) return;

                const { id } = (await res.json()) as { id?: string };
                if (!id || id === CURRENT) return;

                stale.current = true;
                // If the tab is backgrounded, reload now — the user won't see it.
                // Otherwise wait for the next navigation (handled above).
                if (document.visibilityState === 'hidden') window.location.reload();
            } catch {
                // Network blip — ignore, try again next tick.
            }
        };

        const onVisible = () => {
            if (document.visibilityState === 'visible') check();
        };

        const timer = setInterval(check, POLL_MS);
        document.addEventListener('visibilitychange', onVisible);
        check();

        return () => {
            clearInterval(timer);
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, []);

    return null;
}
