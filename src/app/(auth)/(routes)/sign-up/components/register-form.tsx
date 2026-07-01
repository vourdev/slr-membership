'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import StepAccount from './step-account';
import StepCheckout from './step-checkout';
import StepOtp from './step-otp';
import StepSpinWheel from './step-spin-wheel';
import StepSuccess from './step-success';
import StepTier from './step-tier';
import Stepper from './stepper';
import { SignUpFormData, SpinPrize, isSpinEligible, spinDiscountFor } from './types';

const glassStyle: React.CSSProperties = {
    background: 'linear-gradient(117.58deg, rgba(215, 237, 237, 0.16) -47.79%, rgba(204, 235, 235, 0) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)'
};

const initialData: SignUpFormData = {
    name: '',
    email: '',
    password: '',
    state: '',
    phone: '',
    tier: null,
    sub_tier: null,
    beny: false
};

type Step = 'account' | 'tier' | 'spin' | 'otp' | 'checkout' | 'success';

const STEP_LABELS = ['Account', 'Tier', 'Confirm', 'Done'];

const stepIndexForLabel = (step: Step): number => {
    switch (step) {
        case 'account':
            return 0;
        case 'tier':
            return 1;
        case 'spin':
        case 'otp':
        case 'checkout':
            return 2;
        case 'success':
            return 3;
    }
};

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [data, setData] = useState<SignUpFormData>(initialData);
    const [spinPrize, setSpinPrize] = useState<SpinPrize | null>(null);
    const [step, setStep] = useState<Step>('account');

    const patchData = (patch: Partial<SignUpFormData>) => {
        setData((d) => ({ ...d, ...patch }));
    };

    const goNextFromTier = (patch: Partial<SignUpFormData>) => {
        patchData(patch);
        if (patch.tier === 'visitor') {
            setStep('otp');

            return;
        }
        // Paid: spin only for token-upgrade sub-tiers (R4/R7/B4/B7/B10), else straight to checkout.
        setStep(isSpinEligible(patch.sub_tier ?? data.sub_tier) ? 'spin' : 'checkout');
    };

    const goSpinDone = (prize: SpinPrize) => {
        setSpinPrize(prize);
        setStep('checkout');
    };

    const renderStep = () => {
        switch (step) {
            case 'account':
                return (
                    <StepAccount
                        data={data}
                        onNext={(patch) => {
                            patchData(patch);
                            setStep('tier');
                        }}
                    />
                );
            case 'tier':
                return <StepTier data={data} onNext={goNextFromTier} onBack={() => setStep('account')} />;
            case 'spin':
                return (
                    <StepSpinWheel
                        winDiscount={spinDiscountFor(data.sub_tier)}
                        onNext={goSpinDone}
                        onBack={() => setStep('tier')}
                    />
                );
            case 'otp':
                return <StepOtp email={data.email} onNext={() => setStep('success')} onBack={() => setStep('tier')} />;
            case 'checkout':
                return (
                    <StepCheckout
                        data={data}
                        spinPrize={spinPrize}
                        onNext={() => setStep('success')}
                        onBack={() => setStep(isSpinEligible(data.sub_tier) ? 'spin' : 'tier')}
                    />
                );
            case 'success':
                return <StepSuccess data={data} spinPrize={spinPrize} />;
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <div style={glassStyle} className='rounded-2xl p-6 text-white shadow-2xl md:p-8'>
                <div className='mb-6'>
                    <Stepper steps={STEP_LABELS} current={stepIndexForLabel(step)} />
                </div>
                {renderStep()}
            </div>
        </div>
    );
}
