import { cn } from '@/lib/utils';
import type { PrizePool } from '@/types/member';

export function StageTracker({ pool }: { pool: PrizePool }) {
    const current = pool.stages.find((s) => s.stage === pool.current_stage);
    const next = pool.stages.find((s) => s.stage === pool.current_stage + 1);

    const base = current?.members_required ?? 0;
    const target = next?.members_required;
    const pct = target
        ? Math.min(100, Math.max(0, Math.round(((pool.current_members - base) / (target - base)) * 100)))
        : 100;
    const remaining = target ? Math.max(0, target - pool.current_members) : 0;

    return (
        <section className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <div className='flex flex-wrap items-end justify-between gap-2'>
                <div>
                    <p className='text-slr-gold-label text-xs font-semibold tracking-widest uppercase'>
                        Membership Stage
                    </p>
                    <p className='font-bebas-neue text-2xl tracking-wide text-white uppercase'>
                        Stage {pool.current_stage}
                    </p>
                </div>
                <p className='text-slr-muted text-sm'>
                    <span className='font-semibold text-white tabular-nums'>
                        {pool.current_members.toLocaleString('en-AU')}
                    </span>{' '}
                    paid members
                </p>
            </div>

            <div className='mt-4'>
                <div className='h-2 overflow-hidden rounded-full bg-white/5'>
                    <div className='bg-gradient-gold h-full rounded-full' style={{ width: `${pct}%` }} />
                </div>
                <p className='text-slr-dim mt-2 text-xs'>
                    {next ? (
                        <>
                            <span className='tabular-nums'>{remaining.toLocaleString('en-AU')}</span> more members until
                            Stage {next.stage}
                        </>
                    ) : (
                        'Top stage reached'
                    )}
                </p>
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
                {pool.stages.map((s) => {
                    const reached = pool.current_members >= s.members_required;
                    const isCurrent = s.stage === pool.current_stage;

                    return (
                        <span
                            key={s.stage}
                            className={cn(
                                'rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums',
                                isCurrent
                                    ? 'border-slr-gold-label/40 bg-gold-tint text-slr-gold-label'
                                    : reached
                                      ? 'border-white/10 text-white/70'
                                      : 'text-slr-dim border-white/5'
                            )}>
                            Stage {s.stage} · {s.members_required.toLocaleString('en-AU')}
                        </span>
                    );
                })}
            </div>
        </section>
    );
}
