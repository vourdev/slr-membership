import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const WelcomeSection = () => {
    return (
        <section className='bg-slr-navy-deep relative py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <div className='mt-4 flex w-full items-center justify-center gap-2'>
                        <div className='h-px w-16 bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]'></div>
                        <p className='text-xs font-semibold text-[#E2B42B] uppercase md:text-sm'>
                            Australia's Best Value Rewards Club
                        </p>
                        <div className='h-px w-16 bg-[linear-gradient(90deg,#B08A20_0%,rgba(255,255,255,0)_100%)]'></div>
                    </div>
                    <h2 className='font-bebas-neue mt-3 text-center text-[56px] leading-none font-medium tracking-wider text-white uppercase md:text-[72px] xl:text-[90px] xl:leading-22.5'>
                        Welcome to
                        <br />
                        Smart Life{' '}
                        <span
                            className='font-bebas-neue inline-block bg-clip-text text-transparent'
                            style={{
                                backgroundImage:
                                    'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)'
                            }}>
                            REWARDS
                        </span>
                    </h2>
                </div>

                <div className='mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2'>
                    {/* Family image */}
                    <div className='flex justify-center'>
                        <div className='relative aspect-square w-full max-w-sm overflow-hidden rounded-full sm:max-w-md lg:max-w-full'>
                            <Image
                                src='/images/smart-life.webp'
                                alt='Smart Life Rewards Family'
                                fill
                                className='object-cover'
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className='space-y-5'>
                        {/* Header card */}
                        <div
                            className='rounded-xl p-px'
                            style={{
                                background:
                                    'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)'
                            }}>
                            <div className='bg-slr-navy-deep flex flex-col items-center justify-center rounded-xl p-6 backdrop-blur-sm'>
                                <h3
                                    className="mb-1 bg-clip-text text-center font-['Bebas_Neue'] text-[32px] leading-[1.1] font-normal tracking-[0.02em] text-transparent uppercase sm:text-[38px] md:text-[42px] md:leading-10"
                                    style={{
                                        background:
                                            'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
                                        WebkitBackgroundClip: 'text'
                                    }}>
                                    AUSTRALIA&apos;S BEST VALUE REWARDS CLUB
                                </h3>
                                <p className='text-center text-sm font-semibold text-[#E2B42B] uppercase sm:text-base'>
                                    Low fees · More value · More wins
                                </p>
                            </div>
                        </div>

                        {/* Pricing cards */}
                        <div className='grid grid-cols-3 gap-2 sm:gap-3'>
                            {/* Visitor */}
                            <div className='flex flex-col items-center justify-between rounded-xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#00000080] sm:p-4'>
                                <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase sm:text-xs md:text-sm'>
                                    Visitor
                                </p>
                                <p className='font-bebas-neue mt-2 text-[40px] font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                                    FREE
                                </p>
                                <p className='mt-1 text-[10px] text-[#8EA0B8] sm:text-sm'>No credit card</p>
                            </div>

                            {/* Red */}
                            <div className='flex flex-col items-center justify-between rounded-xl border border-[#C8152E66] bg-[linear-gradient(154.36deg,#1C0308_0.82%,#2A0810_49.73%,#1A0306_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#776D6D26] sm:p-4'>
                                <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase sm:text-xs md:text-sm'>
                                    Red
                                </p>
                                <p className='font-bebas-neue mt-2 text-[40px] leading-none font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                                    $10
                                </p>
                                <p className='mt-1 text-[10px] text-[#8EA0B8] sm:text-sm'>/Month</p>
                            </div>

                            {/* SLR Premium */}
                            <div className='flex flex-col items-center justify-between rounded-xl border border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#00000080] sm:p-4'>
                                <p className='text-[10px] font-semibold tracking-widest text-[#2878E8] uppercase sm:text-xs md:text-sm'>
                                    SLR Premium
                                </p>
                                <p className='font-bebas-neue mt-2 text-[40px] leading-none font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                                    $26
                                </p>
                                <p className='mt-1 text-[10px] tracking-wide text-[#8EA0B8] uppercase sm:text-xs'>
                                    / Month
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className='mt-8 flex flex-wrap gap-3'>
                            <Link href='/sign-up' className='flex-1'>
                                <Button
                                    className='h-11 w-full rounded-xl font-bold uppercase'
                                    style={{
                                        color: '#0C1132',
                                        background:
                                            'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
                                        borderTop: '2px solid #FFDC75',
                                        boxShadow:
                                            '0px 8px 12px 0px #FFFFFF14 inset, 0px 24px 24px -16px #DAAF1166, 16px 24px 64px -24px #FFFFFF14 inset, 0px 12px 24px 4px #A0701840'
                                    }}>
                                    Join Now
                                </Button>
                            </Link>
                            <Link href='#partners' className='flex-1'>
                                <Button
                                    variant='outline'
                                    className='h-11 w-full rounded-xl border border-[#FFD147] bg-[#FFD1471A] font-semibold text-[#FFDC75] shadow-[inset_0px_8px_12px_0px_#FFFFFF14,inset_16px_24px_64px_-24px_#FFFFFF14,0px_24px_24px_-16px_#0000001F] transition-all hover:bg-[#FFD14726] hover:text-[#FFDC75] active:scale-[0.98]'>
                                    View Membership
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;
