import type { Metadata } from 'next';
import Link from 'next/link';

import EmptyState from '@/components/common/empty-state';
import GoldCtaButton from '@/components/common/gold-cta-button';

import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Payment Successful',
    robots: { index: false }
};

// Stripe Checkout success return (STRIPE_SUCCESS_URL). Public — the member may
// not have an app session yet at this point in the flow.
export default function PaymentSuccessPage() {
    return (
        <main className='dark bg-slr-ink flex min-h-svh flex-col items-center justify-center px-4 py-12'>
            <EmptyState
                icon={CheckCircle2}
                title='Payment Successful'
                description='Your SLR membership is now active — your tokens and draw entries are allocated for this cycle.'
                action={
                    <div className='flex flex-col items-center gap-3'>
                        <GoldCtaButton href='/member' className='w-full max-w-xs'>
                            Go to Dashboard
                        </GoldCtaButton>
                        <Link href='/member/profile' className='text-slr-dim text-sm transition-colors hover:text-white'>
                            View membership
                        </Link>
                    </div>
                }
            />
        </main>
    );
}
