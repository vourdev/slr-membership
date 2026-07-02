import type { FC } from 'react';

import EmptyState from '@/components/common/empty-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleApiAuthError } from '@/lib/api/guard';
import { type AdminDashboard, getAdminDashboard } from '@/lib/api/resources/admin';
import { getAccessToken } from '@/lib/api/server';

import { AlertTriangle, CircleAlert, CreditCard, DollarSign, Gift, type LucideIcon, Users } from 'lucide-react';

const StatCard: FC<{ label: string; value: string; icon: LucideIcon; hint?: string }> = ({
    label,
    value,
    icon: Icon,
    hint
}) => (
    <Card>
        <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className='flex items-center gap-2 text-2xl font-semibold tabular-nums'>
                <Icon className='text-slr-gold-label size-5' /> {value}
            </CardTitle>
        </CardHeader>
        {hint && <CardContent className='text-muted-foreground -mt-2 text-xs'>{hint}</CardContent>}
    </Card>
);

const Breakdown: FC<{ title: string; rows: { label: string; count: number }[] }> = ({ title, rows }) => (
    <Card>
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

export default async function DashboardHome() {
    const token = await getAccessToken();

    let data: AdminDashboard | null = null;
    try {
        data = token ? await getAdminDashboard(token) : null;
    } catch (error) {
        handleApiAuthError(error); // expired session → force logout
        data = null;
    }

    if (!data) {
        return (
            <div className='px-4 py-8 md:px-6'>
                <EmptyState
                    icon={CircleAlert}
                    title='Dashboard Unavailable'
                    description='Could not load admin metrics right now. Please try again shortly.'
                />
            </div>
        );
    }

    return (
        <div className='flex flex-1 flex-col gap-6 px-4 py-6 md:px-6'>
            <div>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>Dashboard</h1>
                <p className='text-muted-foreground text-sm'>Platform overview & metrics.</p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
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
                    rows={data.members_by_tier.map((t) => ({ label: t.tier, count: t.count }))}
                />
                <Breakdown
                    title='Members by State'
                    rows={data.members_by_state.map((s) => ({ label: s.state, count: s.count }))}
                />
            </div>

            <p className='text-muted-foreground flex items-center gap-2 text-xs'>
                <Gift className='size-3.5' /> Draws, winners & TPAL export live under their own admin sections.
            </p>
        </div>
    );
}
