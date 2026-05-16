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

            <div className='relative mx-auto max-w-7xl px-4'>
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
                            className='relative h-70.5 overflow-hidden rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26] backdrop-blur-sm transition-all duration-300 hover:border-[#F5D78E]/40'>
                            <div className='relative z-10 flex flex-col gap-2'>
                                <h3 className='text-base font-semibold text-[#FFDC75]'>{feature.title}</h3>

                                <p className='text-base leading-relaxed text-[#CDCECF]'>{feature.description}</p>
                            </div>

                            <Image
                                src={feature.icon}
                                alt={feature.title}
                                width={300}
                                height={300}
                                className='absolute right-0 -bottom-4 h-45 w-45 object-contain opacity-80'
                            />
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
