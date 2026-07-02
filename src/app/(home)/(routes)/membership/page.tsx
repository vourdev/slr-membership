import { Metadata } from 'next';

import EmptyState from '@/components/common/empty-state';
import { type MembershipTiers, getMembershipTiers } from '@/lib/api/resources/memberships';

import BlueTiersSection from '../(membership)/_components/blue-tiers-section';
import RedTiersSection from '../(membership)/_components/red-tiers-section';
import DiscountSpinWheelSection from './_components/discount-spinwheel-section';
import SaveMoreWithBenySection from './_components/save-more-with-beny-section';
import SavingTodaySection from './_components/saving-today-section';
import { CircleAlert } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Membership · SLR Rewards',
    description:
        "Compare Smart Life Rewards membership tiers — Visitor (free), SLR Red ($10/mo), and SLR Premium ($26/mo). Choose the plan that's right for you."
};

const formatPrice = (cents: number) => {
    const dollars = cents / 100;

    return `$${Number.isInteger(dollars) ? dollars : dollars.toFixed(2)}`;
};

// Live prices keyed by sub_tier (R1/R4/…) — API returns lowercase codes.
const toPriceMap = (tiers: MembershipTiers): Record<string, string> =>
    [...tiers.red, ...tiers.blue].reduce<Record<string, string>>((map, tier) => {
        map[tier.sub_tier.toUpperCase()] = formatPrice(tier.price_cents);

        return map;
    }, {});

const MembershipPage = async () => {
    let tiers: MembershipTiers | null = null;
    try {
        tiers = await getMembershipTiers();
    } catch {
        tiers = null;
    }

    const hasTiers = !!tiers && (tiers.red.length > 0 || tiers.blue.length > 0);

    return (
        <main className='bg-slr-ink pt-12'>
            {hasTiers ? (
                <>
                    <RedTiersSection prices={toPriceMap(tiers!)} />
                    <BlueTiersSection prices={toPriceMap(tiers!)} />
                </>
            ) : (
                <section className='bg-slr-ink py-16 md:py-24'>
                    <div className='mx-auto max-w-7xl px-4'>
                        <EmptyState
                            icon={CircleAlert}
                            title='Pricing Unavailable'
                            description="We couldn't load membership pricing right now. Please refresh in a moment."
                        />
                    </div>
                </section>
            )}

            <SaveMoreWithBenySection />
            <DiscountSpinWheelSection />
            <SavingTodaySection />
        </main>
    );
};

export default MembershipPage;
