import Image from 'next/image';
import Link from 'next/link';

import SectionEyebrow from '@/components/common/section-eyebrow';
import { Button } from '@/components/ui/button';

const WelcomeSection = () => {
    return (
        <section className='bg-slr-navy-deep relative py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <SectionEyebrow
                        label="Australia's Best Value Rewards Club"
                        color='#E2B42B'
                        lineColor='#B08A20'
                        className='mt-4'
                    />
                    <h2 className='font-bebas-neue mt-3 text-center text-[56px] leading-none font-medium tracking-wider text-white uppercase md:text-[72px] xl:text-[90px] xl:leading-22.5'>
                        Welcome to
                        <br />
                        Smart Life <span className='text-gradient-gold inline-block'>REWARDS</span>
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
                                sizes='(max-width: 640px) 80px, (max-width: 1024px) 96px, 120px'
                                className='object-cover'
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className='space-y-5'>
                        {/* Header card — gold gradient ring around dark navy body */}
                        <div className='bg-gradient-gold rounded-xl p-px'>
                            <div className='bg-slr-navy-deep flex flex-col items-center justify-center rounded-xl p-6 backdrop-blur-sm'>
                                <h3 className='text-gradient-gold font-bebas-neue mb-1 text-center text-[32px] leading-[1.1] font-normal tracking-[0.02em] uppercase sm:text-[38px] md:text-[42px] md:leading-10'>
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
                            <div className='bg-card-dark-navy shadow-card-soft flex flex-col items-center justify-between rounded-xl border border-[#A0B4D259] p-3 text-center sm:p-4'>
                                <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase sm:text-xs md:text-sm'>
                                    Visitor
                                </p>
                                <p className='font-bebas-neue mt-2 text-[40px] font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                                    FREE
                                </p>
                                <p className='mt-1 text-[10px] text-[#8EA0B8] sm:text-sm'>No credit card</p>
                            </div>

                            {/* Red */}
                            <div className='shadow-card-warm flex flex-col items-center justify-between rounded-xl border border-[#C8152E66] bg-[linear-gradient(154.36deg,#1C0308_0.82%,#2A0810_49.73%,#1A0306_98.65%)] p-3 text-center sm:p-4'>
                                <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase sm:text-xs md:text-sm'>
                                    Red
                                </p>
                                <p className='font-bebas-neue mt-2 text-[40px] leading-none font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                                    $10
                                </p>
                                <p className='mt-1 text-[10px] text-[#8EA0B8] sm:text-sm'>/Month</p>
                            </div>

                            {/* SLR Premium */}
                            <div className='shadow-card-soft flex flex-col items-center justify-between rounded-xl border border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)] p-3 text-center sm:p-4'>
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
                                    className='bg-gradient-gold h-11 w-full rounded-xl font-bold uppercase'
                                    style={{
                                        color: '#0C1132',
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
