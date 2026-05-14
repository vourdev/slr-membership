'use client';

import React, { useActionState, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpCredentials } from '@/lib/action';
import { cn } from '@/lib/utils';

import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';

// Glassmorphism style per design system
const glassStyle: React.CSSProperties = {
    background: 'linear-gradient(117.58deg, rgba(215, 237, 237, 0.16) -47.79%, rgba(204, 235, 235, 0) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(50px)',
    WebkitBackdropFilter: 'blur(50px)'
};

// Gold gradient button style per design system
const goldButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)'
};

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [state, formAction, isPending] = useActionState(signUpCredentials, null);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={cn('font-body flex flex-col gap-6', className)} {...props}>
            <Card style={glassStyle} className='gap-4 border-0 text-white shadow-2xl'>
                <CardHeader>
                    <CardTitle className='font-bebas-neue text-3xl tracking-wider text-white md:text-4xl'>
                        Create Account
                    </CardTitle>
                    <CardDescription className='text-[#CDCECF]'>
                        Enter your details below to join Smart Life Rewards
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className='flex flex-col gap-5'>
                            <div className='grid gap-2'>
                                <Label htmlFor='name' className='text-sm font-medium text-white'>
                                    Name
                                </Label>
                                <Input
                                    id='name'
                                    name='name'
                                    type='text'
                                    placeholder='Your full name'
                                    required
                                    className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                                />
                                {state?.error?.name && (
                                    <span className='text-xs text-red-400'>{state?.error?.name}</span>
                                )}
                            </div>

                            <div className='grid gap-2'>
                                <Label htmlFor='email' className='text-sm font-medium text-white'>
                                    Email
                                </Label>
                                <Input
                                    id='email'
                                    name='email'
                                    type='email'
                                    placeholder='email@example.com'
                                    required
                                    className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                                />
                                {state?.error?.email && (
                                    <span className='text-xs text-red-400'>{state?.error?.email}</span>
                                )}
                            </div>

                            <div className='grid gap-2'>
                                <Label htmlFor='password' className='text-sm font-medium text-white'>
                                    Password
                                </Label>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder='Create a strong password'
                                        className='h-11 rounded-lg border-white/10 bg-white/5 pr-10 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                                    />
                                    <button
                                        type='button'
                                        onClick={togglePasswordVisibility}
                                        className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-white/50 transition-colors hover:text-white focus:outline-none'
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        {showPassword ? (
                                            <EyeOffIcon className='h-4 w-4' />
                                        ) : (
                                            <EyeIcon className='h-4 w-4' />
                                        )}
                                    </button>
                                </div>
                                {state?.error?.password && (
                                    <span className='text-xs text-red-400'>{state?.error?.password}</span>
                                )}
                            </div>

                            <div className='flex flex-col gap-3 pt-2'>
                                {isPending ? (
                                    <Button
                                        disabled
                                        style={goldButtonStyle}
                                        className='h-11 w-full rounded-full font-bold text-[#1a1408] opacity-80 shadow-md'>
                                        <Loader2Icon className='animate-spin' />
                                        Loading
                                    </Button>
                                ) : (
                                    <Button
                                        type='submit'
                                        style={goldButtonStyle}
                                        className='h-11 w-full rounded-xl font-bold text-[#1a1408] shadow-md transition-opacity hover:opacity-90'>
                                        Register
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
