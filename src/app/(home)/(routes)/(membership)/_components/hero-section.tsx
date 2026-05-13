import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const HeroSection = () => {
    return (
        <section className='slr-stars-bg relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20'>
            {/* Spotlight effect */}
            <div className='slr-hero-spotlight pointer-events-none absolute inset-x-0 top-0 h-72' />

            <div className='relative mx-auto max-w-6xl px-4'>
                {/* Logo */}
                <div className='mb-8 flex justify-center'>
                    <Image
                        src='/images/slr-rewards-logo.webp'
                        alt='SLR Rewards'
                        width={140}
                        height={140}
                        priority
                        className='h-20 w-auto md:h-24'
                    />
                </div>

                {/* Heading */}
                <div className='text-center'>
                    <p className='text-slr-navy-foreground/80 text-xs font-semibold tracking-[0.3em] uppercase md:text-sm'>
                        Australia&apos;s Best Value
                    </p>
                    <h1 className='text-slr-navy-foreground mt-3 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl'>
                        REWARDS <span className='text-slr-gold'>CLUB</span>
                    </h1>
                    <p className='text-slr-navy-foreground/70 mx-auto mt-4 max-w-xl text-sm md:text-base'>
                        Helping Australians beat the cost of living
                    </p>
                </div>

                {/* Stat pills */}
                <div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
                    <div className='bg-slr-navy-card/70 border-slr-gold/40 flex items-center gap-3 rounded-full border px-5 py-2.5 backdrop-blur-sm'>
                        <span className='bg-slr-gold text-slr-gold-foreground rounded-full px-3 py-1 text-xs font-bold'>
                            Members
                        </span>
                        <span className='text-slr-navy-foreground text-sm font-semibold'>1000+</span>
                    </div>
                    <div className='bg-slr-navy-card/70 border-slr-gold/40 flex items-center gap-3 rounded-full border px-5 py-2.5 backdrop-blur-sm'>
                        <span className='bg-slr-gold text-slr-gold-foreground rounded-full px-3 py-1 text-xs font-bold'>
                            15-25%
                        </span>
                        <span className='text-slr-navy-foreground text-sm font-semibold'>Average Save</span>
                    </div>
                    <div className='bg-slr-navy-card/70 border-slr-gold/40 flex items-center gap-3 rounded-full border px-5 py-2.5 backdrop-blur-sm'>
                        <span className='bg-slr-gold text-slr-gold-foreground rounded-full px-3 py-1 text-xs font-bold'>
                            Bonus
                        </span>
                        <span className='text-slr-navy-foreground text-sm font-semibold'>Rewards</span>
                    </div>
                </div>

                {/* CTA */}
                <div className='mt-8 flex flex-col items-center gap-3'>
                    <Link href='/sign-up'>
                        <Button className='slr-gold-gradient text-slr-gold-foreground h-12 rounded-full px-10 text-base font-extrabold tracking-wide shadow-lg hover:opacity-90'>
                            JOIN NOW
                        </Button>
                    </Link>
                    <Link
                        href='#tiers'
                        className='text-slr-navy-foreground/70 hover:text-slr-gold text-xs underline-offset-4 transition-colors hover:underline'>
                        View memberships
                    </Link>
                </div>

                {/* TV / Giveaway image */}
                <div className='relative mt-12 flex justify-center'>
                    <div className='relative w-full max-w-3xl'>
                        <Image
                            src='/images/giveaway-win.webp'
                            alt='Giveaway and Win Cash Prizes'
                            width={1200}
                            height={700}
                            priority
                            className='h-auto w-full object-contain'
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
