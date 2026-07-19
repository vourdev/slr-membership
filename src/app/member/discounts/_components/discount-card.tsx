'use client';

import Image from 'next/image';

import type { Discount } from '@/lib/api/resources/discounts';
import { goldButtonStyle } from '@/lib/styles';

import { Tag } from 'lucide-react';

export function DiscountCard({ discount, onSelect }: { discount: Discount; onSelect: (d: Discount) => void }) {
    const initial = (discount.partner_name || discount.title || '?').charAt(0).toUpperCase();

    return (
        <div className='bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex w-full flex-col overflow-hidden rounded-2xl border transition-colors'>
            <div className='bg-slr-navy-card relative flex h-32 w-full items-center justify-center'>
                {discount.thumbnail_url ? (
                    <Image src={discount.thumbnail_url} alt='' fill unoptimized className='object-cover' />
                ) : (
                    <span className='text-slr-gold-label text-4xl font-bold'>{initial}</span>
                )}
            </div>

            <div className='flex flex-col gap-2 p-4'>
                <h3 className='line-clamp-2 text-base font-semibold text-white'>{discount.title || '-'}</h3>
                <p className='text-slr-muted truncate text-sm'>{discount.partner_name || '-'}</p>

                {discount.description ? (
                    <p className='text-slr-dim line-clamp-2 text-xs'>{discount.description}</p>
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
        </div>
    );
}
