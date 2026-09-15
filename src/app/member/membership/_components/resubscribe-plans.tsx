'use client';

import { useState, useTransition } from 'react';

import Image from 'next/image';

import { SafeHoursNotice } from '@/components/common/safe-hours-notice';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SUB_TIERS } from '@/constant/tiers';
import { useSafeHours } from '@/hooks/use-safe-hours';
import { formatAud, formatTierName } from '@/lib/member';
import { goldButtonStyle } from '@/lib/styles';
import { type TierPricing } from '@/lib/tier-pricing';
import { cn } from '@/lib/utils';
import type { SubTierCode } from '@/types/member';

import { startSubTierCheckout } from '../actions';
import { ArrowRight, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

const PAID_CODES: SubTierCode[] = ['R1', 'R4', 'R7', 'B1', 'B4', 'B7', 'B10'];

/** Plan picker for a member whose subscription was cancelled and who is now on Visitor. */
export function ResubscribePlans({ pricing }: { pricing: TierPricing }) {
    const [selected, setSelected] = useState<SubTierCode | null>(null);
    const [pending, startTransition] = useTransition();
    const safeHoursLocked = useSafeHours();

    const checkout = () => {
        if (!selected) return;
        startTransition(async () => {
            const res = await startSubTierCheckout(selected);
            if (res.ok) {
                window.open(res.url, '_blank', 'noopener,noreferrer');
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <section className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <p className='text-slr-gold-label text-xs font-semibold tracking-widest uppercase'>Membership ended</p>
            <h2 className='font-bebas-neue mt-1 text-2xl tracking-wide text-white uppercase md:text-3xl'>
                Choose a plan to resubscribe
            </h2>
            <p className='text-slr-muted mt-1 text-sm'>
                Your subscription was cancelled and your account is on Visitor. Pick a plan to get prize draws, partner
                discounts and e-books back — a new 28-day cycle starts once payment goes through.
            </p>

            {safeHoursLocked ? (
                <div className='mt-4'>
                    <SafeHoursNotice />
                </div>
            ) : null}

            <RadioGroup
                value={selected ?? undefined}
                onValueChange={(v) => setSelected(v as SubTierCode)}
                className='mt-4 grid gap-2 sm:grid-cols-2'>
                {PAID_CODES.map((code) => {
                    const id = `resubscribe-${code.toLowerCase()}`;
                    const { badgeIcon } = SUB_TIERS[code];
                    const { priceCents, tokens } = pricing[code];

                    return (
                        <label
                            key={code}
                            htmlFor={id}
                            className={cn(
                                'flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition-colors',
                                selected === code
                                    ? 'border-slr-gold-edge bg-slr-gold-wash'
                                    : 'border-white/10 bg-white/3 hover:bg-white/5'
                            )}>
                            <span className='flex items-center gap-3'>
                                <RadioGroupItem id={id} value={code} />
                                {badgeIcon && (
                                    <Image
                                        src={badgeIcon}
                                        alt=''
                                        width={56}
                                        height={56}
                                        className='size-7 shrink-0 object-contain'
                                    />
                                )}
                                <span className='text-sm text-white/90'>{formatTierName(code)}</span>
                            </span>
                            <span className='shrink-0 text-sm'>
                                <span className='font-semibold text-white'>{formatAud(priceCents)}</span>
                                <span className='text-slr-dim'>
                                    {' '}
                                    / 28 days · {tokens} {tokens === 1 ? 'entry' : 'entries'}
                                </span>
                            </span>
                        </label>
                    );
                })}
            </RadioGroup>

            <Button
                className='mt-4 h-11 rounded-xl font-bold uppercase'
                style={goldButtonStyle}
                disabled={!selected || pending || safeHoursLocked}
                onClick={checkout}>
                {pending ? <Loader2Icon className='size-4 animate-spin' /> : null}
                Continue to checkout
                {!pending && <ArrowRight className='size-4' />}
            </Button>
        </section>
    );
}
