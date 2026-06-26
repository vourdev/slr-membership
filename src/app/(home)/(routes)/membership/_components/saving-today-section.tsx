import Link from 'next/link';

import GoldPillButton from '@/components/common/gold-pill-button';
import SectionEyebrow from '@/components/common/section-eyebrow';
import SectionHeading from '@/components/common/section-heading';

const SavingTodaySection = () => {
    return (
        <section className='bg-slr-ink relative isolate overflow-hidden py-16 md:py-24'>
            <div className='mx-auto flex max-w-3xl flex-col items-center px-4 text-center'>
                <SectionEyebrow label='No Lock-in · Cancel Anytime' color='#E2B42B' lineColor='#B08A20' />

                <SectionHeading className='mt-4'>
                    <span className='text-gradient-silver'>Start </span>
                    <span className='text-gradient-gold'>Saving Today</span>
                </SectionHeading>

                <p className='text-slr-muted mt-5 max-w-xl text-sm leading-relaxed md:text-base'>
                    Pick a plan in seconds, activate instantly, and start winning, saving, and earning rewards from your
                    very first day.
                </p>

                <div className='mt-8 flex w-full flex-wrap justify-center gap-4'>
                    <GoldPillButton href='/sign-up' className='min-w-max flex-1 sm:flex-none'>
                        Join Now
                    </GoldPillButton>

                    <Link
                        href='/faq'
                        className='flex min-w-max flex-1 items-center justify-center rounded-xl px-8 py-2.5 transition-opacity hover:opacity-90 sm:flex-none sm:rounded-2xl lg:px-12 lg:py-3'
                        style={{ background: '#212429', border: '1.5px solid #D1A62E' }}>
                        <span className='text-base font-bold tracking-[2px] text-[#E2B42B] uppercase sm:tracking-[2.5px] lg:text-xl lg:tracking-[3px]'>
                            Read FAQ
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SavingTodaySection;
