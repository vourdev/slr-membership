import React from 'react';

import Image from 'next/image';

import GoldCtaButton from '@/components/common/gold-cta-button';
import SectionEyebrow from '@/components/common/section-eyebrow';
import SectionHeading from '@/components/common/section-heading';
import TierUpgradeCard from '@/components/common/tier-upgrade-card';

const redBenefits = {
    perks: [
        'Up to 7 prize draws every week',
        'Affiliated discounts',
        'Member-only deals',
        'Exclusive monthly mega draw'
    ],
    rewards: ['Digital offers', '$10 cash credit', '$50 voucher', '$100 prize ballot']
};

// ─── Upgrade card styles — each tier has its own gradient + border ──────────

const redCardStyle: React.CSSProperties = {
    background: 'linear-gradient(154.36deg, #1C0308 0.82%, #2A0810 49.73%, #1A0306 98.65%)',
    border: '1px solid #C8152E66',
    boxShadow: '0px 0px 13px 0px #776D6D26'
};

const redBadgeStyle: React.CSSProperties = {
    background: '#C8152E1A',
    border: '1px solid #C8152E4D'
};

const goldCardStyle: React.CSSProperties = {
    background: 'linear-gradient(154.36deg, #140E00 0.82%, #1E1600 49.73%, #140E00 98.65%)',
    border: '1px solid #D4AF3759',
    boxShadow: '0px 0px 13px 0px #776D6D26'
};

const goldBadgeStyle: React.CSSProperties = {
    background: '#D4AF370D',
    border: '1px solid #D4AF374D'
};

const blackCardStyle: React.CSSProperties = {
    background:
        'linear-gradient(#181818, #181818) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.096) 0%, rgba(255, 255, 255, 0.056) 50%, rgba(255, 255, 255, 0.056) 100%) border-box',
    border: '1px solid transparent',
    boxShadow: '0px 0px 13px 0px #776D6D26'
};

const blackBadgeStyle: React.CSSProperties = {
    background: '#FFFFFF0D',
    border: '1px solid #FFFFFF1A'
};

