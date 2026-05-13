import BlueTiersSection from './_components/blue-tiers-section';
import DiscountPartnerSection from './_components/discount-partner-section';
import HeroSection from './_components/hero-section';
import MembershipCtaSection from './_components/membership-cta-section';
import PartnersSection from './_components/partners-section';
import PricingSection from './_components/pricing-section';
import RedTiersSection from './_components/red-tiers-section';
import TrustedSection from './_components/trusted-section';
import WelcomeSection from './_components/welcome-section';
import WhyJoinSection from './_components/why-join-section';

const MembershipPage = () => {
    return (
        <main className='bg-slr-navy-deep min-h-screen'>
            <HeroSection />
            <WelcomeSection />
            <WhyJoinSection />
            <div id='tiers'>
                <RedTiersSection />
                <BlueTiersSection />
            </div>
            <DiscountPartnerSection />
            <PricingSection />
            <TrustedSection />
            <PartnersSection />
            <MembershipCtaSection />
        </main>
    );
};

export default MembershipPage;
