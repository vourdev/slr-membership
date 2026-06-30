import type { FeaturedDiscount } from '@/types/member';

import { SectionTitle } from './section-title';
import { Tag } from 'lucide-react';

export function FeaturedDiscounts({ discounts }: { discounts: FeaturedDiscount[] }) {
    return (
        <section>
            <SectionTitle viewAllHref='/member/discounts'>Featured Discounts</SectionTitle>
            {/* Horizontal scroll highlight per PRD §4.2. */}
            <div className='-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2'>
                {discounts.map((d) => (
                    <article
                        key={d.id}
                        className='bg-card-dark-navy border-slr-navy-border shadow-card-soft flex w-44 shrink-0 snap-start flex-col gap-3 rounded-xl border p-4'>
                        <span className='bg-gold-tint flex size-10 items-center justify-center rounded-xl border border-[#D4AF3759]'>
                            <Tag className='text-slr-gold-label size-5' />
                        </span>
                        <div className='space-y-0.5'>
                            <p className='truncate text-sm font-semibold text-white'>{d.brand}</p>
                            <p className='text-slr-dim text-xs'>{d.category}</p>
                        </div>
                        <span
                            className='text-slr-gold-label mt-auto w-fit rounded-md border border-[#D4AF3759] px-2 py-0.5 text-xs font-semibold'
                            style={{ background: '#291F0A' }}>
                            {d.value_label}
                        </span>
                    </article>
                ))}
            </div>
        </section>
    );
}
