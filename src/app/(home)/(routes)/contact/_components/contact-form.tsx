'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

const subjects = [
    'General enquiry',
    'Membership & billing',
    'Draws & prizes',
    'Discounts & BENY',
    'Technical issue',
    'Partnership opportunity'
];

const goldButtonStyle: React.CSSProperties = {
    color: '#0C1132',
    background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
    borderTop: '2px solid #FFDC75'
};

const ContactForm = () => {
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsPending(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsPending(false);
        toast.success("Message sent. We'll get back to you within one business day.");
        (event.target as HTMLFormElement).reset();
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-5'>
            <div className='grid gap-5 sm:grid-cols-2'>
                <div className='grid gap-2'>
                    <Label htmlFor='firstName' className='text-sm font-medium text-white'>
                        First name
                    </Label>
                    <Input
                        id='firstName'
                        name='firstName'
                        type='text'
                        required
                        placeholder='Jane'
                        className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='lastName' className='text-sm font-medium text-white'>
                        Last name
                    </Label>
                    <Input
                        id='lastName'
                        name='lastName'
                        type='text'
                        required
                        placeholder='Smith'
                        className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                    />
                </div>
            </div>

            <div className='grid gap-5 sm:grid-cols-2'>
                <div className='grid gap-2'>
                    <Label htmlFor='email' className='text-sm font-medium text-white'>
                        Email
                    </Label>
                    <Input
                        id='email'
                        name='email'
                        type='email'
                        required
                        placeholder='you@example.com'
                        className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                    />
                </div>
                <div className='grid gap-2'>
                    <Label htmlFor='phone' className='text-sm font-medium text-white'>
                        Phone <span className='text-white/40'>(optional)</span>
                    </Label>
                    <Input
                        id='phone'
                        name='phone'
                        type='tel'
                        placeholder='04xx xxx xxx'
                        className='h-11 rounded-lg border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[#D4AF37]/20'
                    />
                </div>
            </div>

            <div className='grid gap-2'>
                <Label htmlFor='subject' className='text-sm font-medium text-white'>
                    Subject
                </Label>
                <select
                    id='subject'
                    name='subject'
                    required
                    defaultValue=''
                    className='h-11 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white focus-visible:border-[#D4AF37]/60 focus-visible:ring-[3px] focus-visible:ring-[#D4AF37]/20 focus-visible:outline-none'>
                    <option value='' disabled className='bg-[#141820]'>
                        Select a subject…
                    </option>
                    {subjects.map((s) => (
                        <option key={s} value={s} className='bg-[#141820]'>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div className='grid gap-2'>
                <Label htmlFor='message' className='text-sm font-medium text-white'>
                    Message
                </Label>
                <textarea
                    id='message'
                    name='message'
                    required
                    rows={5}
                    placeholder='How can we help?'
                    className='rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:border-[#D4AF37]/60 focus-visible:ring-[3px] focus-visible:ring-[#D4AF37]/20 focus-visible:outline-none'
                />
            </div>

            <Button
                type='submit'
                disabled={isPending}
                style={goldButtonStyle}
                className='h-11 w-full rounded-xl font-bold uppercase shadow-md transition-opacity hover:opacity-90 disabled:opacity-70'>
                {isPending ? (
                    <>
                        <Loader2Icon className='animate-spin' />
                        Sending
                    </>
                ) : (
                    'Send message'
                )}
            </Button>

            <p className='text-center text-xs text-white/50'>
                By submitting this form you agree to our{' '}
                <a href='/privacy' className='text-[#FFDC75] hover:underline'>
                    Privacy Policy
                </a>
                .
            </p>
        </form>
    );
};

export default ContactForm;
