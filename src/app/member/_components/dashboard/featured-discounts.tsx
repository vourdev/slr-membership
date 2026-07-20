'use client';

import { useState } from 'react';

import { DiscountCard } from '@/app/member/discounts/_components/discount-card';
import { DiscountDetailDialog } from '@/app/member/discounts/_components/discount-detail-dialog';
import type { Discount } from '@/lib/api/resources/discounts';

import { SectionTitle } from './section-title';

export function FeaturedDiscounts({ discounts }: { discounts: Discount[] }) {
    const [selected, setSelected] = useState<Discount | null>(null);

    return (
        <section>
            <SectionTitle viewAllHref='/member/discounts'>Featured Discounts</SectionTitle>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {discounts.map((d) => (
                    <DiscountCard key={d.discount_id} discount={d} onSelect={setSelected} />
                ))}
            </div>
            <DiscountDetailDialog discount={selected} onClose={() => setSelected(null)} />
        </section>
    );
}
