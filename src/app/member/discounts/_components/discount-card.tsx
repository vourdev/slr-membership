'use client';

import { useState } from 'react';

import type { Discount } from '@/lib/api/resources/discounts';

import { Check, Copy, Star, Tag } from 'lucide-react';
import { toast } from 'sonner';

// Fallbacks for the copy-code + terms slots (both returned by the member API;
// placeholders only kick in for a discount that happens to omit them).
const PLACEHOLDER_CODE = 'SLR-XXXXXX';
const PLACEHOLDER_TERMS = 'Terms & conditions apply — see partner for full details.';

export function DiscountCard({ discount }: { discount: Discount }) {
    const [copied, setCopied] = useState(false);

    const code = discount.code?.trim() || PLACEHOLDER_CODE;
    const terms = discount.terms?.trim() || PLACEHOLDER_TERMS;

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success('Code copied');
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Could not copy code');
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
                        <p className='truncate font-semibold text-white'>{discount.partner_name || '-'}</p>
                        <p className='text-slr-dim text-xs'>{discount.category || '-'}</p>
                    </div>
                </div>
                {discount.is_featured && (
                    <span
                        className='text-slr-gold-label inline-flex shrink-0 items-center gap-1 rounded-md border border-[#D4AF3759] px-2 py-0.5 text-xs font-semibold'
                        style={{ background: '#291F0A' }}>
                        <Star className='size-3' /> Featured
                    </span>
                )}
            </div>

            <p className='mt-3 font-medium text-white'>{discount.title || '-'}</p>
            <p className='text-slr-muted mt-1 text-xs leading-relaxed'>{discount.description || '-'}</p>

            <button
                type='button'
                onClick={copyCode}
                className='border-slr-navy-border mt-3 flex items-center justify-between gap-2 rounded-lg border border-dashed bg-black/20 px-3 py-2 transition-colors hover:border-[#D4AF3759]'>
                <span className='font-mono text-sm tracking-wider text-white/90'>{code}</span>
                {copied ? (
                    <Check className='size-4 shrink-0 text-emerald-400' />
                ) : (
                    <Copy className='text-slr-dim size-4 shrink-0' />
                )}
            </button>

            <p className='text-slr-dim mt-2 text-[10px] leading-relaxed'>{terms}</p>
        </article>
    );
}
