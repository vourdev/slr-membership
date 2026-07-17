import type { Metadata } from 'next';
import Link from 'next/link';

import EmptyState from '@/components/common/empty-state';
import { handleApiAuthError } from '@/lib/api/guard';
import {
    type BillingInvoice,
    type BillingStatus,
    getBillingInvoices,
    getBillingStatus
} from '@/lib/api/resources/billing';
import { type MembershipRecord, getMyMembership } from '@/lib/api/resources/memberships';
import { getAccessToken } from '@/lib/api/server';
import { formatAud, formatShortDate } from '@/lib/member';
import { cn } from '@/lib/utils';

import { ManageBillingButton } from './_components/manage-billing-button';
import { UpgradeTierButtons } from './_components/upgrade-tier-buttons';
import { ArrowLeft, CreditCard, ReceiptText } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Account',
    robots: { index: false }
};

const INVOICE_TYPE: Record<string, string> = {
    initial: 'Initial',
    renewal: 'Renewal',
    manual_grace: 'Grace payment'
};

const BILLING_BADGE: Record<string, string> = {
    active: 'text-emerald-400',
    grace: 'text-amber-400',
    inactive: 'text-red-400'
};

// Stripe Billing Portal return (STRIPE_PORTAL_RETURN_URL) + members' billing hub.
export default async function AccountPage() {
    const token = await getAccessToken();

    let billing: BillingStatus | null = null;
    let invoices: BillingInvoice[] = [];
    let membership: MembershipRecord | null = null;

    if (token) {
        const [b, i, m] = await Promise.allSettled([
            getBillingStatus(token),
            getBillingInvoices(token),
            getMyMembership(token)
        ]);

        if (b.status === 'fulfilled') billing = b.value;
        else handleApiAuthError(b.reason);
        if (i.status === 'fulfilled') invoices = i.value;
        else handleApiAuthError(i.reason);
        if (m.status === 'fulfilled') membership = m.value;
        else handleApiAuthError(m.reason);
    }

    const tier = membership?.subTier;
    const tierLabel = tier ? `SLR ${tier.tier}${tier.marketingName ? ` · ${tier.marketingName}` : ''}` : '-';
    const status = billing?.billing_status ?? '-';
    // Checkout opens a NEW subscription — only offer it to Visitors. Paid members
    // change plans via the Billing Portal / scheduled upgrade instead.
    const canCheckout = tier?.tier === 'VISITOR';

    return (
        <main className='dark slr-member bg-slr-navy-deep min-h-svh'>
            <div className='mx-auto w-full max-w-4xl px-4 py-8 md:px-6 md:py-10'>
                <Link
                    href='/member'
                    className='text-slr-muted hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors'>
                    <ArrowLeft className='size-4' /> Dashboard
                </Link>

                <h1 className='font-bebas-neue mt-4 text-3xl tracking-wide text-white uppercase sm:text-4xl'>
                    My Account
                </h1>

                {!billing && !membership ? (
                    <EmptyState
                        icon={CreditCard}
                        title='Billing Unavailable'
                        description='We couldn’t load your billing right now. Please sign in and try again.'
                        className='mt-8'
                    />
                ) : (
                    <div className='mt-6 space-y-6'>
                        {/* Membership / billing summary */}
                        <section
                            className='shadow-card-warm rounded-2xl border border-[#D4AF3759] p-5 md:p-6'
                            style={{
                                background: 'linear-gradient(154.36deg, #140E00 0.82%, #1E1600 49.73%, #140E00 98.65%)'
                            }}>
                            <div className='flex flex-wrap items-start justify-between gap-4'>
                                <div>
                                    <p className='text-slr-gold-label text-xs font-semibold tracking-widest uppercase'>
                                        Membership
                                    </p>
                                    <h2 className='font-bebas-neue mt-1 text-2xl tracking-wide text-white uppercase md:text-3xl'>
                                        {tierLabel}
                                    </h2>
                                    <div className='text-slr-muted mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm'>
                                        <span>
                                            Status:{' '}
                                            <span className={cn('font-semibold capitalize', BILLING_BADGE[status])}>
                                                {status}
                                            </span>
                                        </span>
                                        {billing?.next_renewal_at && (
                                            <span>Next billing: {formatShortDate(billing.next_renewal_at)}</span>
                                        )}
                                    </div>
                                    {billing?.grace_period && (
                                        <p className='mt-2 text-sm text-amber-400'>
                                            Grace period ends {formatShortDate(billing.grace_period.expires_at)} —
                                            please update your payment.
                                        </p>
                                    )}
                                </div>
                                {canCheckout ? null : <ManageBillingButton />}
                            </div>

                            {canCheckout && (
                                <div className='mt-5 border-t border-white/10 pt-5'>
                                    <p className='text-slr-muted text-sm'>
                                        Upgrade to unlock member draws, partner discounts and e-books. You’ll be taken to
                                        Stripe’s secure checkout — no charge until you confirm.
                                    </p>
                                    <div className='mt-3'>
                                        <UpgradeTierButtons />
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Payment history */}
                        <section className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-5 md:p-6'>
                            <div className='mb-4 flex items-center gap-2'>
                                <ReceiptText className='text-slr-gold-label size-5' />
                                <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase'>
                                    Payment History
                                </h2>
                            </div>

                            {invoices.length === 0 ? (
                                <p className='text-slr-dim text-sm'>No payments yet.</p>
                            ) : (
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-sm'>
                                        <thead>
                                            <tr className='text-slr-dim border-b border-white/5 text-left text-xs uppercase'>
                                                <th className='py-2 pr-4 font-medium'>Date</th>
                                                <th className='py-2 pr-4 font-medium'>Type</th>
                                                <th className='py-2 pr-4 font-medium'>Amount</th>
                                                <th className='py-2 font-medium'>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-white/5'>
                                            {invoices.map((inv) => (
                                                <tr key={inv.invoice_id} className='text-white/90'>
                                                    <td className='py-2.5 pr-4'>
                                                        {inv.paid_at ? formatShortDate(inv.paid_at) : '-'}
                                                    </td>
                                                    <td className='py-2.5 pr-4'>
                                                        {INVOICE_TYPE[inv.type] ?? inv.type}
                                                    </td>
                                                    <td className='py-2.5 pr-4 tabular-nums'>
                                                        {formatAud(inv.amount_cents ?? 0)}
                                                    </td>
                                                    <td className='py-2.5'>
                                                        <span className='font-semibold text-emerald-400'>Paid</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}
