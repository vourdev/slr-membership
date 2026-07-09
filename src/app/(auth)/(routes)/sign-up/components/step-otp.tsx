'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { resendOtp, verifyOtp } from '@/lib/api/resources/auth';
import { ApiError } from '@/lib/api/types';
import { goldButtonStyle } from '@/lib/styles';

import { ArrowLeft, Loader2Icon, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

type StepOtpProps = {
    email: string;
    userId: string;
    onNext: () => void;
    onBack: () => void;
};

const RESEND_COOLDOWN = 30;

const StepOtp = ({ email, userId, onNext, onBack }: StepOtpProps) => {
    const [code, setCode] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);

        return () => clearInterval(timer);
    }, [cooldown]);

    const handleVerify = async () => {
        if (code.length !== 6) {
            setError('Enter the 6-digit code from your email.');

            return;
        }
        setError(null);
        setVerifying(true);
        try {
            await verifyOtp(userId, code);
            onNext();
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || resending) return;
        setCode('');
        setError(null);
        setResending(true);
        try {
            await resendOtp(userId);
            setCooldown(RESEND_COOLDOWN);
            toast.success('A new code is on its way to your inbox.');
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : 'Could not resend the code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className='flex flex-col gap-6'>
            <div className='text-center'>
                <div className='bg-gold-tint mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF3759]'>
                    <MailCheck className='h-6 w-6 text-[#FFDC75]' />
                </div>
                <h2 className='font-bebas-neue mt-4 text-3xl tracking-wider text-white uppercase md:text-4xl'>
                    Verify your email
                </h2>
                <p className='text-slr-muted mt-2 text-sm'>
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
                            <InputOTPSlot
                                index={0}
                                className='h-12 w-10 border-white/10 bg-white/5 text-white caret-white'
                            />
                            <InputOTPSlot
                                index={1}
                                className='h-12 w-10 border-white/10 bg-white/5 text-white caret-white'
                            />
                            <InputOTPSlot
                                index={2}
                                className='h-12 w-10 border-white/10 bg-white/5 text-white caret-white'
                            />
                        </InputOTPGroup>
                        <InputOTPSeparator className='text-white/30' />
                        <InputOTPGroup>
                            <InputOTPSlot
                                index={3}
                                className='h-12 w-10 border-white/10 bg-white/5 text-white caret-white'
                            />
                            <InputOTPSlot
                                index={4}
                                className='h-12 w-10 border-white/10 bg-white/5 text-white caret-white'
                            />
                            <InputOTPSlot
                                index={5}
                                className='h-12 w-10 border-white/10 bg-white/5 text-white caret-white'
                            />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                {error && <p className='mt-3 text-center text-xs text-red-400'>{error}</p>}

                <p className='text-slr-muted mt-5 text-center text-xs'>
                    Didn&apos;t get it?{' '}
                    <button
                        type='button'
                        onClick={handleResend}
                        disabled={cooldown > 0 || resending}
                        className='font-semibold text-[#FFDC75] hover:underline disabled:cursor-not-allowed disabled:text-white/40 disabled:no-underline'>
                        {resending ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                    </button>
                </p>
            </div>

            <div className='flex flex-wrap gap-3'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={onBack}
                    disabled={verifying}
                    className='h-11 min-w-max flex-1 rounded-xl border border-white/10 bg-white/5 px-6 font-semibold text-white hover:bg-white/10 hover:text-white sm:flex-none'>
                    <ArrowLeft className='h-4 w-4' />
                    Back
                </Button>
                <Button
                    type='button'
                    onClick={handleVerify}
                    disabled={verifying || code.length !== 6}
                    style={goldButtonStyle}
                    className='h-11 min-w-max flex-1 rounded-xl font-bold uppercase shadow-md transition-opacity hover:opacity-90 disabled:opacity-70'>
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
