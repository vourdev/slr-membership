'use client';

import { useEffect, useState } from 'react';

// Deployment-skew recovery (Vercel free + Docker, no paid Skew Protection). After a
// production update a still-open client can crash on the first interaction: stale JS
// chunks, an RSC payload from a build that no longer exists, or — most commonly on
// login — a **server-action id mismatch** ("Failed to find Server Action … from an
// older or newer deployment"). We do NOT try to classify the error: in production
// React strips the message to a bare `digest`, so any root error gets ONE reload
// attempt. A fresh load pulls assets matching the live deployment and self-heals.
// The cooldown guard stops a loop — if the same error survives the reload (recurs
// within the window) we stop reloading and show the error UI instead.
const RELOAD_KEY = 'slr_error_reloaded_at';
const RELOAD_COOLDOWN_MS = 15_000;

function Spinner() {
    return (
        <svg width='40' height='40' viewBox='0 0 40 40' fill='none' aria-hidden='true'>
            <circle cx='20' cy='20' r='16' stroke='#FFFFFF22' strokeWidth='4' />
            <path d='M20 4a16 16 0 0 1 16 16' stroke='#E2B42B' strokeWidth='4' strokeLinecap='round'>
                <animateTransform
                    attributeName='transform'
                    type='rotate'
                    from='0 20 20'
                    to='360 20 20'
                    dur='0.8s'
                    repeatCount='indefinite'
                />
            </path>
        </svg>
    );
}

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    // Decide once on mount whether this is the first hit (→ reload) or a repeat
    // within the cooldown (→ give up and show the error).
    const [reloading] = useState(() => {
        if (typeof window === 'undefined') return false;
        const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);

        return Date.now() - last > RELOAD_COOLDOWN_MS;
    });

    useEffect(() => {
        // Keep the real error in the console — production strips it from the UI.
        console.error(error);
        if (!reloading) return;

        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
        window.location.reload();
    }, [reloading, error]);

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
                {reloading ? (
                    // First hit → auto-reloading. Read as "updating", not a crash.
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 20,
                            padding: 24,
                            textAlign: 'center'
                        }}>
                        <img
                            src='/images/slr-rewards-logo.webp'
                            alt='SLR Rewards'
                            width={160}
                            style={{ height: 32, width: 'auto', opacity: 0.9 }}
                        />
                        <Spinner />
                        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Updating to the latest version…</h1>
                        <p style={{ fontSize: 13, color: '#ADB0B5', margin: 0 }}>This only takes a moment.</p>
                    </div>
                ) : (
                    // Reload did not clear it → a real error. Show it once.
                    <div style={{ maxWidth: 420, padding: 24, textAlign: 'center' }}>
                        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Something went wrong</h1>
                        <p style={{ fontSize: 14, color: '#ADB0B5', margin: '0 0 20px' }}>
                            An unexpected error occurred. Please try again.
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
                )}
            </body>
        </html>
    );
}
