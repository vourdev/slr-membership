'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInCredentials } from '@/lib/action';
import { cn } from '@/lib/utils';

import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [state, formAction, isPending] = React.useActionState(signInCredentials, null);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={cn('font-body flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                    {state?.message && <div className='text-sm text-red-500'>{state?.message}</div>}
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className='flex flex-col gap-6'>
                            <div className='grid gap-3'>
                                <Label htmlFor='email'>Email</Label>
                                <Input id='email' type='email' name='email' placeholder='email@example.com' required />
                                <div className='text-sm text-red-500'>{state?.error?.email}</div>
                            </div>

                            <div className='grid gap-3'>
                                <Label htmlFor='password'>Password</Label>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        name='password'
                                        required
                                        placeholder='password'
                                        className='pr-10'
                                    />
                                    <button
                                        type='button'
                                        onClick={togglePasswordVisibility}
                                        className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none'
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        {showPassword ? (
                                            <EyeOffIcon className='h-4 w-4' />
                                        ) : (
                                            <EyeIcon className='h-4 w-4' />
                                        )}
                                    </button>
                                </div>
                                <div className='text-sm text-red-500'>{state?.error?.password}</div>
                            </div>

                            <div className='flex flex-col gap-3'>
                                {isPending ? (
                                    <Button disabled>
                                        <Loader2Icon className='animate-spin' />
                                        Loading
                                    </Button>
                                ) : (
                                    <Button type='submit' className='w-full'>
                                        Login
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
