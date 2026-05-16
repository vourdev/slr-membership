import React from 'react';

import Image from 'next/image';

import GoldCtaButton from '@/components/common/gold-cta-button';
import SectionEyebrow from '@/components/common/section-eyebrow';
import SectionHeading from '@/components/common/section-heading';
import TierUpgradeCard from '@/components/common/tier-upgrade-card';

const bluePerks = {
    perks: [
        'Everything in SLR Red',
        'Premium prize entries',
        'Premium partner discounts',
        'Member-only experiences',
        'Priority customer support'
    ],
    rewards: [
        'Multiple tokens to win',
        'Bonus cash credits',
        'Premium digital deals',
        'Exclusive Black Plus tier access'
    ]
};

// ─── Upgrade card styles — each tier has its own gradient + border ──────────

const silverCardStyle: React.CSSProperties = {
    background: 'linear-gradient(154.36deg, #141820 0.82%, #1E2530 49.73%, #141820 98.65%)',
    border: '1px solid #A0B4D259',
    boxShadow: '0px 0px 13px 0px #00000080'
};

const silverBadgeStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, rgba(42, 53, 69, 0.15) 0%, rgba(30, 42, 56, 0.15) 100%)',
    border: '1px solid #A0B9DC33'
};

const platinumCardStyle: React.CSSProperties = {
    background: 'linear-gradient(154.36deg, #0E1828 0.82%, #142034 49.73%, #0E1828 98.65%)',
    border: '1px solid #2878E84D',
    boxShadow: '0px 0px 13px 0px #00000080'
};

const platinumBadgeStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, rgba(12, 28, 64, 0.1) 0%, rgba(14, 32, 80, 0.1) 100%)',
    border: '1px solid #2878E859'
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

const blackPlusCardStyle: React.CSSProperties = {
    background:
        'linear-gradient(154.36deg, #0A0A0E 0.82%, #141418 25.28%, #0A0A0E 49.73%) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.096) 0%, rgba(255, 255, 255, 0.056) 50%, rgba(255, 255, 255, 0.056) 100%) border-box',
    border: '1px solid transparent',
    boxShadow: '0px 0px 13px 0px #776D6D26'
};

const blackPlusBadgeStyle: React.CSSProperties = {
    background: 'linear-gradient(99.17deg, #141418 1.98%, #1E1E24 100%)',
    border: '1px solid #FFFFFF1A'
};

