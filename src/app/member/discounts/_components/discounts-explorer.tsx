'use client';

import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import type { Discount } from '@/lib/api/resources/discounts';
import { inputClassName } from '@/lib/styles';
import { cn } from '@/lib/utils';

import { DiscountCard } from './discount-card';
import { DiscountDetailDialog } from './discount-detail-dialog';
import { Search } from 'lucide-react';

export function DiscountsExplorer({ discounts, categories }: { discounts: Discount[]; categories: readonly string[] }) {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [selected, setSelected] = useState<Discount | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return discounts.filter((d) => {
            const matchesCategory = category === 'All' || d.category === category;
            const matchesQuery =
                !q ||
                d.partner_name.toLowerCase().includes(q) ||
                d.title.toLowerCase().includes(q) ||
                d.category.toLowerCase().includes(q);

            return matchesCategory && matchesQuery;
        });
    }, [discounts, query, category]);

    return (
        <div className='space-y-4'>
            <div className='relative'>
                <Search className='text-slr-dim pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
                <Input
                    type='search'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search partners…'
                    aria-label='Search partners'
                    className={cn(inputClassName, 'pl-9')}
                />
            </div>

            <div className='flex flex-wrap gap-2.5'>
                {['All', ...categories].map((c) => (
                    <button
                        key={c}
                        type='button'
                        onClick={() => setCategory(c)}
                        className={cn(
                            'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                            category === c
                                ? 'border-slr-gold-label/40 bg-gold-tint text-slr-gold-label'
                                : 'border-slr-navy-border text-slr-dim hover:text-white'
                        )}>
                        {c}
                    </button>
                ))}
            </div>

            {filtered.length > 0 ? (
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {filtered.map((d) => (
                        <DiscountCard key={d.discount_id} discount={d} onSelect={setSelected} />
                    ))}
                </div>
            ) : (
                <p className='text-slr-dim py-10 text-center text-sm'>No partners match your search.</p>
            )}

            <DiscountDetailDialog discount={selected} onClose={() => setSelected(null)} />
        </div>
    );
}
