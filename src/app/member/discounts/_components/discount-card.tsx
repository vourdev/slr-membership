'use client';

import Image from 'next/image';

import type { Discount } from '@/lib/api/resources/discounts';

import { Star, Tag } from 'lucide-react';

export function DiscountCard({ discount, onSelect }: { discount: Discount; onSelect: (d: Discount) => void }) {
    const initial = (discount.partner_name || discount.title || '?').charAt(0).toUpperCase();

    return (
        <button
            type='button'
            onClick={() => onSelect(discount)}
            className='bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex w-full flex-col rounded-2xl border p-4 text-left transition-colors'>
            <div className='flex items-start justify-between gap-2'>
                <div className='bg-slr-navy-card border-slr-navy-border relative size-14 shrink-0 overflow-hidden rounded-lg border'>
                    {discount.thumbnail_url ? (
                        <Image
                            src={discount.thumbnail_url}
                            alt=''
                            fill
                            unoptimized
                            className='object-contain p-1'
                        />
                    ) : (
                        <span className='text-slr-dim flex h-full w-full items-center justify-center text-lg font-semibold'>
                            {initial}
                        </span>
                    )}
                </div>
                {discount.is_featured ? (
                    <span
                        className='text-slr-gold-label inline-flex shrink-0 items-center gap-1 rounded-md border border-[#D4AF3759] px-2 py-0.5 text-xs font-semibold'
                        style={{ background: '#291F0A' }}>
                        <Star className='size-3' /> Featured
                    </span>
                ) : null}
            </div>

            <p className='mt-3 truncate font-semibold text-white'>{discount.partner_name || '-'}</p>
            <p className='text-slr-muted mt-0.5 text-sm'>{discount.title || '-'}</p>
            <span className='text-slr-dim mt-2 inline-flex w-fit items-center gap-1 text-xs'>
                <Tag className='size-3' /> {discount.category || '-'}
            </span>
        </button>
    );
}
