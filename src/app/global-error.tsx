'use client';

import { useEffect } from 'react';

// Safety net for deployment skew (Vercel free + Docker, no paid Skew Protection):
// after a redeploy, a still-open client can request JS chunks / RSC payloads from a
// build that no longer exists → ChunkLoadError / "Failed to fetch". A full reload
// pulls HTML matching the live deployment. Time-based guard prevents a reload loop
// while still allowing recovery from a genuinely new error later in the session.
const RELOAD_KEY = 'slr_skew_reloaded_at';
const RELOAD_COOLDOWN_MS = 10_000;

const isSkewError = (error: Error): boolean =>
    /ChunkLoadError|Loading chunk|Failed to fetch|dynamically imported module|RSC payload/i.test(
        `${error?.name ?? ''} ${error?.message ?? ''}`
    );

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        if (typeof window === 'undefined' || !isSkewError(error)) return;

        const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
        if (Date.now() - last > RELOAD_COOLDOWN_MS) {
            sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
            window.location.reload();
        }
    }, [error]);

    return (
        <html lang='en'>
            <body
                style={{
                    margin: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#131619',
                    color: '#fff',
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif'
                }}>
                <div style={{ maxWidth: 420, padding: 24, textAlign: 'center' }}>
                    <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Something went wrong</h1>
                    <p style={{ fontSize: 14, color: '#ADB0B5', margin: '0 0 20px' }}>
                        Reloading the latest version…
                    </p>
                    <button
                        type='button'
                        onClick={() => reset()}
                        style={{
                            height: 44,
                            padding: '0 24px',
                            borderRadius: 12,
                            border: 'none',
                            background: 'linear-gradient(89deg,#F5D78E,#D4AF37 41%,#FFE066 60%,#A07018)',
                            color: '#1a1408',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}>
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
