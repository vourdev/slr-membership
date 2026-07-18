'use client';

import { useState, useTransition } from 'react';

import type { CheckoutTier } from '@/lib/api/resources/stripe';

import { startTierCheckout } from '../actions';
import { ArrowRight, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

const TIERS: { tier: CheckoutTier; label: string; className: string }[] = [
    {
        tier: 'RED',
        label: 'Upgrade to SLR Red',
        className: 'border-[#C8152E66] bg-[linear-gradient(154.36deg,#1C0308_0.82%,#2A0810_49.73%,#1A0306_98.65%)]'
    },
    {
        tier: 'BLUE',
        label: 'Upgrade to SLR Premium',
        className: 'border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)]'
    }
];

export function UpgradeTierButtons() {
    const [pending, startTransition] = useTransition();
    const [active, setActive] = useState<CheckoutTier | null>(null);

    const checkout = (tier: CheckoutTier) => {
        setActive(tier);
        startTransition(async () => {
            const res = await startTierCheckout(tier);
            if (res.ok) {
                window.location.href = res.url; // hosted Stripe Checkout
            } else {
                toast.error(res.message);
                setActive(null);
            }
        });
    };

    return (
        <div className='flex flex-col gap-3 sm:flex-row'>
            {TIERS.map(({ tier, label, className }) => (
                <button
                    key={tier}
                    type='button'
                    onClick={() => checkout(tier)}
                    disabled={pending}
                    className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-bold text-white uppercase transition-opacity hover:opacity-90 disabled:opacity-60 ${className}`}>
                    {pending && active === tier ? <Loader2Icon className='size-4 animate-spin' /> : null}
                    {label}
                    {!pending && <ArrowRight className='size-4' />}
                </button>
            ))}
        </div>
    );
}
