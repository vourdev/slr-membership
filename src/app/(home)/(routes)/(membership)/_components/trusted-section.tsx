import Image from 'next/image';

import GoldCtaButton from '@/components/common/gold-cta-button';
import SectionEyebrow from '@/components/common/section-eyebrow';
import SectionHeading from '@/components/common/section-heading';
import { StarsBackground } from '@/components/ui/stars-background';

const trustedFeatures = [
    {
        icon: '/icons/ic-list-trusted-1.webp',
        title: 'Built for Australians',
        description: 'Up to 7 prize draws every week — cash, gift cards, and exclusive member giveaways for Aussies.'
    },
    {
        icon: '/icons/ic-list-trusted-2.webp',
        title: 'Transparent Prize System',
        description: 'Know exactly when prizes are drawn and how every entry counts. No hidden fees, no surprises.'
    },
    {
        icon: '/icons/ic-list-trusted-3.webp',
        title: 'Partner Discounts',
        description: 'Meaningful savings with trusted brands on groceries, fuel, food & dining, and more.'
    },
    {
        icon: '/icons/ic-list-trusted-4.webp',
        title: 'Low Monthly Cost',
        description: 'Our community delivers value from just $10/month and includes major benefits.'
    }
];

const TrustedSection = () => {
    return (
        <section className='bg-slr-navy-deep relative py-16 md:py-24'>
            <StarsBackground starDensity={0.0003} />

            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <SectionEyebrow label='TRUSTED BY THOUSANDS' color='#E2B42B' className='mt-4' />

                    <SectionHeading className='mt-2 text-[42px] leading-none md:text-[50px] lg:text-[60px]'>
                        SEE WHY THOUSANDS OF AUSTRALIANS
                        <br />
                        LOVE <span className='text-gradient-gold font-extrabold'>SMART LIFE REWARDS</span>
                    </SectionHeading>
                </div>

                <div className='mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
                    {trustedFeatures.map((feature) => (
                        <div
                            key={feature.title}
                            className='border-slr-navy-border/60 bg-slr-navy-card/60 hover:border-slr-gold/40 flex flex-col gap-4 rounded-2xl border p-6 backdrop-blur-sm transition-colors'>
                            <Image
                                src={feature.icon}
                                alt={feature.title}
                                width={56}
                                height={56}
                                className='h-12 w-12 object-contain'
                            />
                            <h3 className='text-slr-navy-foreground text-base font-bold'>{feature.title}</h3>
                            <p className='text-slr-navy-foreground/60 text-xs leading-relaxed'>{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className='mt-10 flex justify-center'>
                    <GoldCtaButton href='/sign-up'>JOIN NOW - IT`S FREE TO START</GoldCtaButton>
                </div>
            </div>
        </section>
    );
};

export default TrustedSection;
