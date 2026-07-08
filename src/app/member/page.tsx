import type { Metadata } from 'next';

import EmptyState from '@/components/common/empty-state';
import { SUB_TIERS } from '@/constant/tiers';
import { getCurrentMember } from '@/data/member-dashboard';
import { handleApiAuthError } from '@/lib/api/guard';
import { getDiscounts } from '@/lib/api/resources/discounts';
import { getEntryHistory } from '@/lib/api/resources/entries';
import { getGiveaways, toGiveaway } from '@/lib/api/resources/giveaways';
import { getMyMembership } from '@/lib/api/resources/memberships';
import { getAccessToken } from '@/lib/api/server';
import {
    cycleEndFrom,
    formatDrawDateTime,
    formatDrawPool,
    mapBillingStatus,
    subTierCodeOf,
    tierGroupOf
} from '@/lib/member';
import type { DrawStatus, FeaturedDiscount, MembershipSummary, UpcomingGiveaway } from '@/types/member';

import { DrawStatusCard } from './_components/dashboard/draw-status-card';
import { FeaturedDiscounts } from './_components/dashboard/featured-discounts';
import { Greeting } from './_components/dashboard/greeting';
import { MembershipSummaryCard } from './_components/dashboard/membership-summary-card';
import { QuickActions } from './_components/dashboard/quick-actions';
import { UpcomingGiveaways } from './_components/dashboard/upcoming-giveaways';
import { CircleAlert, Gift } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Dashboard · SLR Member'
};

export default async function MemberDashboardPage() {
    const member = await getCurrentMember();
    const token = await getAccessToken();

    // Independent authed reads — allSettled so the giveaways 500 can't blank the
    // membership/cycle/discount cards (per API-INTEGRATION.md degradation rules).
    const [membershipR, entriesR, discountsR, giveawaysR] = token
        ? await Promise.allSettled([
              getMyMembership(token),
              getEntryHistory(token),
              getDiscounts(token),
              getGiveaways(token)
          ])
        : [];

    // Any expired-session failure → force logout (never returns).
    for (const result of [membershipR, entriesR, discountsR, giveawaysR]) {
        if (result?.status === 'rejected') handleApiAuthError(result.reason);
    }

    const membership = membershipR?.status === 'fulfilled' ? membershipR.value : null;
    const cycle = entriesR?.status === 'fulfilled' ? entriesR.value.current_cycle : null;
    const discounts = discountsR?.status === 'fulfilled' ? discountsR.value : [];
    const giveaways = giveawaysR?.status === 'fulfilled' ? giveawaysR.value : [];

    const subTier = membership ? subTierCodeOf(membership.subTierId) : member.sub_tier;
    const memberGroup = tierGroupOf(subTier);

    // Summary (memberships/me + session state + cycle end for next-payment).
    const nextPayment = cycle?.end_at ?? (membership?.activatedAt ? cycleEndFrom(membership.activatedAt) : '');
    const summary: MembershipSummary = {
        sub_tier: subTier,
        state: member.state,
        billing_status: mapBillingStatus(membership?.billingStatus),
        price_cents: membership?.subTier.priceCents ?? SUB_TIERS[subTier].price_cents,
        next_payment_date: nextPayment,
        beny_addon: null // hidden until the BENY endpoint lands (SP4)
    };

    // Live draw-cycle surface (entries/ current_cycle) — real entry_status + tokens + renewal.
    const cycleDraw: DrawStatus | null = cycle
        ? {
              giveaway_id: cycle.cycle_id,
              title: 'Your Entries This Cycle',
              draw_pool: formatDrawPool(memberGroup, member.state),
              prize_label: '-',
              entry_status: cycle.entry_status,
              total_entries: cycle.total_token,
              draws_at: cycle.end_at
          }
        : null;

    // Featured partner offers — is_featured first, capped. Visitor (403) → empty → hidden.
    const featuredDiscounts: FeaturedDiscount[] = discounts
        .filter((d) => d.title?.trim() || d.partner_name?.trim())
        .sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
        .slice(0, 8)
        .map((d) => ({
            id: d.discount_id,
            brand: d.partner_name?.trim() || d.title?.trim() || '-',
            category: d.category?.trim() || '-',
            value_label: d.title?.trim() || '-'
        }));

    // Upcoming giveaways — giveaways/ 500 → empty → EmptyState.
    const upcomingGiveaways: UpcomingGiveaway[] = giveaways.slice(0, 6).map((g) => {
        const mapped = toGiveaway(g, memberGroup, member.state);

        return {
            id: mapped.id,
            title: mapped.title,
            tier_group: mapped.tier_group,
            prize_label: mapped.prize_label,
            draws_at: mapped.draws_at,
            locked: mapped.locked
        };
    });

    return (
        <div className='mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 md:px-6 md:py-8'>
            <Greeting member={member} />

            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {membership || cycle ? (
                    <MembershipSummaryCard summary={summary} className='lg:col-span-1' />
                ) : (
                    <EmptyState
                        icon={CircleAlert}
                        title='Membership Unavailable'
                        description='We couldn’t load your membership right now. Please try again shortly.'
                        className='lg:col-span-1'
                    />
                )}
                {cycleDraw ? (
                    <DrawStatusCard
                        draw={cycleDraw}
                        drawsAtLabel={formatDrawDateTime(cycleDraw.draws_at)}
                        eyebrow='Current Cycle'
                        dateWord='Renews'
                        className='lg:col-span-2'
                    />
                ) : (
                    <EmptyState
                        icon={Gift}
                        title='No Active Cycle'
                        description='Your draw cycle will appear here once your membership is active.'
                        className='lg:col-span-2'
                    />
                )}
            </div>

            <QuickActions />

            {featuredDiscounts.length > 0 && <FeaturedDiscounts discounts={featuredDiscounts} />}

            {upcomingGiveaways.length > 0 ? (
                <UpcomingGiveaways giveaways={upcomingGiveaways} />
            ) : (
                <EmptyState
                    icon={Gift}
                    title='No Upcoming Giveaways'
                    description='Active draws for your tier will show here soon.'
                />
            )}
        </div>
    );
}
