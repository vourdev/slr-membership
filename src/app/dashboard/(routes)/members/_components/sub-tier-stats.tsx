import type { FC } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SubTierCount } from '@/lib/api/resources/memberships';

// Sub-tier id → readable label. Token counts per CLAUDE.md tier table.
const SUB_TIER_LABEL: Record<string, string> = {
    visitor: 'Visitor',
    r1: 'RED · 1 tok',
    r4: 'RED · 4 tok',
    r7: 'RED · 7 tok',
    b1: 'BLUE · 1 tok',
    b4: 'BLUE · 4 tok',
    b7: 'BLUE · 7 tok',
    b10: 'BLUE · 10 tok'
};

const labelFor = (subTierId: string): string =>
    SUB_TIER_LABEL[subTierId] ?? (subTierId === '-' ? '-' : subTierId.toUpperCase());

const chipAccent = (subTierId: string): string => {
    if (subTierId.startsWith('r')) return 'border-slr-red-tier/40 text-slr-red-tier';
    if (subTierId.startsWith('b')) return 'border-slr-blue-tier/40 text-slr-blue-tier';

    return 'border-slr-navy-border text-slr-dim';
};

export const SubTierStats: FC<{ counts: SubTierCount[]; total: number }> = ({ counts, total }) => (
    <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base'>Members by Sub-Tier</CardTitle>
            <span className='text-2xl font-bold tabular-nums'>{total.toLocaleString()}</span>
        </CardHeader>
        <CardContent>
            {counts.length === 0 ? (
                <p className='text-muted-foreground text-sm'>No members yet.</p>
            ) : (
                <div className='flex flex-wrap gap-2'>
                    {counts.map((c) => (
                        <span
                            key={c.subTierId}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${chipAccent(c.subTierId)}`}>
                            <span className='uppercase'>{labelFor(c.subTierId)}</span>
                            <span className='font-semibold tabular-nums'>{c.count.toLocaleString()}</span>
                        </span>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
);
