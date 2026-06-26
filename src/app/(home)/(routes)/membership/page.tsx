import { Metadata } from 'next';

import BlueTiersSection from '../(membership)/_components/blue-tiers-section';
import RedTiersSection from '../(membership)/_components/red-tiers-section';
import DiscountSpinWheelSection from './_components/discount-spinwheel-section';
import SaveMoreWithBenySection from './_components/save-more-with-beny-section';
import SavingTodaySection from './_components/saving-today-section';

export const metadata: Metadata = {
    title: 'Membership · SLR Rewards',
    description:
        "Compare Smart Life Rewards membership tiers — Visitor (free), SLR Red ($10/mo), and SLR Premium ($26/mo). Choose the plan that's right for you."
};

const MembershipPage = () => {
    return (
        <main className='bg-slr-ink pt-12'>
            <RedTiersSection />
            <BlueTiersSection />
            <SaveMoreWithBenySection />
            <DiscountSpinWheelSection />
            <SavingTodaySection />
        </main>
    );
};

export default MembershipPage;
