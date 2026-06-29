import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { CalendarClock, Coins, Crown, Sparkles, Tag, Ticket, Trophy } from 'lucide-react';

// Dummy data — swap for API once auth/data endpoints are ready.
const member = {
    name: 'SLR Admin',
    tier: 'SLR Blue',
    tierLabel: 'Premium',
    tokens: 1250,
    spinAvailable: true,
    cycleProgress: 64
};

const entry = {
    count: 26,
    status: 'Active',
    pool: 'SLR Blue · NSW',
    resets: '1 Jul 2026'
};

const nextDraw = {
    date: 'Sat, 5 Jul 2026',
    time: '8:00 PM AEST',
    pool: 'SLR Blue · NSW',
    prizePool: '$24,000',
    entriesInPool: '1,840'
};

const discounts = [
    { brand: 'Coles', category: 'Groceries', value: '5% off' },
    { brand: 'BP', category: 'Fuel', value: '4¢ / L' },
    { brand: 'JB Hi-Fi', category: 'Electronics', value: '10% off' },
    { brand: 'Woolworths', category: 'Groceries', value: '5% off' }
];

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>{label}</span>
            {children}
        </div>
    );
}

export default function DashboardHome() {
    return (
        <div className='flex flex-1 flex-col gap-6 px-4 py-6 md:px-6'>
            {/* Header */}
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>Welcome back, {member.name}</h1>
                    <p className='text-muted-foreground text-sm'>Your SLR membership &amp; draw summary.</p>
                </div>
                <Badge variant='outline' className='border-slr-gold-label/40 text-slr-gold-label gap-1'>
                    <Crown className='size-3.5' /> {member.tier} · {member.tierLabel}
                </Badge>
            </div>

            {/* Summary cards */}
            <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
                {/* Tier & Token Summary */}
                <Card>
                    <CardHeader>
                        <CardDescription>Tier &amp; Token Summary</CardDescription>
                        <CardTitle className='flex items-center gap-2 text-2xl font-semibold tabular-nums'>
                            <Coins className='text-slr-gold-label size-5' /> {member.tokens.toLocaleString()} Tokens
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3 text-sm'>
                        <Row label='Current tier'>
                            <span className='font-medium'>{member.tier}</span>
                        </Row>
                        <div className='space-y-1.5'>
                            <div className='text-muted-foreground flex justify-between text-xs'>
                                <span>Cycle progress</span>
                                <span>{member.cycleProgress}%</span>
                            </div>
                            <Progress value={member.cycleProgress} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Badge variant='outline' className='gap-1'>
                            <Sparkles className='size-3.5' />
                            {member.spinAvailable ? 'Spin available' : 'Spin used'}
                        </Badge>
                    </CardFooter>
                </Card>

                {/* Entry Status */}
                <Card>
                    <CardHeader>
                        <CardDescription>Entry Status</CardDescription>
                        <CardTitle className='flex items-center gap-2 text-2xl font-semibold tabular-nums'>
                            <Ticket className='text-slr-gold-label size-5' /> {entry.count} Entries
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                        <Row label='Status'>
                            <Badge className='border-transparent bg-emerald-600/15 text-emerald-500'>
                                {entry.status}
                            </Badge>
                        </Row>
                        <Row label='Draw pool'>
                            <span className='font-medium'>{entry.pool}</span>
                        </Row>
                        <Row label='Cycle reset'>
                            <span className='font-medium'>{entry.resets}</span>
                        </Row>
                    </CardContent>
                    <CardFooter className='text-muted-foreground text-xs'>Entries reset each cycle.</CardFooter>
                </Card>

                {/* Next Draw */}
                <Card className='md:col-span-2 xl:col-span-1'>
                    <CardHeader>
                        <CardDescription>Next Draw</CardDescription>
                        <CardTitle className='flex items-center gap-2 text-2xl font-semibold'>
                            <CalendarClock className='text-slr-gold-label size-5' /> {nextDraw.date}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                        <Row label='Time'>
                            <span className='font-medium'>{nextDraw.time}</span>
                        </Row>
                        <Row label='Pool'>
                            <span className='font-medium'>{nextDraw.pool}</span>
                        </Row>
                        <Row label='Total prize'>
                            <span className='text-slr-gold-label flex items-center gap-1 font-semibold'>
                                <Trophy className='size-4' />
                                {nextDraw.prizePool}
                            </span>
                        </Row>
                        <Row label='Entries in pool'>
                            <span className='font-medium'>{nextDraw.entriesInPool}</span>
                        </Row>
                    </CardContent>
                </Card>
            </div>

            {/* Featured Discounts */}
            <div className='space-y-3'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                    <h2 className='text-lg font-semibold'>Featured Discounts</h2>
                    <span className='text-muted-foreground text-sm'>Selected partner offers</span>
                </div>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {discounts.map((d) => (
                        <Card key={d.brand}>
                            <CardHeader>
                                <div className='bg-gold-tint flex size-10 items-center justify-center rounded-xl border border-[#D4AF3759]'>
                                    <Tag className='text-slr-gold-label size-5' />
                                </div>
                                <CardTitle className='pt-2 text-base'>{d.brand}</CardTitle>
                                <CardDescription>{d.category}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Badge variant='outline' className='border-slr-gold-label/40 text-slr-gold-label'>
                                    {d.value}
                                </Badge>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
