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
        <section id='pricing' className='bg-slr-navy-deep relative mx-auto max-w-7xl px-4 py-16 md:py-24'>
            <div className='grid grid-cols-3 gap-2 sm:gap-3'>
                {/* Visitor */}
                <div className='flex flex-col items-center justify-between rounded-xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#00000080] sm:p-4'>
                    <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase sm:text-xs md:text-sm'>
                        Visitor
                    </p>
                    <p className='font-bebas-neue mt-2 text-[40px] font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                        FREE
                    </p>
                    <p className='mt-1 text-[10px] text-[#8EA0B8] sm:text-sm'>No credit card</p>
                </div>

                {/* Red */}
                <div className='flex flex-col items-center justify-between rounded-xl border border-[#C8152E66] bg-[linear-gradient(154.36deg,#1C0308_0.82%,#2A0810_49.73%,#1A0306_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#776D6D26] sm:p-4'>
                    <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase sm:text-xs md:text-sm'>
                        Red
                    </p>
                    <p className='font-bebas-neue mt-2 text-[40px] leading-none font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                        $10
                    </p>
                    <p className='mt-1 text-[10px] text-[#8EA0B8] sm:text-sm'>/Month</p>
                </div>

                {/* SLR Premium */}
                <div className='flex flex-col items-center justify-between rounded-xl border border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)] p-3 text-center shadow-[0px_0px_13px_0px_#00000080] sm:p-4'>
                    <p className='text-[10px] font-semibold tracking-widest text-[#2878E8] uppercase sm:text-xs md:text-sm'>
                        SLR Premium
                    </p>
                    <p className='font-bebas-neue mt-2 text-[40px] leading-none font-extrabold text-white sm:text-[52px] md:text-[60px] lg:text-[50px] xl:text-[60px]'>
                        $26
                    </p>
                    <p className='mt-1 text-[10px] tracking-wide text-[#8EA0B8] uppercase sm:text-xs'>/ Month</p>
                </div>
            </div>

            <p className='text-slr-navy-foreground/60 mx-auto mt-10 max-w-2xl px-4 text-center text-xs'>
                Smart Life Rewards is a membership platform designed to help Australians access value through rewards,
                promotional prizes, partner discounts, and digital offers.
            </p>
        </section>
    );
};

export default PricingSection;
