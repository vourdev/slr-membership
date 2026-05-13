import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const MembershipCtaSection = () => {
    return (
        <section id='join' className='slr-stars-bg relative overflow-hidden py-16 md:py-24'>
            <div className='slr-hero-spotlight pointer-events-none absolute inset-x-0 top-0 h-72' />

            <div className='relative mx-auto max-w-4xl px-4 text-center'>
                <p className='text-slr-gold text-[10px] font-semibold tracking-[0.4em] uppercase md:text-xs'>
                    Limited Offer
                </p>
                <h2 className='text-slr-navy-foreground mt-3 text-3xl font-extrabold leading-tight md:text-5xl'>
                    SMART LIFE REWARDS
                    <br />
                    MEMBERSHIP <span className='text-slr-gold'>4 LIFE</span>
                </h2>
                <p className='text-slr-navy-foreground/70 mx-auto mt-4 max-w-2xl text-sm md:text-base'>
                    Start free today. Upgrade whenever you&apos;re ready. Begin enjoying the best of living with
                    Australia&apos;s #1 best value rewards club.
                </p>

                <div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
                    <Link href='/sign-up'>
                        <Button className='slr-gold-gradient text-slr-gold-foreground h-12 rounded-full px-8 font-bold shadow-lg hover:opacity-90'>
                            Join Now — It&apos;s Free to Start
                        </Button>
                    </Link>
                    <Link href='#tiers'>
                        <Button
                            variant='outline'
                            className='border-slr-navy-foreground/30 text-slr-navy-foreground hover:bg-slr-navy-foreground/10 hover:text-slr-navy-foreground h-12 rounded-full bg-transparent px-8 font-semibold'>
                            View All Plans
                        </Button>
                    </Link>
                </div>

                <div className='mt-10 flex justify-center'>
                    <Image
                        src='/images/slr-rewards-logo.webp'
                        alt='SLR Rewards'
                        width={120}
                        height={120}
                        className='h-16 w-auto opacity-80'
                    />
                </div>
            </div>
        </section>
    );
};

export default MembershipCtaSection;
