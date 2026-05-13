import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const WelcomeSection = () => {
    return (
        <section className='slr-section-bg relative overflow-hidden py-16 md:py-24'>
            <div className='mx-auto max-w-6xl px-4'>
                <div className='text-center'>
                    <p className='text-slr-navy-foreground/70 text-[10px] font-semibold tracking-[0.35em] uppercase md:text-xs'>
                        Australia&apos;s Best Value Rewards Club
                    </p>
                    <h2 className='text-slr-navy-foreground mt-3 text-3xl font-extrabold tracking-tight md:text-5xl'>
                        WELCOME TO
                        <br />
                        SMART LIFE <span className='text-slr-gold'>REWARDS</span>
                    </h2>
                </div>

                <div className='mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2'>
                    {/* Family image with golden frame */}
                    <div className='flex justify-center'>
                        <div className='border-slr-gold/50 bg-slr-navy-card relative aspect-square w-full max-w-md overflow-hidden rounded-full border-4 shadow-[0_0_60px_-15px_var(--slr-gold)]'>
                            <Image
                                src='/images/smart-life.webp'
                                alt='Smart Life Rewards Family'
                                fill
                                className='object-cover'
                            />
                        </div>
                    </div>

                    {/* Pricing tiers */}
                    <div className='space-y-5'>
                        <div className='border-slr-gold/30 bg-slr-navy-card/60 rounded-2xl border p-6 backdrop-blur-sm'>
                            <h3 className='text-slr-navy-foreground mb-1 text-lg font-bold'>
                                AUSTRALIA&apos;S BEST VALUE REWARDS CLUB
                            </h3>
                            <p className='text-slr-navy-foreground/60 text-xs'>
                                Low fees · More value · More wins
                            </p>

                            <div className='mt-6 grid grid-cols-3 gap-3'>
                                <div className='bg-slr-navy-deep/80 rounded-xl p-4 text-center'>
                                    <p className='text-slr-navy-foreground/60 text-[10px] tracking-widest uppercase'>
                                        Visitor
                                    </p>
                                    <p className='text-slr-gold mt-2 text-2xl font-extrabold'>FREE</p>
                                    <p className='text-slr-navy-foreground/50 mt-1 text-[10px]'>No credit card</p>
                                </div>
                                <div className='bg-slr-red-tier rounded-xl p-4 text-center'>
                                    <p className='text-slr-red-tier-foreground/80 text-[10px] tracking-widest uppercase'>
                                        Red
                                    </p>
                                    <p className='text-slr-red-tier-foreground mt-2 text-2xl font-extrabold'>$10</p>
                                    <p className='text-slr-red-tier-foreground/70 mt-1 text-[10px]'>/ month</p>
                                </div>
                                <div className='bg-slr-blue-tier rounded-xl p-4 text-center'>
                                    <p className='text-slr-blue-tier-foreground/80 text-[10px] tracking-widest uppercase'>
                                        SLR Premium
                                    </p>
                                    <p className='text-slr-blue-tier-foreground mt-2 text-2xl font-extrabold'>$26</p>
                                    <p className='text-slr-blue-tier-foreground/70 mt-1 text-[10px]'>/ month</p>
                                </div>
                            </div>

                            <div className='mt-6 flex flex-wrap gap-3'>
                                <Link href='/sign-up' className='flex-1'>
                                    <Button className='slr-gold-gradient text-slr-gold-foreground h-11 w-full rounded-full font-bold'>
                                        Join Now
                                    </Button>
                                </Link>
                                <Link href='#partners' className='flex-1'>
                                    <Button
                                        variant='outline'
                                        className='border-slr-navy-foreground/30 text-slr-navy-foreground hover:bg-slr-navy-foreground/10 hover:text-slr-navy-foreground h-11 w-full rounded-full bg-transparent font-semibold'>
                                        View Membership
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WelcomeSection;
