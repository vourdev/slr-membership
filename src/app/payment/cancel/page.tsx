import type { Metadata } from 'next';
import Link from 'next/link';

import EmptyState from '@/components/common/empty-state';
import GoldCtaButton from '@/components/common/gold-cta-button';

import { XCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Payment Cancelled',
    robots: { index: false }
};

// Stripe Checkout cancel return (STRIPE_CANCEL_URL). Public.
export default function PaymentCancelPage() {
    return (
        <main className='dark bg-slr-ink flex min-h-svh flex-col items-center justify-center px-4 py-12'>
            <EmptyState
                icon={XCircle}
                title='Payment Cancelled'
                description='No charge was made. You can choose a plan and try again whenever you’re ready.'
                action={
                    <div className='flex flex-col items-center gap-3'>
                        <GoldCtaButton href='/membership' className='w-full max-w-xs'>
                            Back to Membership
                        </GoldCtaButton>
                        <Link href='/' className='text-slr-dim text-sm transition-colors hover:text-white'>
                            Return home
                        </Link>
                    </div>
                }
            />
        </main>
    );
}
