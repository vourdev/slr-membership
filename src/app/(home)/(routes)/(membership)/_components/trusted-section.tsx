import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

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
        <section className='slr-section-bg py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <p className='text-slr-navy-foreground/60 text-[10px] font-semibold tracking-[0.3em] uppercase md:text-xs'>
                        Trusted by Members
                    </p>
                    <h2 className='text-slr-navy-foreground mt-3 text-3xl font-extrabold md:text-4xl'>
                        SEE WHY THOUSANDS OF AUSTRALIANS
                        <br />
                        LOVE <span className='text-slr-gold'>SMART LIFE REWARDS</span>
                    </h2>
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
                    <Link href='/sign-up'>
                        <Button className='slr-gold-gradient text-slr-gold-foreground h-12 rounded-full px-8 font-bold'>
                            Join Now — It&apos;s Free to Start
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrustedSection;
