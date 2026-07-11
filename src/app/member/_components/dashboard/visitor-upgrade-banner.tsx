import Link from 'next/link';

import { goldButtonStyle } from '@/lib/styles';

import { ArrowRight, BookOpen, Gift, Sparkles, TicketPercent } from 'lucide-react';

const PERKS = [
    { icon: TicketPercent, label: 'Partner discounts' },
    { icon: Gift, label: 'RED & BLUE cash draws' },
    { icon: BookOpen, label: 'Full e-books' },
    { icon: Sparkles, label: 'BENY add-on' }
];

/** Shown only on the Visitor dashboard — nudges the free member to a paid tier. */
export function VisitorUpgradeBanner() {
    return (
        <section
            className='shadow-card-warm relative isolate overflow-hidden rounded-2xl border border-[#D4AF3759] p-5 md:p-6'
            style={{ background: 'linear-gradient(154.36deg, #140E00 0.82%, #1E1600 49.73%, #140E00 98.65%)' }}>
            <div className='pointer-events-none absolute -top-16 -right-16 -z-10 hidden size-48 rounded-full bg-[#D4AF37]/10 blur-3xl xl:block' />

            <div className='flex flex-wrap items-center justify-between gap-4'>
                <div className='max-w-2xl'>
                    <p className='text-slr-gold-label text-xs font-semibold tracking-widest uppercase'>Visitor Pass</p>
                    <h2 className='font-bebas-neue mt-1 text-2xl tracking-wide text-white uppercase md:text-3xl'>
                        Unlock the full membership
                    </h2>
                    <p className='text-slr-muted mt-1 text-sm md:text-base'>
                        You&apos;re on the free Visitor pass — upgrade to SLR RED or BLUE to unlock partner discounts,
                        e-books, cash draws and the BENY add-on.
                    </p>
                </div>

                <Link
                    href='/member/profile'
                    className='inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold uppercase transition-opacity hover:opacity-90'
                    style={goldButtonStyle}>
                    Upgrade now <ArrowRight className='size-4' />
                </Link>
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
                {PERKS.map((perk) => (
                    <span
                        key={perk.label}
                        className='text-slr-muted inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/3 px-2.5 py-1 text-xs'>
                        <perk.icon className='text-slr-gold-label size-3.5' />
                        {perk.label}
                    </span>
                ))}
            </div>
        </section>
    );
}
