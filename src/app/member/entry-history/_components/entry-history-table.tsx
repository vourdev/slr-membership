import { EntryStatusBadge } from '@/components/common/entry-status-badge';
import { TierBadge } from '@/components/common/tier-badge';
import { SUB_TIERS } from '@/constant/tiers';
import { cn } from '@/lib/utils';
import type { EntryHistoryEntry, SubTierCode, TierChange } from '@/types/member';

import { ArrowDown, ArrowUp } from 'lucide-react';

function TierChangeBadge({ change, from }: { change: TierChange; from?: SubTierCode }) {
    if (!change) return null;
    const up = change === 'upgrade';

    return (
        <span
            className={cn(
                'inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs font-semibold uppercase',
                up
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            )}>
            {up ? <ArrowUp className='size-3' /> : <ArrowDown className='size-3' />}
            {up ? 'Upgrade' : 'Downgrade'}
            {from && <span className='font-normal opacity-80'>from {SUB_TIERS[from].label}</span>}
        </span>
    );
}

function tokenText(value: number, prefix = ''): string {
    return value > 0 ? `${prefix}${value}` : '—';
}

export function EntryHistoryTable({ entries }: { entries: EntryHistoryEntry[] }) {
    return (
        <>
            {/* Desktop table */}
            <div className='bg-card-dark-navy border-slr-navy-border hidden overflow-hidden rounded-2xl border md:block'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='border-slr-navy-border text-slr-dim border-b text-xs tracking-wider uppercase'>
                            <th className='px-4 py-3 text-left font-medium'>Cycle</th>
                            <th className='px-4 py-3 text-left font-medium'>Tier</th>
                            <th className='px-4 py-3 text-right font-medium'>Base</th>
                            <th className='px-4 py-3 text-right font-medium'>Referral</th>
                            <th className='px-4 py-3 text-right font-medium'>Total</th>
                            <th className='px-4 py-3 text-left font-medium'>Entry Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((e) => (
                            <tr key={e.id} className='border-slr-navy-border/50 border-b last:border-0'>
                                <td className='px-4 py-3'>
                                    <p className='font-medium text-white'>{e.cycle_label}</p>
                                    <p className='text-slr-dim text-xs'>{e.cycle_range}</p>
                                </td>
                                <td className='px-4 py-3'>
                                    <div className='flex items-center gap-2'>
                                        <TierBadge subTier={e.sub_tier} size='sm' />
                                        <TierChangeBadge change={e.tier_change} from={e.changed_from} />
                                    </div>
                                </td>
                                <td className='px-4 py-3 text-right text-white/90 tabular-nums'>
                                    {tokenText(e.base_tokens)}
                                </td>
                                <td className='px-4 py-3 text-right text-white/90 tabular-nums'>
                                    {tokenText(e.referral_bonus, '+')}
                                </td>
                                <td className='px-4 py-3 text-right font-semibold text-white tabular-nums'>
                                    {e.total_tokens}
                                </td>
                                <td className='px-4 py-3'>
                                    <EntryStatusBadge status={e.entry_status} />
                                    {e.inactive_reason && (
                                        <p className='text-slr-dim mt-1 text-xs'>{e.inactive_reason}</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className='space-y-3 md:hidden'>
                {entries.map((e) => (
                    <div key={e.id} className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-4'>
                        <div className='flex items-start justify-between gap-2'>
                            <div>
                                <p className='font-medium text-white'>{e.cycle_label}</p>
                                <p className='text-slr-dim text-xs'>{e.cycle_range}</p>
                            </div>
                            <EntryStatusBadge status={e.entry_status} />
                        </div>

                        <div className='mt-3 flex flex-wrap items-center gap-2'>
                            <TierBadge subTier={e.sub_tier} size='sm' />
                            <TierChangeBadge change={e.tier_change} from={e.changed_from} />
                        </div>

                        <div className='mt-3 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center'>
                            <div>
                                <p className='text-slr-dim text-xs uppercase'>Base</p>
                                <p className='text-white tabular-nums'>{tokenText(e.base_tokens)}</p>
                            </div>
                            <div>
                                <p className='text-slr-dim text-xs uppercase'>Referral</p>
                                <p className='text-white tabular-nums'>{tokenText(e.referral_bonus, '+')}</p>
                            </div>
                            <div>
                                <p className='text-slr-dim text-xs uppercase'>Total</p>
                                <p className='font-semibold text-white tabular-nums'>{e.total_tokens}</p>
                            </div>
                        </div>

                        {e.inactive_reason && <p className='text-slr-dim mt-2 text-xs'>{e.inactive_reason}</p>}
                    </div>
                ))}
            </div>
        </>
    );
}
