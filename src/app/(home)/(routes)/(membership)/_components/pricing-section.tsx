import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const plans = [
    {
        label: 'Visitor',
        price: 'FREE',
        note: 'No credit card',
        href: '/sign-up',
        accentClass: 'bg-slr-navy-card border-slr-navy-border',
        priceClass: 'text-slr-gold'
    },
    {
        label: 'Red',
        price: '$10',
        note: '/ month',
        href: '/sign-up',
        accentClass: 'bg-slr-red-tier border-slr-red-tier',
        priceClass: 'text-slr-red-tier-foreground'
    },
    {
        label: 'SLR Premium',
        price: '$26',
        note: '/ month',
        href: '/sign-up',
        accentClass: 'bg-slr-blue-tier border-slr-blue-tier',
        priceClass: 'text-slr-blue-tier-foreground'
    }
];

const PricingSection = () => {
    return (
        <section id='pricing' className='slr-section-bg py-16 md:py-20'>
            <div className='mx-auto max-w-5xl px-4'>
                <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                    {plans.map((plan) => (
                        <div
                            key={plan.label}
                            className={cn(
                                'flex flex-col items-center justify-between rounded-2xl border p-8 text-center shadow-lg',
                                plan.accentClass
                            )}>
                            <p className='text-slr-navy-foreground/80 text-[10px] font-semibold tracking-[0.3em] uppercase'>
                                {plan.label}
                            </p>
                            <p className={cn('mt-4 text-5xl font-extrabold', plan.priceClass)}>{plan.price}</p>
                            <p className='text-slr-navy-foreground/70 mt-1 text-xs'>{plan.note}</p>
                            <Link href={plan.href} className='mt-6 w-full'>
                                <Button className='slr-gold-gradient text-slr-gold-foreground h-10 w-full rounded-full font-bold'>
                                    Select Plan
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <p className='text-slr-navy-foreground/60 mx-auto mt-10 max-w-2xl text-center text-xs px-4'>
                Smart Life Rewards is a membership platform designed to help Australians access value through rewards,
                promotional prizes, partner discounts, and digital offers.
            </p>
        </section>
    );
};

export default PricingSection;
