import type { Metadata } from 'next';
import Link from 'next/link';

import EmptyState from '@/components/common/empty-state';
import GoldCtaButton from '@/components/common/gold-cta-button';

import { CreditCard } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Account',
    robots: { index: false }
};

// Stripe Billing Portal return (STRIPE_PORTAL_RETURN_URL). The member lands here
// after managing their subscription in the portal.
export default function AccountReturnPage() {
    return (
        <main className='dark bg-slr-ink flex min-h-svh flex-col items-center justify-center px-4 py-12'>
            <EmptyState
                icon={CreditCard}
                title='Billing Updated'
                description='You’re back from the billing portal — your subscription details are up to date.'
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
