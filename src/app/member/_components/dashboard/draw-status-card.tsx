import { CountdownBoxes } from '@/components/common/countdown';
import { EntryStatusBadge } from '@/components/common/entry-status-badge';
import { cn } from '@/lib/utils';
import type { DrawStatus } from '@/types/member';

import { MapPin, Ticket, Trophy } from 'lucide-react';

interface DrawStatusCardProps {
    draw: DrawStatus;
    // Preformatted on the server so SSR and client markup match (timezone-safe).
    drawsAtLabel: string;
    className?: string;
}

export function DrawStatusCard({ draw, drawsAtLabel, className }: DrawStatusCardProps) {
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
                <CountdownBoxes targetIso={draw.draws_at} />
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
