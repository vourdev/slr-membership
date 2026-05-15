'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AU_STATES } from '@/constant/au-states';

import { ArrowLeft, CreditCard, Loader2Icon, ShieldCheck } from 'lucide-react';
import { BENY_PRICE, SignUpFormData, SpinPrize, TIER_LABEL, TIER_PRICE } from './types';

const goldButtonStyle: React.CSSProperties = {
    color: '#0C1132',
    background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
    borderTop: '2px solid #FFDC75'
};

type StepCheckoutProps = {
    data: SignUpFormData;
    spinPrize: SpinPrize | null;
    onNext: () => void;
    onBack: () => void;
};

const StepCheckout = ({ data, spinPrize, onNext, onBack }: StepCheckoutProps) => {
    const [redirecting, setRedirecting] = useState(false);

    const tier = data.tier;
    if (!tier || tier === 'visitor') {
        return null;
    }

    const tierPrice = TIER_PRICE[tier];
    const benyPrice = data.beny ? BENY_PRICE : 0;
    const subtotal = tierPrice + benyPrice;
    const discountPercent = spinPrize?.discountPercent ?? 0;
    const discount = (subtotal * discountPercent) / 100;
    const total = subtotal - discount;

    const stateLabel = AU_STATES.find((s) => s.code === data.state)?.label ?? data.state;

    const handleCheckout = async () => {
        setRedirecting(true);
        await new Promise((r) => setTimeout(r, 1400));
        onNext();
    };

    return (
        <div className='flex flex-col gap-6'>
            <div>
                <h2 className='font-bebas-neue text-3xl tracking-wider text-white uppercase md:text-4xl'>
                    Review your order
                </h2>
                <p className='mt-1 text-sm text-[#CDCECF]'>
                    You&apos;ll be redirected to Stripe to enter your card details. No charge until you confirm there.
                </p>
            </div>

            <div className='rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26] md:p-8'>
                <div className='space-y-4'>
                    <SummaryRow label={TIER_LABEL[tier]} sub='Monthly subscription' value={`$${tierPrice.toFixed(2)}`} />
                    {data.beny && (
                        <SummaryRow
                            label='BENY add-on'
                            sub='Premium discount platform'
                            value={`$${BENY_PRICE.toFixed(2)}`}
                        />
                    )}

                    <div className='h-px w-full bg-white/10' />

                    <SummaryRow label='Subtotal' value={`$${subtotal.toFixed(2)}`} muted />
                    {discountPercent > 0 && (
                        <SummaryRow
                            label='Spin Wheel discount'
                            sub={`${spinPrize?.label}, first month only`}
                            value={`−$${discount.toFixed(2)}`}
                            highlight
                        />
                    )}

                    <div className='h-px w-full bg-white/10' />

                    <div className='flex items-baseline justify-between'>
                        <div>
                            <p className='font-bebas-neue text-xl tracking-wider text-white uppercase'>
                                Due today
                            </p>
                            <p className='text-xs text-[#CDCECF]'>
                                Then ${subtotal.toFixed(2)}/month from your next billing date.
                            </p>
                        </div>
                        <p className='font-bebas-neue text-3xl font-extrabold text-[#FFDC75]'>
                            ${total.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <div className='rounded-xl border border-white/10 bg-white/2 p-4'>
                <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase'>
                    Draw pool assignment
                </p>
                <p className='mt-1 text-sm text-white'>
                    SLR {tier === 'red' ? 'Red' : 'Blue'} {data.state} — {stateLabel}
                </p>
                <p className='mt-1 text-xs text-[#CDCECF]'>
                    Your entries will be allocated to this pool after your first successful payment.
                </p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={onBack}
                    disabled={redirecting}
                    className='h-11 rounded-xl border border-white/10 bg-white/5 px-6 font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto'>
                    <ArrowLeft className='h-4 w-4' />
                    Back
                </Button>
                <Button
                    type='button'
                    onClick={handleCheckout}
                    disabled={redirecting}
                    style={goldButtonStyle}
                    className='h-11 flex-1 rounded-xl font-bold uppercase shadow-md transition-opacity hover:opacity-90 disabled:opacity-70'>
                    {redirecting ? (
                        <>
                            <Loader2Icon className='animate-spin' /> Redirecting to Stripe…
                        </>
                    ) : (
                        <>
                            <CreditCard className='h-4 w-4' />
                            Continue to Stripe
                        </>
                    )}
                </Button>
            </div>

            <p className='flex items-center justify-center gap-1.5 text-center text-xs text-[#8EA0B8]'>
                <ShieldCheck className='h-3.5 w-3.5' />
                Payment processed securely by Stripe. We never store your card details.
            </p>
        </div>
    );
};

type SummaryRowProps = {
    label: string;
    sub?: string;
    value: string;
    muted?: boolean;
    highlight?: boolean;
};

const SummaryRow = ({ label, sub, value, muted, highlight }: SummaryRowProps) => (
    <div className='flex items-baseline justify-between gap-3'>
        <div>
            <p className={muted ? 'text-sm text-[#CDCECF]' : 'text-sm font-medium text-white'}>{label}</p>
            {sub && <p className='text-xs text-[#8EA0B8]'>{sub}</p>}
        </div>
        <p
            className={
                highlight
                    ? 'text-sm font-bold text-[#FFDC75]'
                    : muted
                      ? 'text-sm text-[#CDCECF]'
                      : 'text-sm font-semibold text-white'
            }>
            {value}
        </p>
    </div>
);

export default StepCheckout;
