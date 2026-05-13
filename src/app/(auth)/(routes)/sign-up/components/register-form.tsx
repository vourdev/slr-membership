'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpCredentials } from '@/lib/action';
import { cn } from '@/lib/utils';

import { Loader2Icon } from 'lucide-react';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [state, formAction, isPending] = useActionState(signUpCredentials, null);

    return (
        <div className={cn('font-body flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create a new account</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        <div className='flex flex-col gap-6'>
                            <div className='grid gap-3'>
                                <Label htmlFor='name'>Name</Label>
                                <Input id='name' name='name' type='text' placeholder='username' required />
                                {state?.error?.name && (
                                    <span className='text-sm text-red-500'>{state?.error?.name}</span>
                                )}
                            </div>
                            <div className='grid gap-3'>
                                <Label htmlFor='email'>Email</Label>
                                <Input id='email' name='email' type='email' placeholder='m@example.com' required />
                                {state?.error?.email && (
                                    <span className='text-sm text-red-500'>{state?.error?.email}</span>
                                )}
                            </div>
                            <div className='grid gap-3'>
                                <div className='flex items-center'>
                                    <Label htmlFor='password'>Password</Label>
                                </div>
                                <Input id='password' name='password' type='password' required />
                                {state?.error?.password && (
                                    <span className='text-sm text-red-500'>{state?.error?.password}</span>
                                )}
                            </div>
                            <div className='flex flex-col gap-3'>
                                {isPending ? (
                                    <Button disabled>
                                        <Loader2Icon className='animate-spin' />
                                        Loading
                                    </Button>
                                ) : (
                                    <Button type='submit' className='w-full'>
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
