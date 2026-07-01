'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { BENY_CATEGORIES } from '@/data/discounts';
import { goldButtonStyle, inputClassName } from '@/lib/styles';
import { cn } from '@/lib/utils';

import { Check, Clock, Fuel, Heart, type LucideIcon, ShoppingBag, Sparkles } from 'lucide-react';

const CATEGORY_ICON: Record<string, LucideIcon> = {
    'Petrol Saving': Fuel,
    'Retail Partner Discounts': ShoppingBag,
    'Lifestyle Offers': Sparkles,
    'Health & Wellbeing': Heart
};

type Status = 'active' | 'inactive' | 'pending' | 'canceled';

export function BenySection({ active }: { active: boolean }) {
    const [status, setStatus] = useState<Status>(active ? 'active' : 'inactive');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock: real flow collects these details then redirects to Stripe Checkout
        // ($4/mo). After payment the member lands on the admin "pending activation"
        // list; BENY is activated manually off-platform.
        setStatus('pending');
        setShowForm(false);
    };

    return (
        <section className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <div className='flex flex-wrap items-start justify-between gap-2'>
                <div>
                    <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>
                        Extra Saving with BENY
                    </h2>
                    <p className='text-slr-muted mt-1 max-w-xl text-sm leading-relaxed'>
                        Optional add-on unlocking premium brand discounts through the BENY app. Billed separately,
                        cancel anytime.
                    </p>
                </div>
                <span
                    className='text-slr-gold-label shrink-0 rounded-md border border-[#D4AF3759] px-2.5 py-1 text-sm font-semibold'
                    style={{ background: '#291F0A' }}>
                    $4/month
                </span>
            </div>

            <div className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4'>
                {BENY_CATEGORIES.map((c) => {
                    const Icon = CATEGORY_ICON[c] ?? Sparkles;

                    return (
                        <div
                            key={c}
                            className='border-slr-navy-border flex items-center gap-2 rounded-lg border bg-black/20 px-3 py-2'>
                            <Icon className='text-slr-gold-label size-4 shrink-0' />
                            <span className='text-xs text-white/90'>{c}</span>
                        </div>
                    );
                })}
            </div>

            <div className='mt-5 border-t border-white/5 pt-4'>
                {status === 'active' && (
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                        <span className='inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400'>
                            <Check className='size-4' /> BENY is active on your account
                        </span>
                        <button
                            type='button'
                            onClick={() => setStatus('canceled')}
                            className='rounded-lg border border-white/15 px-4 py-1.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white'>
                            Cancel BENY
                        </button>
                    </div>
                )}

                {status === 'canceled' && (
                    <p className='text-slr-muted text-sm'>
                        BENY has been canceled. Your access continues until the end of the current billing period.
                    </p>
                )}

                {status === 'pending' && (
                    <p className='inline-flex items-start gap-2 text-sm text-white/90'>
                        <Clock className='text-slr-gold-label mt-0.5 size-4 shrink-0' />
                        Pending activation — you&apos;ll receive access details by email shortly, then download the BENY
                        app to start saving.
                    </p>
                )}

                {status === 'inactive' &&
                    (showForm ? (
                        <form onSubmit={submit} className='space-y-3'>
                            <p className='text-slr-muted text-sm'>
                                Enter your details to add BENY. You&apos;ll be redirected to secure checkout for the
                                $4/month subscription.
                            </p>
                            <div className='grid gap-3 sm:grid-cols-3'>
                                <Input
                                    required
                                    className={inputClassName}
                                    placeholder='Full name'
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                                <Input
                                    required
                                    type='email'
                                    className={inputClassName}
                                    placeholder='Email'
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                                <Input
                                    required
                                    type='tel'
                                    className={inputClassName}
                                    placeholder='Phone'
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    type='submit'
                                    className='inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-bold uppercase'
                                    style={goldButtonStyle}>
                                    Continue to checkout
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setShowForm(false)}
                                    className='text-slr-dim px-3 py-2 text-sm hover:text-white'>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                            <span className='text-slr-muted text-sm'>Not subscribed yet.</span>
                            <button
                                type='button'
                                onClick={() => setShowForm(true)}
                                className={cn(
                                    'inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-bold uppercase'
                                )}
                                style={goldButtonStyle}>
                                Add BENY — $4/mo
                            </button>
                        </div>
                    ))}
            </div>
        </section>
    );
}