const BlueTiersSection = () => {
    return (
        <section className='bg-slr-navy-deep relative isolate overflow-hidden py-16 md:py-24'>
            {/* Decorative background — soft blue circle glow, right side, slightly raised
                behind the upgrade cards list. Hidden on mobile to avoid clutter. */}
            <div
                aria-hidden='true'
                className='pointer-events-none absolute top-30 -right-10 -z-10 hidden h-143 w-143 rounded-full bg-[radial-gradient(circle,rgba(156,204,255,1)_0%,rgba(156,204,255,0.4)_20%,transparent_50%)] mix-blend-screen blur-[128px] xl:block'
            />
            <div className='mx-auto max-w-7xl px-4'>
                {/* Header */}
                <div className='text-center'>
                    <SectionEyebrow label='Premium Member Tiers' color='#4D62E5' className='mt-4' />

                    <SectionHeading className='mt-2'>
                        SLR <span className='text-[#4D62E5]'>BLUE</span> Reward Tiers
                    </SectionHeading>

                    <p className='mt-2 text-center text-sm leading-relaxed text-[#CDCECF] xl:text-base'>
                        Higher tiers — more chances to win every month.
                    </p>
                </div>

                {/* Grid */}
                <div className='mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Main blue card — gradient border via masked overlay */}
                    <div className='shadow-card-warm-lg relative isolate rounded-2xl p-1.25'>
                        <div
                            className='absolute inset-0 -z-10 rounded-2xl bg-[linear-gradient(180deg,#6AACFF_10%,#1A62C0_25%,#0A2E80_75.24%,#1A62C0_87.62%,#6AACFF_100%)] mask-exclude p-1.25 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]'
                            aria-hidden='true'
                        />
                        <div className='relative flex h-full flex-col overflow-hidden rounded-[calc(1rem-5px)] bg-[linear-gradient(180deg,#0F2F7A_0%,#0B205D_30%,#081640_60%,#0D2662_87.62%)] p-4 sm:p-6'>
                            {/* Header */}
                            <div className='flex items-center justify-between gap-3'>
                                <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
                                    <Image
                                        src='/icons/ic-slr-blue-reward.webp'
                                        alt='SLR Blue'
                                        width={100}
                                        height={100}
                                        className='h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20 md:h-25 md:w-25'
                                    />
                                    <div className='flex min-w-0 flex-col'>
                                        <div className='flex flex-wrap items-baseline gap-1 sm:gap-2'>
                                            <p className='font-bebas-neue text-2xl font-extrabold text-white sm:text-3xl'>
                                                SLR BLUE <span className='text-gradient-gold font-extrabold'>26$</span>
                                            </p>
                                            <span className='text-xs font-normal text-white/60 sm:text-sm'>/month</span>
                                        </div>
                                        <p className='text-xs leading-relaxed text-[#CDCECF] sm:text-sm'>
                                            Premium tier — priority access & perks
                                        </p>
                                    </div>
                                </div>

                                {/* Premium Badge */}
                                <div className='flex w-16 shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(119.74deg,#FFE8A3_16.57%,#F1C94F_94.27%)] font-bold tracking-wider text-[#0C1132] uppercase sm:w-20 sm:rounded-2xl'>
                                    <div
                                        className='w-full border-b border-[#F1E9B1] py-1 text-center text-[9px] font-bold text-[#392D0B] sm:text-[10px]'
                                        style={{
                                            background: 'linear-gradient(89.12deg, #F4D580 60.5%, #EDB038 98.79%)'
                                        }}>
                                        Premium
                                    </div>
                                    <div className='flex flex-col items-center justify-center pt-0.75 pb-1.5'>
                                        <span className='text-xs leading-tight font-black text-[#363A3D] sm:text-sm'>
                                            1500
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
                                        {bluePerks.perks.map((item) => (
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
                                        SLR Blue Prize Rewards
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {bluePerks.rewards.map((item) => (
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
                            <GoldCtaButton href='/sign-up' className='mt-auto'>
                                Join Now - $26/mo
                            </GoldCtaButton>
                        </div>
                    </div>

                    {/* Upgrade cards - kanan */}
                    <div className='flex flex-col gap-3 sm:gap-4'>
                        <TierUpgradeCard
                            iconSrc='/icons/ic-list-slr-blue-reward-1.webp'
                            iconAlt='Silver'
                            label='Silver'
                            price='$26'
                            badgeLabel='1 Token'
                            cardStyle={silverCardStyle}
                            badgeLabelColor='#C0CCDC'
                            badgeSubColor='#8EA0B8'
                            titleColor='#8EA0B8'
                            badgeSub='ALL ACCESS'
                            entryChanges='1 Entry Change'
                            badgeStyle={silverBadgeStyle}
                        />
                        <TierUpgradeCard
                            iconSrc='/icons/ic-list-slr-blue-reward-2.webp'
                            iconAlt='Platinum'
                            label='Platinum'
                            price='$52'
                            badgeLabel='4 Tokens'
                            cardStyle={platinumCardStyle}
                            badgeLabelColor='#6AB0F0'
                            badgeSubColor='#5080B0'
                            titleColor='#82B4FF'
                            badgeSub='ALL ACCESS'
                            entryChanges='4 Entry Changes'
                            badgeStyle={platinumBadgeStyle}
                        />
                        <TierUpgradeCard
                            iconSrc='/icons/ic-list-slr-blue-reward-3.webp'
                            iconAlt='Black'
                            label='Black'
                            price='$78'
                            badgeLabel='7 Tokens'
                            cardStyle={blackCardStyle}
                            badgeLabelColor='#E8E9E9'
                            badgeSubColor='#CDCECF'
                            badgeSub='ALL ACCESS'
                            entryChanges='7 Entry Changes'
                            badgeStyle={blackBadgeStyle}
                        />
                        <TierUpgradeCard
                            iconSrc='/icons/ic-list-slr-blue-reward-4.webp'
                            iconAlt='Black Plus'
                            label='Black Plus'
                            price='$99'
                            badgeLabel='10 Tokens'
                            cardStyle={blackPlusCardStyle}
                            badgeLabelColor='#DDDDDD'
                            badgeSubColor='#8EA0B8'
                            badgeSub='ALL ACCESS'
                            entryChanges='10 Entry Changes'
                            badgeStyle={blackPlusBadgeStyle}
                        />
                    </div>
                </div>
                <div className='mt-12 w-full rounded-xl border border-[#1A62C033] bg-[#1A62C014] p-4 text-center text-sm text-[#8EA0B8] md:text-base'>
                    Each token gives you <span className='font-bold text-[#6AB0F0]'>one entry</span> into the weekly
                    member prize draws. Higher tiers = more chances to win every week.
                </div>
            </div>
        </section>
    );
};

export default BlueTiersSection;
