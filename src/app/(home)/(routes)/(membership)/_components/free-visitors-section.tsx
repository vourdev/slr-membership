import Image from 'next/image';

import GoldPillButton from '@/components/common/gold-pill-button';
import SectionEyebrow from '@/components/common/section-eyebrow';
import SectionHeading from '@/components/common/section-heading';

import { LockIcon } from 'lucide-react';

const cards = [
    {
        icon: '/icons/ic-people-square-gold.png',
        title: 'Free Visitors',
        description: 'Join the membership for free without committing — see exactly what you get.'
    },
    {
        icon: '/icons/ic-gift-square-gold.png',
        title: 'Weekly Giveaways',
        description: 'Open to all visitors: enter exclusive community giveaways and bonus draws every week.'
    },
    {
        icon: '/icons/ic-arrow-up-square-gold.png',
        title: 'Upgrade Anytime',
        description: 'Looking for bigger giveaway prize and discount access? upgrade as blue/red.'
    }
];

const FreeVisitorsSection = () => {
    return (
        <section className='bg-slr-ink relative py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <SectionEyebrow label='No cost to start' color='#E2B42B' lineColor='#B08A20' />

                <SectionHeading className='mt-4'>
                    <span className='text-gradient-gold'>Free Visitors</span>
                </SectionHeading>

                <p className='text-slr-muted mx-auto mt-4 max-w-xl text-center text-sm md:text-base'>
                    Explore everything SLR has to offer — free, no signup required.
                </p>

                <div className='mt-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3'>
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className='bg-card-dark-navy shadow-card-soft flex flex-col rounded-2xl border border-[#A0B4D259] p-6'>
                            <Image src={card.icon} alt='' width={56} height={56} className='h-14 w-14' />

                            <h3 className='mt-6 text-lg font-bold tracking-wide text-white uppercase'>{card.title}</h3>

                            <p className='text-slr-dim mt-3 text-sm leading-relaxed'>{card.description}</p>

                            <div className='mt-6 h-0.5 w-10 bg-[#997314]' />

                            <div className='mt-4 flex items-center gap-2'>
                                <Image src='/icons/ic-check.png' alt='' width={20} height={20} className='h-3 w-3' />
                                <span className='text-slr-gold-label text-xs font-semibold tracking-widest uppercase'>
                                    Included Free
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='mt-12 flex flex-col items-center gap-4'>
                    <GoldPillButton href='/sign-up'>Enter Now</GoldPillButton>

                    <p className='flex items-center gap-1.5 text-xs text-[#808085]'>
                        <LockIcon className='h-3 w-3' />
                        No credit card · No commitment · Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FreeVisitorsSection;
