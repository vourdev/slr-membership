import Image from 'next/image';
import Link from 'next/link';

import GoldPillButton from '@/components/common/gold-pill-button';
import SectionEyebrow from '@/components/common/section-eyebrow';
import SectionHeading from '@/components/common/section-heading';
import { cn } from '@/lib/utils';

import { ArrowRight } from 'lucide-react';

const cards = [
    {
        icon: '/icons/ic-person-circle.png',
        iconHasCircle: false,
        title: 'Membership Details',
        description: 'Explore plans, pricing tiers, and what each membership unlocks.',
        href: '#pricing'
    },
    {
        icon: '/icons/ic-prize-circle.png',
        iconHasCircle: true,
        title: 'Prizes, Bonus & Promotions',
        description: 'See live giveaways, weekly prize draws and exclusive promotions.',
        href: '#promotions',
        highlight: true
    },
    {
        icon: '/icons/ic-star-circle.png',
        iconHasCircle: false,
        title: 'Smart Life Content',
        description: 'Access guides, tips and member-only content to live smarter.',
        href: '#content'
    }
];

const WhyJoinSection = () => {
    return (
        <section className='bg-slr-ink relative py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='flex flex-row items-center justify-center'>
                    <div className='flex flex-col'>
                        <SectionEyebrow label='Discover more' color='#E2B42B' lineColor='#B08A20' className='mt-4' />
                        <SectionHeading className='mt-3 text-6xl md:text-7xl lg:text-[80px] xl:text-[90px]'>
                            <span className='text-gradient-gold block md:ml-3 md:inline'>What we offer</span>
                        </SectionHeading>
                    </div>
                </div>

                <div className='mt-8 flex justify-center'>
                    <Image
                        src='/icons/ic-three-arrow-gold.png'
                        alt=''
                        width={96}
                        height={42}
                        className='h-30 w-auto object-contain sm:h-34 md:h-38 lg:h-40 xl:h-48'
                    />
                </div>

                <div className='mx-auto mt-4 grid max-w-4xl grid-cols-1 items-end gap-6 md:grid-cols-3 md:gap-3 lg:gap-4'>
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className='bg-gradient-gold rounded-3xl p-0.75 shadow-[0_0_28px_rgba(212,175,55,0.25)]'>
                            <div className='bg-slr-navy-deep rounded-[21px] p-1.5'>
                                <div
                                    style={
                                        card.highlight
                                            ? {
                                                  background:
                                                      'linear-gradient(180deg, #FFE066 0%, #F5C22E 50%, #C78C14 100%)'
                                              }
                                            : undefined
                                    }
                                    className={cn(
                                        'flex h-full flex-col items-center rounded-2xl px-7 pt-10 pb-8 text-center',
                                        card.highlight
                                            ? 'min-h-90 border border-[#8C660D] sm:min-h-100 md:min-h-101.5'
                                            : 'min-h-80 bg-[linear-gradient(180deg,#FFFFFF_0%,#E5E5E5_100%)] sm:min-h-90 md:min-h-95'
                                    )}>
                                    <div className='mb-5 flex items-center justify-center'>
                                        <Image
                                            src={card.icon}
                                            alt=''
                                            width={120}
                                            height={120}
                                            className='h-20 w-20 object-contain sm:h-24 sm:w-24'
                                        />
                                    </div>

                                    <h3 className='text-lg leading-tight font-extrabold tracking-wide text-[#0A0A0A] uppercase sm:text-xl lg:text-2xl'>
                                        {card.title}
                                    </h3>

                                    <p
                                        className={cn(
                                            'mt-3 max-w-65 text-sm leading-relaxed sm:text-[15px]',
                                            card.highlight ? 'text-[#1A1308]' : 'text-[#2F2F2F]'
                                        )}>
                                        {card.description}
                                    </p>

                                    <Link
                                        href={card.href}
                                        className={cn(
                                            'mt-auto flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-bold tracking-[0.18em] uppercase transition-opacity hover:opacity-90 sm:text-sm',
                                            card.highlight
                                                ? 'bg-[#0A0A0A] text-[#FFDC75]'
                                                : 'border border-[#C78C14] bg-transparent text-[#1A1308]'
                                        )}>
                                        Learn More
                                        <ArrowRight className='h-4 w-4' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='mt-8 flex flex-col items-center justify-center gap-2'>
                    <div className='flex flex-col'>
                        <SectionEyebrow
                            label='Membership'
                            color='#E2B42B'
                            lineColor='#B08A20'
                            gradient='linear-gradient(90deg, #F2F2F2 0%, #B3B3B8 45%, #FFFFFF 60%, #8C8C94 100%)'
                            labelClassName='text-base md:text-lg lg:text-xl tracking-[0.20em] text-slr-gold-label xl:text-2xl'
                            className='mt-4'
                        />

                        <SectionHeading className='mt-2 text-8xl md:text-[90px] lg:text-[120px] xl:text-[150px]'>
                            <span className='text-gradient-gold block md:ml-3 md:inline'>Club</span>
                        </SectionHeading>
                    </div>
                    <GoldPillButton href='/sign-up' withArrow={false}>
                        JOIN NOW
                    </GoldPillButton>
                </div>
            </div>
        </section>
    );
};

export default WhyJoinSection;
