'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { goldButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';

import { chapters } from './ebook-chapters';
import { ArrowRight, ArrowUp, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const DiamondSeparator = ({ className }: { className?: string }) => (
    <div className={cn('flex justify-center', className)} aria-hidden='true'>
        <Image src='/images/diamond-line.png' alt='' width={2160} height={114} className='h-auto w-full opacity-70' />
    </div>
);

const EbookReaderSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const visibleRef = useRef<Set<number>>(new Set());
    const contentRef = useRef<HTMLDivElement>(null);

    // Track which chapter sits in the upper reading band; everything above it is "read".
    useEffect(() => {
        const sections = contentRef.current?.querySelectorAll<HTMLElement>('[data-chapter-index]');
        if (!sections?.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number((entry.target as HTMLElement).dataset.chapterIndex);
                    if (entry.isIntersecting) visibleRef.current.add(index);
                    else visibleRef.current.delete(index);
                });
                if (visibleRef.current.size > 0) setActiveIndex(Math.min(...visibleRef.current));
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleShare = async () => {
        const url = window.location.href;
        const shareData = {
            title: 'Smart Living Blueprint',
            text: 'Read the Smart Living Blueprint on SLR Rewards.',
            url
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // Share dialog dismissed — nothing to do.
            }

            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard');
        } catch {
            toast.error('Could not copy link');
        }
    };

    return (
        <section id='guide' className='scroll-mt-24 bg-[#0B0D0F]'>
            <div className='mx-auto max-w-7xl px-4'>
                {/* Section accent — gradient line centered across the full section */}
                <div className='flex justify-center pb-10'>
                    <div
                        className='h-0.75 w-27 max-w-full'
                        style={{
                            background:
                                'linear-gradient(89.12deg, #F5D68C 3.07%, #D4AD36 41.36%, #FFDE66 60.5%, #9E6E17 98.79%)'
                        }}
                        aria-hidden='true'
                    />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]'>
                    {/* Sidebar — sticky table of contents with reading progress */}
                    <aside className='hidden lg:block lg:border-r lg:border-white/10 lg:pr-10'>
                        <div className='sticky top-30'>
                            <div className='flex items-center gap-2'>
                                <span className='bg-slr-gold-label h-1.5 w-1.5 animate-pulse rounded-full' />
                                <p className='text-slr-dim text-[10px] font-semibold tracking-[0.2em] uppercase'>
                                    Sticky on scroll
                                </p>
                            </div>
                            <h2 className='font-bebas-neue mt-3 text-2xl tracking-wider text-white uppercase'>
                                In This Guide
                            </h2>

                            <div className='mt-4 h-px bg-white/10' />

                            <nav className='mt-4 space-y-1'>
                                {chapters.map((chapter, index) => {
                                    const isActive = index === activeIndex;
                                    const isRead = index < activeIndex;

                                    return (
                                        <a
                                            key={chapter.num}
                                            href={`#chapter-${chapter.num}`}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors',
                                                isActive
                                                    ? 'border-slr-gold-label/40 bg-slr-gold-label/10'
                                                    : 'border-transparent hover:bg-white/5'
                                            )}>
                                            {isRead ? (
                                                <span className='bg-gradient-gold flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#1a1408]'>
                                                    <Check className='h-4 w-4' strokeWidth={3} />
                                                </span>
                                            ) : (
                                                <span
                                                    className={cn(
                                                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold',
                                                        isActive
                                                            ? 'border-slr-gold-label text-slr-gold-label'
                                                            : 'border-white/20 text-white/40'
                                                    )}>
                                                    {chapter.num}
                                                </span>
                                            )}
                                            <span className='min-w-0'>
                                                <span
                                                    className={cn(
                                                        'block text-sm font-semibold',
                                                        isActive
                                                            ? 'text-white'
                                                            : isRead
                                                              ? 'text-white/80'
                                                              : 'text-white/50'
                                                    )}>
                                                    {chapter.shortTitle}
                                                </span>
                                                <span className='text-slr-dim block text-[10px] tracking-widest uppercase'>
                                                    {chapter.readMinutes} Min
                                                </span>
                                            </span>
                                        </a>
                                    );
                                })}
                            </nav>

                            <div className='mt-4 h-px bg-white/10' />

                            <button
                                type='button'
                                onClick={handleShare}
                                className='text-slr-muted mt-4 flex items-center gap-2 text-xs transition-colors hover:text-white'>
                                <Share2 className='h-4 w-4' />
                                Share this guide
                            </button>
                        </div>
                    </aside>

                    {/* Main — chapter content */}
                    <div ref={contentRef} className='mx-auto max-w-2xl pb-16 md:pb-24'>
                        {chapters.map((chapter, index) => (
                            <Fragment key={chapter.num}>
                                {index > 0 && <DiamondSeparator className='py-12 md:py-16' />}

                                <article
                                    id={`chapter-${chapter.num}`}
                                    data-chapter-index={index}
                                    className='scroll-mt-24'>
                                    <div className='flex flex-wrap items-center gap-3'>
                                        <span className='text-slr-gold-label border-slr-gold-label/50 bg-slr-gold-label/10 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase'>
                                            Ch. {chapter.num}
                                        </span>
                                        <p className='text-slr-dim text-[10px] font-semibold tracking-[0.15em] uppercase'>
                                            {chapter.readMinutes} Min Read · {chapter.tag}
                                        </p>
                                    </div>

                                    <h3 className='font-bebas-neue mt-3 text-3xl tracking-wide text-white uppercase sm:text-4xl md:text-5xl'>
                                        {chapter.heading}
                                    </h3>

                                    {chapter.image && (
                                        <div className='relative mt-6 aspect-16/10 w-full overflow-hidden rounded-2xl ring-1 ring-white/10'>
                                            <Image
                                                src={chapter.image}
                                                alt=''
                                                fill
                                                sizes='(max-width: 1024px) 100vw, 680px'
                                                className='object-cover'
                                            />
                                        </div>
                                    )}

                                    <div className='mt-6 space-y-5'>
                                        <p className='text-slr-muted text-sm leading-relaxed md:text-base'>
                                            {chapter.body[0]}
                                        </p>
                                        {chapter.quote && (
                                            <blockquote className='border-slr-gold-label text-slr-gold-label border-l-[3px] py-1 pl-4 text-base font-semibold italic md:text-lg'>
                                                &ldquo;{chapter.quote}&rdquo;
                                            </blockquote>
                                        )}
                                        {chapter.body.slice(1).map((paragraph) => (
                                            <p
                                                key={paragraph}
                                                className='text-slr-muted text-sm leading-relaxed md:text-base'>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </article>
                            </Fragment>
                        ))}

                        {/* Footer — finish state */}
                        <DiamondSeparator className='mt-12 md:mt-16' />

                        <div className='mt-10 flex flex-col items-center justify-between gap-5 sm:flex-row'>
                            <button
                                type='button'
                                onClick={scrollToTop}
                                className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-white/80 uppercase transition-colors hover:bg-white/10'>
                                <ArrowUp className='h-4 w-4' />
                                Back to Top
                            </button>

                            <p className='text-slr-gold-label order-first flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase sm:order-0'>
                                <Check className='h-4 w-4' strokeWidth={3} />
                                You Finished the Blueprint
                            </p>

                            <Link
                                href='/ebooks'
                                style={goldButtonStyle}
                                className='inline-flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase transition-opacity hover:opacity-90'>
                                Next Ebook
                                <ArrowRight className='h-4 w-4' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EbookReaderSection;
