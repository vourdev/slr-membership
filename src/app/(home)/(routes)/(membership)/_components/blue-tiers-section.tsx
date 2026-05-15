import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

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
    background: 'linear-gradient(154.36deg, #0A0A0A 0.82%, #181818 49.73%)',
    border: '1px solid',
    borderImageSource:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.096) 0%, rgba(255, 255, 255, 0.056) 50%, rgba(255, 255, 255, 0.056) 100%)',
    borderImageSlice: 1,
    boxShadow: '0px 0px 13px 0px #00000080'
};

const blackBadgeStyle: React.CSSProperties = {
    background: '#FFFFFF0D',
    border: '1px solid #FFFFFF1A'
};

const blackPlusCardStyle: React.CSSProperties = {
    background: 'linear-gradient(154.36deg, #0A0A0E 0.82%, #141418 25.28%, #0A0A0E 49.73%)',
    border: '1px solid',
    borderImageSource:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.096) 0%, rgba(255, 255, 255, 0.056) 50%, rgba(255, 255, 255, 0.056) 100%)',
    borderImageSlice: 1,
    boxShadow: '0px 0px 13px 0px #00000080'
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
                    <div className='mt-4 flex w-full items-center justify-center gap-2'>
                        <div className='h-px w-16 bg-[linear-gradient(270deg,#4D62E5_0%,rgba(255,255,255,0)_100%)]'></div>
                        <p className='text-xs font-semibold text-[#4D62E5] uppercase md:text-sm'>
                            Premium Member Tiers
                        </p>
                        <div className='h-px w-16 bg-[linear-gradient(90deg,#4D62E5_0%,rgba(255,255,255,0)_100%)]'></div>
                    </div>

                    <h2 className='font-bebas-neue mt-2 text-center text-[56px] leading-[0.90] font-medium tracking-wider text-white uppercase md:text-[72px] md:leading-none'>
                        SLR <span className='text-[#4D62E5]'>BLUE</span> Reward Tiers
                    </h2>
                    <p className='mt-2 text-center text-sm leading-relaxed text-[#CDCECF] xl:text-base'>
                        Higher tiers — more chances to win every month.
                    </p>
                </div>

                {/* Grid */}
                <div className='mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Main blue card — gradient border via masked overlay (same technique as red) */}
                    <div className='relative isolate rounded-2xl p-1.25 shadow-[0px_0px_20px_0px_#776D6D26]'>
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
                                                SLR BLUE{' '}
                                                <span className='bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text font-extrabold text-transparent'>
                                                    26$
                                                </span>
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
                            <Link href='/sign-up' className='mt-auto block'>
                                <Button
                                    className='h-10 w-full rounded-xl font-bold uppercase sm:h-11'
                                    style={{
                                        color: '#0C1132',
                                        background:
                                            'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
                                        borderTop: '2px solid #FFDC75'
                                    }}>
                                    Join Now - $26/mo
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Upgrade cards - kanan
                        Each tier (Silver / Platinum / Black / Black Plus) has its own unique
                        gradient, border, and inner-badge palette. */}
                    <div className='flex flex-col gap-3 sm:gap-4'>
                        {/* Card 1 — Silver $26 */}
                        <div
                            style={silverCardStyle}
                            className='flex flex-1 items-center justify-between gap-2 rounded-xl px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 md:px-5'>
                            <div className='flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4'>
                                <Image
                                    src='/icons/ic-list-slr-blue-reward-1.webp'
                                    alt='Silver'
                                    width={80}
                                    height={80}
                                    className='h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20'
                                />
                                <div className='flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 sm:gap-x-2'>
                                    <div className='flex items-center gap-1.5 text-[#CDCECF] uppercase sm:gap-2'>
                                        <span className='text-xs leading-none font-semibold tracking-[0.18em] whitespace-nowrap sm:text-sm sm:tracking-[0.3em]'>
                                            Silver
                                        </span>
                                        <span className='font-bebas-neue bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-2xl leading-none font-extrabold tracking-normal text-transparent sm:text-3xl'>
                                            $26
                                        </span>
                                    </div>
                                    <span className='text-[10px] font-normal text-white/60 sm:text-xs md:text-sm'>
                                        /month
                                    </span>
                                </div>
                            </div>
                            <div
                                style={silverBadgeStyle}
                                className='flex shrink-0 flex-col items-center justify-center rounded-xl p-2 text-center sm:rounded-2xl sm:p-3 md:p-4'>
                                <p className='text-sm leading-none font-extrabold whitespace-nowrap text-[#F5D78E] uppercase sm:text-base md:text-lg'>
                                    1 Token
                                </p>
                                <p className='mt-1 text-[9px] tracking-widest text-[#CDCECF] uppercase sm:text-[10px] md:text-xs'>
                                    Membership entries
                                </p>
                            </div>
                        </div>

                        {/* Card 2 — Platinum $52 */}
                        <div
                            style={platinumCardStyle}
                            className='flex flex-1 items-center justify-between gap-2 rounded-xl px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 md:px-5'>
                            <div className='flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4'>
                                <Image
                                    src='/icons/ic-list-slr-blue-reward-2.webp'
                                    alt='Platinum'
                                    width={80}
                                    height={80}
                                    className='h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20'
                                />
                                <div className='flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 sm:gap-x-2'>
                                    <div className='flex items-center gap-1.5 text-[#CDCECF] uppercase sm:gap-2'>
                                        <span className='text-xs leading-none font-semibold tracking-[0.18em] whitespace-nowrap sm:text-sm sm:tracking-[0.3em]'>
                                            Platinum
                                        </span>
                                        <span className='font-bebas-neue bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-2xl leading-none font-extrabold tracking-normal text-transparent sm:text-3xl'>
                                            $52
                                        </span>
                                    </div>
                                    <span className='text-[10px] font-normal text-white/60 sm:text-xs md:text-sm'>
                                        /month
                                    </span>
                                </div>
                            </div>
                            <div
                                style={platinumBadgeStyle}
                                className='flex shrink-0 flex-col items-center justify-center rounded-xl p-2 text-center sm:rounded-2xl sm:p-3 md:p-4'>
                                <p className='text-sm leading-none font-extrabold whitespace-nowrap text-[#F5D78E] uppercase sm:text-base md:text-lg'>
                                    4 Tokens
                                </p>
                                <p className='mt-1 text-[9px] tracking-widest text-[#CDCECF] uppercase sm:text-[10px] md:text-xs'>
                                    Membership entries
                                </p>
                            </div>
                        </div>

                        {/* Card 3 — Black $78 */}
                        <div
                            style={blackCardStyle}
                            className='flex flex-1 items-center justify-between gap-2 rounded-xl px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 md:px-5'>
                            <div className='flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4'>
                                <Image
                                    src='/icons/ic-list-slr-blue-reward-3.webp'
                                    alt='Black'
                                    width={80}
                                    height={80}
                                    className='h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20'
                                />
                                <div className='flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 sm:gap-x-2'>
                                    <div className='flex items-center gap-1.5 text-[#CDCECF] uppercase sm:gap-2'>
                                        <span className='text-xs leading-none font-semibold tracking-[0.18em] whitespace-nowrap sm:text-sm sm:tracking-[0.3em]'>
                                            Black
                                        </span>
                                        <span className='font-bebas-neue bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-2xl leading-none font-extrabold tracking-normal text-transparent sm:text-3xl'>
                                            $78
                                        </span>
                                    </div>
                                    <span className='text-[10px] font-normal text-white/60 sm:text-xs md:text-sm'>
                                        /month
                                    </span>
                                </div>
                            </div>
                            <div
                                style={blackBadgeStyle}
                                className='flex shrink-0 flex-col items-center justify-center rounded-xl p-2 text-center sm:rounded-2xl sm:p-3 md:p-4'>
                                <p className='text-sm leading-none font-extrabold whitespace-nowrap text-[#F5D78E] uppercase sm:text-base md:text-lg'>
                                    7 Tokens
                                </p>
                                <p className='mt-1 text-[9px] tracking-widest text-[#CDCECF] uppercase sm:text-[10px] md:text-xs'>
                                    Membership entries
                                </p>
                            </div>
                        </div>

                        {/* Card 4 — Black Plus $99 */}
                        <div
                            style={blackPlusCardStyle}
                            className='flex flex-1 items-center justify-between gap-2 rounded-xl px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 md:px-5'>
                            <div className='flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4'>
                                <Image
                                    src='/icons/ic-list-slr-blue-reward-4.webp'
                                    alt='Black Plus'
                                    width={80}
                                    height={80}
                                    className='h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20'
                                />
                                <div className='flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 sm:gap-x-2'>
                                    <div className='flex items-center gap-1.5 text-[#CDCECF] uppercase sm:gap-2'>
                                        <span className='text-xs leading-none font-semibold tracking-[0.18em] whitespace-nowrap sm:text-sm sm:tracking-[0.3em]'>
                                            Black Plus
                                        </span>
                                        <span className='font-bebas-neue bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-2xl leading-none font-extrabold tracking-normal text-transparent sm:text-3xl'>
                                            $99
                                        </span>
                                    </div>
                                    <span className='text-[10px] font-normal text-white/60 sm:text-xs md:text-sm'>
                                        /month
                                    </span>
                                </div>
                            </div>
                            <div
                                style={blackPlusBadgeStyle}
                                className='flex shrink-0 flex-col items-center justify-center rounded-xl p-2 text-center sm:rounded-2xl sm:p-3 md:p-4'>
                                <p className='text-sm leading-none font-extrabold whitespace-nowrap text-[#F5D78E] uppercase sm:text-base md:text-lg'>
                                    10 Tokens
                                </p>
                                <p className='mt-1 text-[9px] tracking-widest text-[#CDCECF] uppercase sm:text-[10px] md:text-xs'>
                                    Membership entries
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlueTiersSection;
