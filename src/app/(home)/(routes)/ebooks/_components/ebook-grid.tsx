'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Ebook, ebookCategories, ebooks } from '@/data/ebooks';
import { cn } from '@/lib/utils';

import { BookOpen, Clock, Lock } from 'lucide-react';

type AccessConfig = {
    label: string;
    badgeClass: string;
    cta: string;
    helper: string;
};

const accessConfig: Record<Ebook['access'], AccessConfig> = {
    all: {
        label: 'All members',
        badgeClass: 'border-[#7CD99259] bg-[#7CD9921A] text-[#7CD992]',
        cta: 'Read preview',
        helper: 'Available to every account, including free Visitors.'
    },
    paid: {
        label: 'Red & Premium',
        badgeClass: 'border-[#FFDC7559] bg-[#FFDC751A] text-[#FFDC75]',
        cta: 'Unlock with Red',
        helper: 'Included with SLR Red and Premium memberships.'
    },
    blue: {
        label: 'Premium only',
        badgeClass: 'border-[#6AB0F059] bg-[#6AB0F01A] text-[#6AB0F0]',
        cta: 'Unlock with Premium',
        helper: 'Exclusive to SLR Premium members.'
    }
};

type FilterValue = 'all' | Ebook['category'];

const EbookGrid = () => {
    const [filter, setFilter] = useState<FilterValue>('all');

    const filtered = useMemo(() => {
        if (filter === 'all') return ebooks;
        
return ebooks.filter((b) => b.category === filter);
    }, [filter]);

    const filters: FilterValue[] = ['all', ...ebookCategories];

    return (
        <div>
            <div className='flex flex-wrap items-center gap-2'>
                {filters.map((f) => {
                    const isActive = filter === f;
                    
return (
                        <button
                            key={f}
                            type='button'
                            onClick={() => setFilter(f)}
                            className={cn(
                                'rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors md:text-sm',
                                isActive
                                    ? 'border-[#D4AF3759] bg-[#D4AF370D] text-[#FFDC75]'
                                    : 'border-white/10 bg-white/2 text-[#8EA0B8] hover:border-white/20 hover:text-white'
                            )}>
                            {f === 'all' ? 'All categories' : f}
                        </button>
                    );
                })}
            </div>

            <p className='mt-4 text-xs text-[#8EA0B8]'>
                Showing {filtered.length} of {ebooks.length} titles
            </p>

            <div className='mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                {filtered.map((book) => {
                    const cfg = accessConfig[book.access];
                    
return (
                        <article
                            key={book.id}
                            className='group flex flex-col overflow-hidden rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] shadow-[0px_0px_20px_0px_#776D6D26] transition-all hover:border-[#F5D78E]/40 hover:shadow-[0px_0px_25px_0px_#776D6D36]'>
                            <div
                                className='relative aspect-[3/2] overflow-hidden'
                                style={{
                                    background: `linear-gradient(154.36deg, ${book.cover.from} 0.82%, ${book.cover.to} 98.65%)`
                                }}>
                                <div
                                    className='pointer-events-none absolute inset-0'
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
                                        backgroundSize: '40px 40px'
                                    }}
                                />
                                <div className='absolute top-3 right-3'>
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase backdrop-blur-sm',
                                            cfg.badgeClass
                                        )}>
                                        {book.access !== 'all' && <Lock className='h-2.5 w-2.5' />}
                                        {cfg.label}
                                    </span>
                                </div>
                                <div className='absolute right-0 bottom-0 left-0 p-4'>
                                    <p className='text-[10px] font-semibold tracking-widest text-white/60 uppercase'>
                                        {book.category}
                                    </p>
                                    <h3
                                        className='font-bebas-neue mt-1 text-2xl leading-tight tracking-wider text-white uppercase md:text-3xl'
                                        style={{ color: book.cover.accent }}>
                                        {book.title}
                                    </h3>
                                </div>
                            </div>

                            <div className='flex flex-1 flex-col p-5'>
                                <p className='text-xs font-medium text-[#8EA0B8]'>by {book.author}</p>
                                <p className='mt-3 text-sm leading-relaxed text-[#CDCECF]'>{book.description}</p>

                                <div className='mt-4 flex items-center gap-4 text-xs text-[#8EA0B8]'>
                                    <span className='inline-flex items-center gap-1'>
                                        <BookOpen className='h-3.5 w-3.5' /> {book.pages} pages
                                    </span>
                                    <span className='inline-flex items-center gap-1'>
                                        <Clock className='h-3.5 w-3.5' /> {book.minutes} min
                                    </span>
                                </div>

                                <div className='mt-5 pt-4'>
                                    <Link href='/sign-up'>
                                        <Button
                                            variant='outline'
                                            className='h-10 w-full rounded-xl border border-[#FFD147] bg-[#FFD1471A] text-sm font-semibold text-[#FFDC75] hover:bg-[#FFD14726] hover:text-[#FFDC75]'>
                                            {cfg.cta}
                                        </Button>
                                    </Link>
                                    <p className='mt-2 text-center text-[10px] text-[#8EA0B8]'>{cfg.helper}</p>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className='mt-12 rounded-2xl border border-white/10 bg-white/2 p-12 text-center'>
                    <p className='text-sm text-[#CDCECF]'>No e-books in this category yet — check back soon.</p>
                </div>
            )}
        </div>
    );
};

export default EbookGrid;
