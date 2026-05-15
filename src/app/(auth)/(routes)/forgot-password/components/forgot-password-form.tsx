'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Loader2Icon, MailCheck } from 'lucide-react';

const glassStyle: React.CSSProperties = {
    background: 'linear-gradient(117.58deg, rgba(215, 237, 237, 0.16) -47.79%, rgba(204, 235, 235, 0) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)'
};

const goldButtonStyle: React.CSSProperties = {
    color: '#0C1132',
    background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
    borderTop: '2px solid #FFDC75'
};

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [pending, setPending] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email) return;
        setPending(true);
        await new Promise((r) => setTimeout(r, 900));
        setPending(false);
        setSent(true);
    };

    return (
        <Card style={glassStyle} className='gap-4 border-0 text-white shadow-2xl'>
            {sent ? (
                <CardContent className='py-10 text-center'>
                    <div
                        className='mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl'
                        style={{
                            background:
                                'linear-gradient(89.12deg, rgba(245,215,142,0.15) 3.07%, rgba(212,175,55,0.15) 41.36%, rgba(255,224,102,0.15) 60.5%, rgba(160,112,24,0.15) 98.79%)',
                            border: '1px solid #D4AF3759'
                        }}>
                        <MailCheck className='h-6 w-6 text-[#FFDC75]' />
                    </div>
                    <h3 className='font-bebas-neue mt-4 text-2xl tracking-wider text-white uppercase'>
                        Check your inbox
                    </h3>
                    <p className='mt-2 text-sm text-[#CDCECF]'>
                        If an account exists for <span className='font-semibold text-white'>{email}</span>, we&apos;ve
                        sent a reset link. The link is valid for 30 minutes.
                    </p>
                    <button
                        type='button'
                        onClick={() => {
                            setSent(false);
                            setEmail('');
                        }}
                        className='mt-6 text-xs font-semibold text-[#FFDC75] hover:underline'>
                        Use a different email
                    </button>
                </CardContent>
            ) : (
                <>
                    <CardHeader>
                        <CardTitle className='font-bebas-neue text-3xl tracking-wider text-white md:text-4xl'>
                            Forgot password?
                        </CardTitle>
                        <CardDescription className='text-[#CDCECF]'>
                            Enter the email on your account and we&apos;ll send a reset link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className='flex flex-col gap-5'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='email' className='text-sm font-medium text-white'>
                                        Email
                                    </Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder='you@example.com'
                                        autoComplete='email'
                                        className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                                    />
                                </div>
                                <Button
                                    type='submit'
                                    disabled={pending}
                                    style={goldButtonStyle}
                                    className='h-11 w-full rounded-xl font-bold uppercase shadow-md transition-opacity hover:opacity-90 disabled:opacity-70'>
                                    {pending ? (
                                        <>
                                            <Loader2Icon className='animate-spin' /> Sending
                                        </>
                                    ) : (
                                        'Send reset link'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </>
            )}
        </Card>
    );
};

export default ForgotPasswordForm;
