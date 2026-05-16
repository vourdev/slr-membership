'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

import { ArrowLeft, Loader2Icon, MailCheck } from 'lucide-react';

const goldButtonStyle: React.CSSProperties = {
    color: '#0C1132',
    background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
    borderTop: '2px solid #FFDC75'
};

type StepOtpProps = {
    email: string;
    onNext: () => void;
    onBack: () => void;
};

const StepOtp = ({ email, onNext, onBack }: StepOtpProps) => {
    const [code, setCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        if (code.length !== 6) {
            setError('Enter the 6-digit code from your email.');
            
return;
        }
        setError(null);
        setVerifying(true);
        await new Promise((r) => setTimeout(r, 900));
        setVerifying(false);
        onNext();
    };

    const handleResend = async () => {
        setCode('');
        setError(null);
    };

    return (
        <div className='flex flex-col gap-6'>
            <div className='text-center'>
                <div
                    className='mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl'
                    style={{
                        background:
                            'linear-gradient(89.12deg, rgba(245,215,142,0.15) 3.07%, rgba(212,175,55,0.15) 41.36%, rgba(255,224,102,0.15) 60.5%, rgba(160,112,24,0.15) 98.79%)',
                        border: '1px solid #D4AF3759'
                    }}>
                    <MailCheck className='h-6 w-6 text-[#FFDC75]' />
                </div>
                <h2 className='font-bebas-neue mt-4 text-3xl tracking-wider text-white uppercase md:text-4xl'>
                    Verify your email
                </h2>
                <p className='mt-2 text-sm text-[#CDCECF]'>
                    We sent a 6-digit code to <span className='font-semibold text-white'>{email}</span>.
                </p>
            </div>

            <div className='rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26] md:p-8'>
                <div className='flex justify-center'>
                    <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(v) => {
                            setCode(v);
                            if (error) setError(null);
                        }}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} className='h-12 w-10 border-white/10 bg-white/5 text-white' />
                            <InputOTPSlot index={1} className='h-12 w-10 border-white/10 bg-white/5 text-white' />
                            <InputOTPSlot index={2} className='h-12 w-10 border-white/10 bg-white/5 text-white' />
                        </InputOTPGroup>
                        <InputOTPSeparator className='text-white/30' />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} className='h-12 w-10 border-white/10 bg-white/5 text-white' />
                            <InputOTPSlot index={4} className='h-12 w-10 border-white/10 bg-white/5 text-white' />
                            <InputOTPSlot index={5} className='h-12 w-10 border-white/10 bg-white/5 text-white' />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                {error && <p className='mt-3 text-center text-xs text-red-400'>{error}</p>}

                <p className='mt-5 text-center text-xs text-[#CDCECF]'>
                    Didn&apos;t get it?{' '}
                    <button
                        type='button'
                        onClick={handleResend}
                        className='font-semibold text-[#FFDC75] hover:underline'>
                        Resend code
                    </button>
                </p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={onBack}
                    disabled={verifying}
                    className='h-11 rounded-xl border border-white/10 bg-white/5 px-6 font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto'>
                    <ArrowLeft className='h-4 w-4' />
                    Back
                </Button>
                <Button
                    type='button'
                    onClick={handleVerify}
                    disabled={verifying || code.length !== 6}
                    style={goldButtonStyle}
                    className='h-11 flex-1 rounded-xl font-bold uppercase shadow-md transition-opacity hover:opacity-90 disabled:opacity-70'>
                    {verifying ? (
                        <>
                            <Loader2Icon className='animate-spin' /> Verifying
                        </>
                    ) : (
                        'Verify and continue'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default StepOtp;
