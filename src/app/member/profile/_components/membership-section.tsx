'use client';

import { useState } from 'react';

import { SUB_TIERS, TIER_VISUALS } from '@/constant/tiers';
import { formatAud, formatShortDate } from '@/lib/member';
import { goldButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';
import type { BillingStatus, Invoice, PendingUpgrade, SubTierCode } from '@/types/member';

import { CalendarClock, CreditCard, Download, Info, X } from 'lucide-react';

const BILLING_TEXT: Record<BillingStatus, string> = {
    active: 'text-emerald-400',
    past_due: 'text-amber-400',
    canceled: 'text-red-400'
};

const INVOICE_TEXT: Record<Invoice['status'], string> = {
    paid: 'text-emerald-400',
    failed: 'text-red-400',
    refunded: 'text-slr-dim'
};

interface MembershipSectionProps {
    subTier: SubTierCode;
    priceCents: number;
    billingStatus: BillingStatus;
    nextPaymentDate: string;
    pendingUpgrade: PendingUpgrade | null;
    invoices: Invoice[];
}

function tierName(code: SubTierCode): string {
    const meta = SUB_TIERS[code];

    return meta.group === 'visitor' ? 'Visitor' : `SLR ${TIER_VISUALS[meta.group].label} · ${meta.label}`;
}

export function MembershipSection({
    subTier,
    priceCents,
    billingStatus,
    nextPaymentDate,
    pendingUpgrade,
    invoices
}: MembershipSectionProps) {
    const [pending, setPending] = useState<PendingUpgrade | null>(pendingUpgrade);
    const [planNote, setPlanNote] = useState(false);

    return (
        <section className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>
                Membership &amp; Billing
            </h2>

            {/* Current plan */}
            <div className='mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-white/5 pt-4'>
                <div>
                    <p className='text-slr-dim text-xs tracking-widest uppercase'>Current plan</p>
                    <p className='mt-0.5 text-lg font-semibold text-white'>{tierName(subTier)}</p>
                    <p className='text-slr-muted mt-1 text-sm'>
                        <span className='text-gradient-gold font-semibold'>{formatAud(priceCents)}</span> / 28-day cycle
                        · <span className={BILLING_TEXT[billingStatus]}>{billingStatus.replace('_', ' ')}</span>
                    </p>
                    <p className='text-slr-dim mt-1 inline-flex items-center gap-1.5 text-xs'>
                        <CalendarClock className='size-3.5' /> Next renewal {formatShortDate(nextPaymentDate)}
                    </p>
                </div>
                <button
                    type='button'
                    onClick={() => setPlanNote(true)}
                    className='inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold uppercase'
                    style={goldButtonStyle}>
                    <CreditCard className='size-4' /> Change plan
                </button>
            </div>

            {planNote && (
                <p className='text-slr-dim mt-3 inline-flex items-start gap-2 text-xs leading-relaxed'>
                    <Info className='mt-0.5 size-3.5 shrink-0' />
                    Plan changes open the secure Stripe checkout. Paid→paid changes apply at your next renewal; the
                    upgrade is scheduled and cancelable until then.
                </p>
            )}

            {/* Scheduled (pending) upgrade */}
            {pending && (
                <div className='mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2878E84D] bg-[#0E1828] p-4'>
                    <p className='text-sm text-white/90'>
                        <span className='font-semibold'>Scheduled change:</span> switching to{' '}
                        <span className='font-semibold'>{tierName(pending.to_sub_tier)}</span> at your next renewal on{' '}
                        {formatShortDate(pending.effective_date)}.
                    </p>
                    <button
                        type='button'
                        onClick={() => setPending(null)}
                        className='inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white'>
                        <X className='size-3.5' /> Cancel change
                    </button>
                </div>
            )}

            {/* Billing history */}
            <div className='mt-6'>
                <p className='text-slr-dim mb-2 text-xs tracking-widest uppercase'>Billing history</p>
                <ul className='divide-y divide-white/5'>
                    {invoices.map((inv) => (
                        <li key={inv.id} className='flex items-center justify-between gap-3 py-2.5'>
                            <div className='min-w-0'>
                                <p className='truncate text-sm text-white/90'>{inv.description}</p>
                                <p className='text-slr-dim text-xs'>{formatShortDate(inv.date)}</p>
                            </div>
                            <div className='flex shrink-0 items-center gap-3'>
                                <span className='text-sm font-semibold text-white tabular-nums'>
                                    {formatAud(inv.amount_cents)}
                                </span>
                                <span className={cn('text-sm font-medium capitalize', INVOICE_TEXT[inv.status])}>
                                    {inv.status}
                                </span>
                                <button
                                    type='button'
                                    aria-label={`Download invoice ${formatShortDate(inv.date)}`}
                                    className='text-slr-dim -m-1.5 rounded-lg p-1.5 transition-colors hover:bg-white/5 hover:text-white'>
                                    <Download className='size-5' />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
