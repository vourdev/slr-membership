import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

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
    background: 'linear-gradient(154.36deg, #0A0A0A 0.82%, #181818 49.73%)',
    border: '1px solid',
    borderImageSource:
        'linear-gradient(180deg, rgba(255, 255, 255, 0.096) 0%, rgba(255, 255, 255, 0.056) 50%, rgba(255, 255, 255, 0.056) 100%)',
    borderImageSlice: 1,
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
                    <div className='mt-4 flex w-full items-center justify-center gap-2'>
                        <div className='h-px w-16 bg-[linear-gradient(270deg,#D0302F_0%,rgba(255,255,255,0)_100%)]'></div>
                        <p className='text-xs font-semibold text-red-600 uppercase md:text-sm'> Member Prize Tiers</p>
                        <div className='h-px w-16 bg-[linear-gradient(90deg,#D0302F_0%,rgba(255,255,255,0)_100%)]'></div>
                    </div>

                    <h2 className='font-bebas-neue mt-2 text-center text-[56px] leading-[0.90] font-medium tracking-wider text-white uppercase md:text-[72px] md:leading-none'>
                        SLR <span className='text-red-600'>RED</span> Reward Tiers
                    </h2>
                    <p className='mt-2 text-center text-sm leading-relaxed text-[#CDCECF] xl:text-base'>
                        Member prize tickets are base on your tier level.
                    </p>
                </div>

                <div className='mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    <div className='relative isolate rounded-2xl p-1.25 shadow-[0px_0px_20px_0px_#776D6D26]'>
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
                                                SLR RED{' '}
                                                <span className='bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text font-extrabold text-transparent'>
                                                    10$
                                                </span>
                                            </p>
                                            <span className='text-xs font-normal text-white/60 sm:text-sm'>/month</span>
                                        </div>
                                        <p className='text-xs leading-relaxed text-[#CDCECF] sm:text-sm'>
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
                            <Link href='/sign-up' className='mt-4 block sm:mt-6'>
                                <Button
                                    className='h-10 w-full rounded-xl font-bold uppercase sm:h-11'
                                    style={{
                                        color: '#0C1132',
                                        background:
                                            'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
                                        borderTop: '2px solid #FFDC75'
                                    }}>
                                    Join Now - $10/mo
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Upgrade cards - kanan
                        Each tier (Red/Gold/Black) has its own unique gradient, border, and inner-badge palette. */}
                    <div className='flex flex-col gap-3 sm:gap-4'>
                        {/* Card 1 — Red $10 */}
                        <div
                            style={redCardStyle}
                            className='flex flex-1 items-center justify-between gap-2 rounded-xl px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 md:px-5'>
                            <div className='flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4'>
                                <Image
                                    src='/icons/ic-list-slr-red-reward-1.webp'
                                    alt='Red'
                                    width={80}
                                    height={80}
                                    className='h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20'
                                />
                                <div className='flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 sm:gap-x-2'>
                                    <div className='flex items-center gap-1.5 text-[#CDCECF] uppercase sm:gap-2'>
                                        <span className='text-xs leading-none font-semibold tracking-[0.18em] sm:text-sm sm:tracking-[0.3em]'>
                                            Red
                                        </span>
                                        <span className='font-bebas-neue bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-2xl leading-none font-extrabold tracking-normal text-transparent sm:text-3xl'>
                                            $10
                                        </span>
                                    </div>
                                    <span className='text-[10px] font-normal text-white/60 sm:text-xs md:text-sm'>
                                        /month
                                    </span>
                                </div>
                            </div>
                            <div
                                style={redBadgeStyle}
                                className='flex shrink-0 flex-col items-center justify-center rounded-xl p-2 text-center sm:rounded-2xl sm:p-3 md:p-4'>
                                <p className='text-sm leading-none font-extrabold whitespace-nowrap text-[#E88888] uppercase sm:text-base md:text-lg'>
                                    1 chance
                                </p>
                                <p className='mt-1 text-[9px] tracking-widest text-[#CDCECF] uppercase sm:text-[10px] md:text-xs'>
                                    MEMBER ENTRIES
                                </p>
                            </div>
                        </div>

                        {/* Card 2 — Gold $20 */}
                        <div
                            style={goldCardStyle}
                            className='flex flex-1 items-center justify-between gap-2 rounded-xl px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 md:px-5'>
                            <div className='flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4'>
                                <Image
                                    src='/icons/ic-list-slr-red-reward-2.webp'
                                    alt='Gold'
                                    width={80}
                                    height={80}
                                    className='h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20'
                                />
                                <div className='flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 sm:gap-x-2'>
                                    <div className='flex items-center gap-1.5 text-[#CDCECF] uppercase sm:gap-2'>
                                        <span className='text-xs leading-none font-semibold tracking-[0.18em] sm:text-sm sm:tracking-[0.3em]'>
                                            Gold
                                        </span>
                                        <span className='font-bebas-neue bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-2xl leading-none font-extrabold tracking-normal text-transparent sm:text-3xl'>
                                            $20
                                        </span>
                                    </div>
                                    <span className='text-[10px] font-normal text-white/60 sm:text-xs md:text-sm'>
                                        /month
                                    </span>
                                </div>
                            </div>
                            <div
                                style={goldBadgeStyle}
                                className='flex shrink-0 flex-col items-center justify-center rounded-xl p-2 text-center sm:rounded-2xl sm:p-3 md:p-4'>
                                <p className='text-sm leading-none font-extrabold whitespace-nowrap text-[#FFD147] uppercase sm:text-base md:text-lg'>
                                    4 chances
                                </p>
                                <p className='mt-1 text-[9px] tracking-widest text-[#CDCECF] uppercase sm:text-[10px] md:text-xs'>
                                    MEMBER ENTRIES
                                </p>
                            </div>
                        </div>

                        {/* Card 3 — Black $30 */}
                        <div
                            style={blackCardStyle}
                            className='flex flex-1 items-center justify-between gap-2 rounded-xl px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 md:px-5'>
                            <div className='flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4'>
                                <Image
                                    src='/icons/ic-list-slr-red-reward-3.webp'
                                    alt='Black'
                                    width={80}
                                    height={80}
                                    className='h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20'
                                />
                                <div className='flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0 sm:gap-x-2'>
                                    <div className='flex items-center gap-1.5 text-[#CDCECF] uppercase sm:gap-2'>
                                        <span className='text-xs leading-none font-semibold tracking-[0.18em] sm:text-sm sm:tracking-[0.3em]'>
                                            Black
                                        </span>
                                        <span className='font-bebas-neue bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-2xl leading-none font-extrabold tracking-normal text-transparent sm:text-3xl'>
                                            $30
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
                                <p className='text-sm leading-none font-extrabold whitespace-nowrap text-[#E8E9E9] uppercase sm:text-base md:text-lg'>
                                    7 chances
                                </p>
                                <p className='mt-1 text-[9px] tracking-widest text-[#CDCECF] uppercase sm:text-[10px] md:text-xs'>
                                    MEMBER ENTRIES
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RedTiersSection;
