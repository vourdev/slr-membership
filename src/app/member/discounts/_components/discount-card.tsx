import type { Discount } from '@/lib/api/resources/discounts';

import { Star, Tag } from 'lucide-react';

export function DiscountCard({ discount }: { discount: Discount }) {
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
        </article>
    );
}
