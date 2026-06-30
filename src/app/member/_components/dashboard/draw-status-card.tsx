'use client';

import { EntryStatusBadge } from '@/components/common/entry-status-badge';
import { useCountdown } from '@/hooks/use-countdown';
import { cn } from '@/lib/utils';
import type { DrawStatus } from '@/types/member';

import { MapPin, Ticket, Trophy } from 'lucide-react';

function Unit({ value, label, mounted }: { value: number; label: string; mounted: boolean }) {
    return (
        <div className='flex flex-col items-center gap-1'>
            <span className='border-slr-navy-border flex h-12 w-full items-center justify-center rounded-lg border bg-black/30 md:h-14'>
                <span className='font-bebas-neue text-xl leading-none text-white tabular-nums sm:text-2xl md:text-3xl'>
                    {mounted ? String(value).padStart(2, '0') : '--'}
                </span>
            </span>
            <span className='text-slr-dim text-[9px] tracking-widest uppercase sm:text-[10px]'>{label}</span>
        </div>
    );
}

interface DrawStatusCardProps {
    draw: DrawStatus;
    // Preformatted on the server so SSR and client markup match (avoids a
    // timezone-dependent hydration mismatch — the countdown digits below are
    // already guarded by `mounted`).
    drawsAtLabel: string;
    className?: string;
}

export function DrawStatusCard({ draw, drawsAtLabel, className }: DrawStatusCardProps) {
    const { days, hours, minutes, seconds, done, mounted } = useCountdown(draw.draws_at);

    return (
        <div
            className={cn(
                'bg-card-dark-navy border-slr-navy-border shadow-card-warm relative isolate overflow-hidden rounded-2xl border p-5 md:p-6',
                className
            )}>
            {/* decorative glow */}
            <div className='pointer-events-none absolute -top-16 -right-16 -z-10 hidden size-48 rounded-full bg-[#D4AF37]/10 blur-3xl xl:block' />

            <div className='flex items-start justify-between gap-2'>
                <p className='text-slr-gold-label text-xs font-semibold tracking-widest uppercase'>Current Draw</p>
                <EntryStatusBadge status={draw.entry_status} />
            </div>

            <h3 className='font-bebas-neue mt-2 text-2xl tracking-wide text-white uppercase md:text-3xl'>
                {draw.title}
            </h3>
            <div className='text-slr-muted mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm'>
                <span className='inline-flex items-center gap-1.5'>
                    <MapPin className='size-4' /> {draw.draw_pool}
                </span>
                <span className='inline-flex items-center gap-1.5'>
                    <Ticket className='size-4' />
                    <span className='tabular-nums'>{draw.total_entries.toLocaleString('en-AU')}</span> entries
                </span>
            </div>

            <div className='mt-5'>
                {done ? (
                    <div className='inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400'>
                        <span className='size-2 animate-pulse rounded-full bg-emerald-400' />
                        Drawing now…
                    </div>
                ) : (
                    <div className='grid max-w-xs grid-cols-4 gap-1.5 sm:gap-2'>
                        <Unit value={days} label='Days' mounted={mounted} />
                        <Unit value={hours} label='Hrs' mounted={mounted} />
                        <Unit value={minutes} label='Min' mounted={mounted} />
                        <Unit value={seconds} label='Sec' mounted={mounted} />
                    </div>
                )}
            </div>

            <div className='mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-4'>
                <span className='inline-flex items-center gap-2 font-semibold'>
                    <Trophy className='text-slr-gold-label size-4' />
                    <span className='text-gradient-gold'>{draw.prize_label}</span>
                </span>
                <span className='text-slr-dim text-xs'>Draws {drawsAtLabel}</span>
            </div>
        </div>
    );
}
