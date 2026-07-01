'use client';

import { useState } from 'react';

import type { Discount } from '@/types/member';

import { Check, Copy, Tag } from 'lucide-react';

export function DiscountCard({ discount }: { discount: Discount }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(discount.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // clipboard unavailable — no-op
        }
    };

    return (
        <article className='bg-card-dark-navy border-slr-navy-border flex flex-col rounded-2xl border p-4'>
            <div className='flex items-start justify-between gap-2'>
                <div className='flex items-center gap-2.5'>
                    <span className='bg-gold-tint flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF3759]'>
                        <Tag className='text-slr-gold-label size-4' />
                    </span>
                    <div className='min-w-0'>
                        <p className='truncate font-semibold text-white'>{discount.brand}</p>
                        <p className='text-slr-dim text-xs'>{discount.category}</p>
                    </div>
                </div>
                <span
                    className='text-slr-gold-label shrink-0 rounded-md border border-[#D4AF3759] px-2 py-0.5 text-xs font-semibold'
                    style={{ background: '#291F0A' }}>
                    {discount.value_label}
                </span>
            </div>

            <p className='text-slr-muted mt-3 text-xs leading-relaxed'>{discount.description}</p>

            <button
                type='button'
                onClick={copy}
                aria-label={`Copy ${discount.brand} code ${discount.code}`}
                className='border-slr-navy-border mt-3 flex items-center justify-between gap-2 rounded-lg border border-dashed bg-black/20 px-3 py-2 transition-colors hover:bg-black/30'>
                <span className='font-mono text-sm tracking-wider text-white'>{discount.code}</span>
                <span className='text-slr-gold-label inline-flex shrink-0 items-center gap-1 text-xs font-semibold uppercase'>
                    {copied ? (
                        <>
                            <Check className='size-3.5' /> Copied
                        </>
                    ) : (
                        <>
                            <Copy className='size-3.5' /> Copy
                        </>
                    )}
                </span>
            </button>

            <p className='text-slr-dim mt-2 text-xs leading-relaxed'>{discount.terms}</p>
        </article>
    );
}
