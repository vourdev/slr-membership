import { type Discount, getPublicDiscounts } from '@/lib/api/resources/discounts';
import { type PartnerLogo, comparePartnerLogos, getPublicPartnerLogos } from '@/lib/api/resources/partner-logos';

import CurrentPrizesSection from './_components/current-prizes-section';
import DrawCountdownSection from './_components/draw-countdown-section';
import HeroSection from './_components/hero-section';
import HowItWorksSection from './_components/how-it-works-section';
import MoreMembersSection from './_components/more-members-section';
import PartnersSection from './_components/partners-section';
import SavingTiersSection from './_components/saving-tiers-section';
import SlrRedBlueTiersSpinWheelSection from './_components/slr-red-blue-tiers-spin-wheel-section';
import TrustedSection from './_components/trusted-section';

const MembershipPage = async () => {
    const [partners, publicDiscounts] = await Promise.all([
        getPublicPartnerLogos().catch(() => [] as PartnerLogo[]),
        getPublicDiscounts().catch(() => [] as Discount[])
    ]);

    // Community Givebacks logos are managed on their own now (CMS-01). Until an admin adds
    // some, keep showing the discount logos the section used before rather than going blank.
    const managedLogos = [...partners]
        .filter((p) => p.logo_url?.trim())
        .sort(comparePartnerLogos)
        .map((p) => ({ src: p.logo_url.trim(), alt: p.name || 'Partner logo' }));
    const discountLogos = publicDiscounts
        .filter((d) => d.logo_url?.trim())
        .map((d) => ({ src: d.logo_url!.trim(), alt: d.partner_name || 'Partner logo' }));
    const partnerLogos = managedLogos.length > 0 ? managedLogos : discountLogos;

    return (
        <main className='bg-slr-ink min-h-screen'>
            <HeroSection />
            <HowItWorksSection />
            <CurrentPrizesSection />
            <PartnersSection logos={partnerLogos} />
            <MoreMembersSection />
            <TrustedSection />
            <SlrRedBlueTiersSpinWheelSection />
            <SavingTiersSection />
            <DrawCountdownSection />
        </main>
    );
};

export default MembershipPage;
