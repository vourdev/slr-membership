import Image from 'next/image';

import PricingSection from './pricing-section';

const categories = [
    {
        icon: '/icons/ic-list-slr-smart-life-reward-1.webp',
        title: 'Member \n& Community'
    },
    {
        icon: '/icons/ic-list-slr-smart-life-reward-2.webp',
        title: 'Rewards \n& Draws'
    },
    {
        icon: '/icons/ic-list-slr-smart-life-reward-3.webp',
        title: 'Discounts \n& Contests'
    },
    {
        icon: '/icons/ic-list-slr-smart-life-reward-4.webp',
        title: 'Prize Draws \n& ODDS'
    },
    {
        icon: '/icons/ic-list-slr-smart-life-reward-5.webp',
        title: 'Chart \nBenefits'
    }
];

const DiscountPartnerSection = () => {
    return (
        <section className='bg-slr-navy-deep relative py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='mb-8 text-center'>
                    <div className='mt-4 flex w-full items-center justify-center gap-2'>
                        <div className='h-px w-16 bg-[linear-gradient(270deg,#E2B42B_0%,rgba(255,255,255,0)_100%)]'></div>
                        <p className='text-xs font-semibold text-[#E2B42B] uppercase md:text-sm'>Gain Access To Our</p>
                        <div className='h-px w-16 bg-[linear-gradient(90deg,#E2B42B_0%,rgba(255,255,255,0)_100%)]'></div>
                    </div>

                    <h2 className='font-bebas-neue mt-2 text-center text-[56px] leading-[0.90] font-medium tracking-wider text-white uppercase md:text-[72px] md:leading-none'>
                        Exclusive Discount Partner Program
                    </h2>
                    <p className='mt-2 text-center text-sm leading-relaxed text-[#AA8720] xl:text-base'>
                        And Community Support & Discounts
                    </p>
                </div>

                {/* SLR Circle Badge */}
                <div className='mt-4 flex justify-center'>
                    <Image
                        src='/images/slr-rewards-partner-program.webp'
                        alt='Transparent System Pie Chart'
                        width={540}
                        height={361}
                        className='h-auto w-full max-w-sm object-contain'
                    />
                </div>

                {/* Category cards */}
                <div className='mt-12 grid grid-cols-2 gap-4 md:grid-cols-5'>
                    {categories.map((cat) => (
                        <div className='flex w-full flex-col items-center' key={cat.title}>
                            <div className='flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#0C0E1C_49.73%,#161A30_98.65%)] p-4 text-center shadow-[0px_0px_13px_0px_#00000080] backdrop-blur-sm transition-all duration-300 hover:border-[#F5D78E]/40 hover:shadow-[0px_0px_20px_0px_#000000A0]'>
                                <Image
                                    src={cat.icon}
                                    alt={cat.title}
                                    width={140}
                                    height={140}
                                    className='h-35 w-35 object-contain'
                                />
                            </div>
                            <p className='font-bebas-neue mt-4 bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-center text-xl leading-none font-extrabold whitespace-pre-line text-transparent'>
                                {cat.title}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Star */}
                <div className='my-16 md:my-24'>
                    <div className='flex w-full items-center justify-center gap-2'>
                        <div className='h-px w-75 bg-[linear-gradient(270deg,#E2B42B_0%,rgba(255,255,255,0)_100%)]'></div>
                        <Image
                            src='/icons/ic-star.png'
                            alt='Star Icon'
                            width={20}
                            height={20}
                            className='mt-0.5 h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5'
                        />
                        <Image
                            src='/icons/ic-star.png'
                            alt='Star Icon'
                            width={20}
                            height={20}
                            className='mt-0.5 h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5'
                        />
                        <Image
                            src='/icons/ic-star.png'
                            alt='Star Icon'
                            width={20}
                            height={20}
                            className='mt-0.5 h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5'
                        />
                        <div className='h-px w-75 bg-[linear-gradient(90deg,#E2B42B_0%,rgba(255,255,255,0)_100%)]'></div>
                    </div>
                </div>
                <PricingSection />
            </div>
        </section>
    );
};

export default DiscountPartnerSection;
