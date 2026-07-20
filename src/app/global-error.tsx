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

// SMIL spinner — self-contained so it animates without globals.css (global-error
// replaces the root layout, so no Tailwind/keyframes are available here).
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
    const skew = isSkewError(error);

    useEffect(() => {
        if (typeof window === 'undefined' || !skew) return;

        const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
        if (Date.now() - last > RELOAD_COOLDOWN_MS) {
            sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
            window.location.reload();
        }
    }, [skew]);

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
                {skew ? (
                    // Deployment skew after a production update → not a crash. Show an
                    // "updating" affordance while the auto-reload (above) swaps builds.
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
