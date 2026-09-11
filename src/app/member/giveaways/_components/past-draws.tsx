import EmptyState from '@/components/common/empty-state';
import { TIER_VISUALS } from '@/constant/tiers';
import { type GiveawayWinner, tierGroupFromApi } from '@/lib/api/resources/giveaways';
import { formatShortDate } from '@/lib/member';
import type { Giveaway } from '@/types/member';

import { Clock, Trophy } from 'lucide-react';

const timeMs = (iso: string | null | undefined): number => {
    const parsed = Date.parse(iso ?? '');

    return Number.isNaN(parsed) ? 0 : parsed;
};

export function sortPastDraws(winners: GiveawayWinner[]): GiveawayWinner[] {
    return [...winners].sort(
        (a, b) => timeMs(b.recorded_at ?? b.giveaway?.draws_at) - timeMs(a.recorded_at ?? a.giveaway?.draws_at)
    );
}

function PastDrawCard({ winner }: { winner: GiveawayWinner }) {
    const group = tierGroupFromApi(winner.giveaway?.tier ?? '');
    const visual = TIER_VISUALS[group];
    const drawnAt = winner.recorded_at ?? winner.giveaway?.draws_at ?? '';

    return (
        <article className='border-slr-navy-border bg-card-dark-navy shadow-card-soft flex flex-col gap-3 rounded-2xl border p-4 md:p-5'>
            <div className='flex items-start justify-between gap-3'>
                <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${visual.textClass}`}
                    style={{ background: visual.badgeBg, borderColor: visual.badgeBorder }}>
                    {visual.label}
                </span>
                <span className='text-slr-dim text-[10px] tracking-widest uppercase'>
                    {drawnAt ? formatShortDate(drawnAt) : '-'}
                </span>
            </div>

            <div className='space-y-1'>
                <p className='text-gradient-gold text-lg font-bold md:text-xl'>{winner.prize?.trim() || '-'}</p>
                <p className='text-slr-dim line-clamp-1 text-xs'>{winner.giveaway?.name?.trim() || '-'}</p>
            </div>

            <div className='mt-auto border-t border-white/5 pt-3'>
                <p className='text-sm font-semibold text-white/90'>{winner.full_name?.trim() || '-'}</p>
                <p className='text-slr-dim text-xs'>{winner.state?.trim() || '-'}</p>
            </div>
        </article>
    );
}

function PendingDrawCard({ giveaway }: { giveaway: Giveaway }) {
    const visual = TIER_VISUALS[giveaway.tier_group];
    const drawnAt = giveaway.draws_at;

    return (
        <article className='border-slr-navy-border bg-card-dark-navy shadow-card-soft relative flex flex-col gap-3 overflow-hidden rounded-2xl border p-4 opacity-70 md:p-5'>
            <div className='absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none' />
            <div className='flex items-start justify-between gap-3'>
                <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${visual.textClass}`}
                    style={{ background: visual.badgeBg, borderColor: visual.badgeBorder }}>
                    {visual.label}
                </span>
                <span className='text-slr-dim text-[10px] tracking-widest uppercase'>
                    {drawnAt ? formatShortDate(drawnAt) : '-'}
                </span>
            </div>

            <div className='space-y-1'>
                <p className='text-gradient-gold text-lg font-bold md:text-xl'>{giveaway.prize_label}</p>
                <p className='text-slr-dim line-clamp-1 text-xs'>{giveaway.title}</p>
            </div>

            <div className='mt-auto border-t border-white/5 pt-3'>
                <p className='inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400/80'>
                    <Clock className='size-3.5' /> Results Pending
                </p>
                <p className='text-slr-dim text-xs'>Winner verification in progress</p>
            </div>
        </article>
    );
}

interface PastDrawsProps {
    winners: GiveawayWinner[];
    drawnGiveaways?: Giveaway[];
}

export function PastDraws({ winners, drawnGiveaways = [] }: PastDrawsProps) {
    const sorted = sortPastDraws(winners);

    // Giveaways whose draw has happened but no winner record exists yet
    const winnerGiveawayIds = new Set(winners.map((w) => w.giveaway?.giveaway_id).filter(Boolean));
    const pendingDraws = drawnGiveaways.filter((g) => !winnerGiveawayIds.has(g.id));

    const hasContent = sorted.length > 0 || pendingDraws.length > 0;

    return (
        <section className='space-y-4'>
            <header className='space-y-1'>
                <h2 className='font-bebas-neue text-2xl tracking-wide uppercase sm:text-3xl'>Past Draws</h2>
                <p className='text-slr-muted text-sm md:text-base'>
                    Winners already drawn across every SLR pool.
                </p>
            </header>

            {!hasContent ? (
                <EmptyState
                    icon={Trophy}
                    title='No Past Draws Yet'
                    description='Winners appear here once a draw has been run.'
                />
            ) : (
                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                    {pendingDraws.map((g) => (
                        <PendingDrawCard key={g.id} giveaway={g} />
                    ))}
                    {sorted.map((winner) => (
                        <PastDrawCard key={winner.winner_id} winner={winner} />
                    ))}
                </div>
            )}
        </section>
    );
}
