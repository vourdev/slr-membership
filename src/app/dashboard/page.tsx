import type { FC } from 'react';

import DashboardEmptyState from '@/app/dashboard/_components/dashboard-empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiAuthError } from '@/lib/api/guard';
import { type AdminDashboardMetrics, getAdminDashboardMetrics } from '@/lib/api/resources/admin';
import { getAccessToken } from '@/lib/api/server';

import { AlertTriangle, CircleAlert, CreditCard, DollarSign, Gift, type LucideIcon, Users } from 'lucide-react';

const StatCard: FC<{ label: string; value: string; icon: LucideIcon; hint?: string }> = ({
    label,
    value,
    icon: Icon,
    hint
}) => (
    <Card className='h-full'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{label}</CardTitle>
            <Icon className='text-muted-foreground size-4 shrink-0' />
        </CardHeader>
        <CardContent>
            <div className='text-2xl font-bold tabular-nums'>{value}</div>
            <p className='text-muted-foreground min-h-4 text-xs'>{hint ?? ''}</p>
        </CardContent>
    </Card>
);

const Breakdown: FC<{ title: string; rows: { label: string; count: number }[] }> = ({ title, rows }) => (
    <Card className='h-full'>
        <CardHeader>
            <CardTitle className='text-base'>{title}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 text-sm'>
            {rows.length === 0 ? (
                <p className='text-muted-foreground'>No data.</p>
            ) : (
                rows.map((r) => (
                    <div key={r.label} className='flex items-center justify-between'>
                        <span className='text-muted-foreground uppercase'>{r.label}</span>
                        <span className='font-semibold tabular-nums'>{r.count.toLocaleString()}</span>
                    </div>
                ))
            )}
        </CardContent>
    </Card>
);

const formatMrr = (cents: number) => `$${Math.round(cents / 100).toLocaleString('en-AU')}`;

// The API can return several rows sharing a label (e.g. r4 and b4 both map to
// tier "Plus"). Merge them so counts sum and each row key stays unique.
const aggregateByLabel = (rows: { label: string; count: number }[]) => {
    const totals = new Map<string, number>();
    for (const { label, count } of rows) {
        const key = label || '-';
        totals.set(key, (totals.get(key) ?? 0) + (count || 0));
    }

    return Array.from(totals, ([label, count]) => ({ label, count }));
};

export default async function DashboardHome() {
    const token = await getAccessToken();

    let data: AdminDashboardMetrics | null = null;
    try {
        data = token ? await getAdminDashboardMetrics(token) : null;
    } catch (error) {
        handleApiAuthError(error); // expired session → force logout
        data = null;
    }

    if (!data) {
        return (
            <div className='px-4 py-8 md:px-6'>
                <DashboardEmptyState
                    icon={CircleAlert}
                    title='Dashboard unavailable'
                    description='Could not load admin metrics right now. Please try again shortly.'
                />
            </div>
        );
    }

    return (
        <div className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6'>
            <div>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>Dashboard</h1>
                <p className='text-muted-foreground text-sm'>Platform overview & metrics.</p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                <StatCard label='Total Members' value={data.total_members.toLocaleString()} icon={Users} />
                <StatCard
                    label='Active Subscriptions'
                    value={data.active_subscriptions.toLocaleString()}
                    icon={CreditCard}
                />
                <StatCard label='Monthly Recurring Revenue' value={formatMrr(data.mrr_cents)} icon={DollarSign} />
                <StatCard
                    label='Failed Payments (30d)'
                    value={data.alerts.failed_payments_30d.toLocaleString()}
                    icon={AlertTriangle}
                    hint={`${data.alerts.pending_beny_activations} pending BENY activations`}
                />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
                <Breakdown
                    title='Members by Tier'
                    rows={aggregateByLabel(data.members_by_tier.map((t) => ({ label: t.tier, count: t.count })))}
                />
                <Breakdown
                    title='Members by State'
                    rows={aggregateByLabel(data.members_by_state.map((s) => ({ label: s.state, count: s.count })))}
                />
            </div>

            <p className='text-muted-foreground flex items-center gap-2 text-xs'>
                <Gift className='size-3.5' /> Draws, winners & TPAL export live under their own admin sections.
            </p>
        </div>
    );
}
