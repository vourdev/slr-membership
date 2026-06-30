import type { Metadata } from 'next';

import { getMemberDashboard } from '@/data/member-dashboard';
import { formatDrawDateTime } from '@/lib/member';

import { DrawStatusCard } from './_components/dashboard/draw-status-card';
import { FeaturedDiscounts } from './_components/dashboard/featured-discounts';
import { Greeting } from './_components/dashboard/greeting';
import { MembershipSummaryCard } from './_components/dashboard/membership-summary-card';
import { QuickActions } from './_components/dashboard/quick-actions';
import { UpcomingGiveaways } from './_components/dashboard/upcoming-giveaways';

export const metadata: Metadata = {
    title: 'Dashboard · SLR Member'
};

export default async function MemberDashboardPage() {
    const data = await getMemberDashboard();

    return (
        <div className='mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 md:px-6 md:py-8'>
            <Greeting member={data.member} />

            <div className='grid gap-4 lg:grid-cols-3'>
                <MembershipSummaryCard summary={data.summary} className='lg:col-span-1' />
                <DrawStatusCard
                    draw={data.draw}
                    drawsAtLabel={formatDrawDateTime(data.draw.draws_at)}
                    className='lg:col-span-2'
                />
            </div>

            <QuickActions />

            <FeaturedDiscounts discounts={data.featured_discounts} />

            <UpcomingGiveaways giveaways={data.upcoming_giveaways} />
        </div>
    );
}