const RedTiersSection = () => {
    return (
        <section className='bg-slr-navy-deep relative isolate overflow-hidden py-16 md:py-24'>
            {/* Decorative background — red-300 radial glow, left side, slightly raised
                behind the SLR Red main card. Hidden on mobile to avoid clutter. */}
            <div
                aria-hidden='true'
                className='pointer-events-none absolute top-30 left-0 -z-10 hidden h-143 w-143 rounded-full bg-[radial-gradient(circle,rgba(252,165,165,0.45)_0%,rgba(252,165,165,0.18)_1%,transparent_70%)] mix-blend-screen blur-3xl xl:block'
            />

            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <SectionEyebrow label='Member Prize Tiers' color='#DC2626' lineColor='#D0302F' className='mt-4' />

                    <SectionHeading className='mt-2'>
                        SLR <span className='text-red-600'>RED</span> Reward Tiers
                    </SectionHeading>

                    <p className='text-slr-muted mt-2 text-center text-sm leading-relaxed xl:text-base'>
                        Member prize tickets are base on your tier level.
                    </p>
                </div>

                <div className='mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Main red card — gradient border via masked overlay */}
                    <div className='shadow-card-warm-lg relative isolate rounded-2xl p-1.25'>
                        <div
                            className='absolute inset-0 -z-10 rounded-2xl bg-[linear-gradient(180deg,#FF6B7A_10%,#C8152E_25%,#8B0010_75.24%,#C8152E_87.62%,#FF6B7A_100%)] mask-exclude p-1.25 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]'
                            aria-hidden='true'
                        />
                        <div className='relative overflow-hidden rounded-[calc(1rem-5px)] bg-[linear-gradient(180deg,#530710_0%,#37040D_30%,#220408_60%,#470818_87.62%)] p-4 sm:p-6'>
                            {/* Header */}
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
                                    <Image
                                        src='/icons/ic-slr-red-reward.webp'
                                        alt='SLR Red'
                                        width={100}
                                        height={100}
                                        className='h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20 md:h-25 md:w-25'
                                    />
                                    <div className='flex min-w-0 flex-col'>
                                        <div className='flex flex-wrap items-baseline gap-1 sm:gap-2'>
                                            <p className='font-bebas-neue text-2xl font-extrabold text-white sm:text-3xl'>
                                                SLR RED <span className='text-gradient-gold font-extrabold'>10$</span>
                                            </p>
                                            <span className='text-xs font-normal text-white/60 sm:text-sm'>/month</span>
                                        </div>
                                        <p className='text-slr-muted text-xs leading-relaxed sm:text-sm'>
                                            4 to 7 prize chances per draw
                                        </p>
                                    </div>
                                </div>

                                {/* Limited Badge */}
                                <div className='flex w-16 shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(119.74deg,#FFE8A3_16.57%,#F1C94F_94.27%)] font-bold tracking-wider text-[#0C1132] uppercase sm:w-20 sm:rounded-2xl'>
                                    <div
                                        className='w-full border-b border-[#F1E9B1] py-1 text-center text-[9px] font-bold text-[#392D0B] sm:text-[10px]'
                                        style={{
                                            background: 'linear-gradient(89.12deg, #F4D580 60.5%, #EDB038 98.79%)'
                                        }}>
                                        Limited
                                    </div>
                                    <div className='flex flex-col items-center justify-center pt-0.75 pb-1.5'>
                                        <span className='text-xs leading-tight font-black text-[#363A3D] sm:text-sm'>
                                            2000
                                        </span>
                                        <span className='text-[8px] leading-tight font-semibold text-[#686B6E] sm:text-[10px]'>
                                            MEMBERS
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className='my-4 h-px w-full bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.5)_50%,rgba(255,255,255,0)_100%)] sm:my-6'></div>

                            {/* Benefits Grid */}
                            <div className='xs:grid-cols-2 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2'>
                                <div>
                                    <p className='mb-2 text-xs font-semibold tracking-widest text-white uppercase sm:text-sm'>
                                        Main Benefits
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {redBenefits.perks.map((item) => (
                                            <li key={item} className='flex items-start gap-2 text-white/90'>
                                                <Image
                                                    src='/icons/ic-check-circle.png'
                                                    alt='Check'
                                                    width={20}
                                                    height={20}
                                                    className='mt-0.5 h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5'
                                                />
                                                <span className='text-xs leading-relaxed'>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className='mb-2 text-xs font-semibold tracking-widest text-white uppercase sm:text-sm'>
                                        SLR Red Prize Examples
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {redBenefits.rewards.map((item) => (
                                            <li key={item} className='flex items-start gap-2 text-white/90'>
                                                <Image
                                                    src='/icons/ic-check-circle.png'
                                                    alt='Check'
                                                    width={20}
                                                    height={20}
                                                    className='mt-0.5 h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5'
                                                />
                                                <span className='text-xs leading-relaxed'>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Button */}
                            <GoldCtaButton href='/sign-up' className='mt-4 sm:mt-6'>
                                Join Now - $10/mo
                            </GoldCtaButton>
                        </div>
                    </div>

                    {/* Upgrade cards - kanan */}
                    <div className='flex flex-col gap-3 sm:gap-4'>
                        <TierUpgradeCard
                            iconSrc='/icons/ic-list-slr-red-reward-1.webp'
                            iconAlt='Red'
                            label='Red'
                            price='$10'
                            badgeLabel='1 chance'
                            badgeLabelColor='#E88888'
                            cardStyle={redCardStyle}
                            badgeStyle={redBadgeStyle}
                        />
                        <TierUpgradeCard
                            iconSrc='/icons/ic-list-slr-red-reward-2.webp'
                            iconAlt='Gold'
                            label='Gold'
                            price='$20'
                            badgeLabel='4 chances'
                            badgeLabelColor='#FFD147'
                            cardStyle={goldCardStyle}
                            badgeStyle={goldBadgeStyle}
                        />
                        <TierUpgradeCard
                            iconSrc='/icons/ic-list-slr-red-reward-3.webp'
                            iconAlt='Black'
                            label='Black'
                            price='$30'
                            badgeLabel='7 chances'
                            badgeLabelColor='#E8E9E9'
                            cardStyle={blackCardStyle}
                            badgeStyle={blackBadgeStyle}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RedTiersSection;
