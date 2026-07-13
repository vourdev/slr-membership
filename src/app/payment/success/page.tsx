import type { Metadata } from 'next';

import { ActivationStatus } from './_components/activation-status';

export const metadata: Metadata = {
    title: 'Payment Successful',
    robots: { index: false }
};

// Stripe Checkout success return (STRIPE_SUCCESS_URL). Public — the member may
// not have an app session yet at this point in the flow.
export default function PaymentSuccessPage() {
    return (
        <main className='dark bg-slr-ink flex min-h-svh flex-col items-center justify-center px-4 py-12'>
            <ActivationStatus />
        </main>
    );
}
