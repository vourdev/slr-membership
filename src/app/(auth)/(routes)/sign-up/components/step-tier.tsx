'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { goldButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';

import { BENY_PRICE, SignUpFormData, TierKey } from './types';
import { ArrowLeft, Check } from 'lucide-react';

type TierOption = {
    key: TierKey;
    name: string;
    price: string;
    note: string;
    tagline: string;
    perks: string[];
    cardClass: string;
    badge?: string;
};

const tiers: TierOption[] = [
    {
        key: 'visitor',
        name: 'Visitor',
        price: 'FREE',
        note: 'No card needed',
        tagline: 'Try SLR with the weekly Visitor draw.',
        perks: ['Weekly $50 Visitor draw', 'Browse partner discounts', 'Browse e-book listings'],
        cardClass: 'border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)]'
    },
    {
        key: 'red',
        name: 'SLR Red',
        price: '$10',
        note: '/ month',
        tagline: 'The everyday rewards plan.',
        perks: ['Up to 7 weekly draws', '4–7 entries per cycle', 'Unlock all discount codes', 'Read all e-books'],
        cardClass: 'border-[#C8152E66] bg-[linear-gradient(154.36deg,#1C0308_0.82%,#2A0810_49.73%,#1A0306_98.65%)]',
        badge: 'Most popular'
    },
    {
        key: 'blue',
        name: 'SLR Premium',
        price: '$26',
        note: '/ month',
        tagline: 'Maximum draws, member-only deals.',
        perks: ['Everything in Red', '10+ entries per cycle', 'Premium prize pool', 'Member-only deals'],
        cardClass: 'border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)]'
    }
];

type StepTierProps = {
    data: SignUpFormData;
    onNext: (patch: Partial<SignUpFormData>) => void;
    onBack: () => void;
};

const StepTier = ({ data, onNext, onBack }: StepTierProps) => {
    const [selected, setSelected] = useState<TierKey | null>(data.tier);
    const [beny, setBeny] = useState<boolean>(data.beny);
    const [touched, setTouched] = useState(false);

    const isPaid = selected === 'red' || selected === 'blue';
    const canContinue = selected !== null;

    const handleContinue = () => {
        if (!canContinue) {
            setTouched(true);

            return;
        }
        onNext({ tier: selected, beny: isPaid ? beny : false });
    };

    return (
        <div className='flex flex-col gap-6'>
            <div>
                <h2 className='font-bebas-neue text-3xl tracking-wider text-white uppercase md:text-4xl'>
                    Choose your tier
                </h2>
                <p className='text-slr-muted mt-1 text-sm'>You can change or cancel any time from your account.</p>
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                {tiers.map((tier) => {
                    const isSelected = selected === tier.key;

                    return (
                        <button
                            key={tier.key}
                            type='button'
                            onClick={() => setSelected(tier.key)}
                            className={cn(
                                'relative flex flex-col rounded-2xl border p-5 text-left transition-all',
                                tier.cardClass,
                                isSelected
                                    ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#131619]'
                                    : 'hover:border-white/30'
                            )}>
                            {tier.badge && (
                                <div
                                    className='absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[9px] font-bold tracking-widest uppercase'
                                    style={{
                                        color: '#0C1132',
                                        background:
                                            'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)'
                                    }}>
                                    {tier.badge}
                                </div>
                            )}
                            <div className='flex items-baseline justify-between'>
                                <p className='font-bebas-neue text-xl tracking-wider text-white uppercase'>
                                    {tier.name}
                                </p>
                                {isSelected && (
                                    <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-[#0C1132]'>
                                        <Check className='h-3.5 w-3.5' />
                                    </span>
                                )}
                            </div>
                            <div className='mt-2 flex items-baseline gap-1'>
                                <span className='font-bebas-neue text-3xl font-extrabold text-white'>{tier.price}</span>
                                <span className='text-xs text-white/60'>{tier.note}</span>
                            </div>
                            <p className='text-slr-muted mt-2 text-xs'>{tier.tagline}</p>
                            <ul className='mt-3 space-y-1.5'>
                                {tier.perks.map((p) => (
                                    <li key={p} className='flex items-start gap-1.5 text-xs text-white/80'>
                                        <Check className='mt-0.5 h-3 w-3 shrink-0 text-[#FFDC75]' />
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </button>
                    );
                })}
            </div>

            {touched && !canContinue && <p className='text-xs text-red-400'>Choose a tier to continue.</p>}

            {isPaid && (
                <label
                    className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
                        beny ? 'border-[#D4AF3759] bg-[#D4AF370D]' : 'border-white/10 bg-white/2 hover:border-white/20'
                    )}>
                    <input
                        type='checkbox'
                        checked={beny}
                        onChange={(e) => setBeny(e.target.checked)}
                        className='mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#D4AF37]'
                    />
                    <div className='flex-1'>
                        <div className='flex flex-wrap items-baseline gap-2'>
                            <span className='font-bebas-neue text-lg tracking-wider text-white uppercase'>
                                Add BENY
                            </span>
                            <span className='text-sm font-semibold text-[#FFDC75]'>+${BENY_PRICE}/month</span>
                        </div>
                        <p className='text-slr-muted mt-0.5 text-xs'>
                            Premium third-party discount platform. Optional. Requires phone for activation.
                        </p>
                    </div>
                </label>
            )}

            <div className='flex flex-wrap gap-3'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={onBack}
                    className='h-11 min-w-max flex-1 rounded-xl border border-white/10 bg-white/5 px-6 font-semibold text-white hover:bg-white/10 hover:text-white sm:flex-none'>
                    <ArrowLeft className='h-4 w-4' />
                    Back
                </Button>
                <Button
                    type='button'
                    onClick={handleContinue}
                    style={goldButtonStyle}
                    className='h-11 min-w-max flex-1 rounded-xl font-bold uppercase shadow-md transition-opacity hover:opacity-90'>
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default StepTier;
