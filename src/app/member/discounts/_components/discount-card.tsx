'use client';

import Image from 'next/image';

import type { Discount } from '@/lib/api/resources/discounts';
import { goldButtonStyle } from '@/lib/styles';

import { Tag } from 'lucide-react';

export function DiscountCard({ discount, onSelect }: { discount: Discount; onSelect: (d: Discount) => void }) {
    const initial = (discount.partner_name || discount.title || '?').charAt(0).toUpperCase();

    return (
        <div className='bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex w-full flex-col gap-3 rounded-2xl border p-4 transition-colors'>
            {discount.thumbnail_url ? (
                <div className='relative flex h-28 w-full items-center justify-center'>
                    <Image src={discount.thumbnail_url} alt='' fill unoptimized className='object-contain p-2' />
                </div>
            ) : (
                <div className='bg-slr-navy-card border-slr-navy-border flex h-28 w-full items-center justify-center rounded-xl border'>
                    <span className='text-slr-gold-label text-3xl font-bold'>{initial}</span>
                </div>
            )}

            <div className='border-slr-gold-label/40 bg-gold-tint rounded-lg border px-3 py-2 text-center'>
                <p className='line-clamp-2 text-sm text-white'>{discount.title || '-'}</p>
            </div>

            <p className='truncate font-semibold text-white'>{discount.partner_name || '-'}</p>

            {discount.description ? (
                <p className='text-slr-muted line-clamp-2 text-xs'>{discount.description}</p>
            ) : null}

            <span className='text-slr-dim inline-flex w-fit items-center gap-1 text-xs'>
                <Tag className='size-3' /> {discount.category || '-'}
            </span>

            <button
                type='button'
                onClick={() => onSelect(discount)}
                className='mt-1 h-11 w-full rounded-xl text-sm font-bold uppercase'
                style={goldButtonStyle}>
                Claim Deal
            </button>
        </div>
    );
}
