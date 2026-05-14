import Image from 'next/image';

const benefits = [
    {
        icon: '/icons/ic-list-member-benefit-1.webp',
        title: 'Weekly Prize Draws',
        description: 'Up to 7 prize draws every week — cash, gift cards, and exclusive member giveaways.'
    },
    {
        icon: '/icons/ic-list-member-benefit-2.webp',
        title: 'Affiliated Discounts',
        description: 'Save with hundreds of trusted Australian partner brands — fuel, groceries, dining & more.'
    },
    {
        icon: '/icons/ic-list-member-benefit-3.webp',
        title: 'Digital Offers',
        description: 'Instant digital deals, different every Monday. Track wins, check rewards, redeem instantly.'
    },
    {
        icon: '/icons/ic-list-member-benefit-4.webp',
        title: 'Exclusive Giveaways',
        description: 'Member-only access to giveaways and seasonal events — only for active SLR members.'
    }
];

const stats = [
    {
        icon: '/icons/ic-member-benefit-1.webp',
        title: 'Visitors $50 Weekly Draws',
        description: 'Sign up to get a chance to win prizes.'
    },
    {
        icon: '/icons/ic-member-benefit-2.webp',
        title: 'Car monthly draw',
        description: 'Win a Car or major prize giveaways.'
    }
];

const WhyJoinSection = () => {
    return (
        <section className='bg-slr-navy-deep relative py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='flex flex-col items-center justify-center xl:flex-row xl:justify-between'>
                    <div className='flex flex-col'>
                        <div className='mt-4 flex w-full items-center justify-center gap-2 xl:justify-start'>
                            <div className='h-px w-16 bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]'></div>
                            <p className='text-xs font-semibold text-[#E2B42B] uppercase md:text-sm'>Member Benefits</p>
                            <div className='h-px w-16 bg-[linear-gradient(90deg,#B08A20_0%,rgba(255,255,255,0)_100%)]'></div>
                        </div>
                        <h2 className='font-bebas-neue mt-3 text-center text-[56px] leading-[0.90] font-medium tracking-wider text-white uppercase md:text-[72px] md:leading-none'>
                            Why Members
                            <span className='block bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-transparent md:ml-3 md:inline'>
                                Join SLR?
                            </span>
                        </h2>
                    </div>
                    <p className='mt-3 max-w-sm text-center text-sm leading-relaxed text-[#CDCECF] xl:max-w-xs xl:text-right xl:text-base'>
                        More than just a rewards club — a smarter way to live and save in Australia.
                    </p>
                </div>

                <div className='mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2'>
                    {/* Benefits list */}
                    <ul className='space-y-4'>
                        {benefits.map((benefit) => (
                            <li
                                key={benefit.title}
                                className='relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-5 shadow-[0px_0px_20px_0px_#776D6D26] backdrop-blur-sm transition-all duration-300 hover:border-[#F5D78E]/40 hover:shadow-[0px_0px_25px_0px_#776D6D36]'>
                                {/* Background Grid Decoration */}
                                <div className='pointer-events-none absolute top-0 -right-15 xl:right-5'>
                                    <Image
                                        src='/images/grid-background-list-card.webp'
                                        alt='Grid Decoration'
                                        width={300}
                                        height={300}
                                        className='object-contain'
                                    />
                                </div>

                                {/* Icon Section */}
                                <div className='relative z-10 shrink-0'>
                                    <div className='relative h-20 w-20 sm:h-24 sm:w-24 lg:h-30 lg:w-30'>
                                        <Image
                                            src={benefit.icon}
                                            alt={benefit.title}
                                            fill
                                            sizes='(max-width: 640px) 80px, (max-width: 1024px) 96px, 120px'
                                            className='object-contain'
                                        />
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className='relative z-10 space-y-2'>
                                    <h3 className='text-slr-navy-foreground font-bebas-neue text-xl font-bold uppercase md:text-2xl'>
                                        {benefit.title}
                                    </h3>
                                    <p className='text-slr-navy-foreground/60 text-xs font-normal uppercase sm:text-sm md:text-base'>
                                        {benefit.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pie chart and stats */}
                    <div className='space-y-18'>
                        <h3 className='text-slr-navy-foreground font-bebas-neue text-center text-4xl font-bold tracking-wide uppercase md:text-5xl'>
                            Transparent System & Chart
                        </h3>
                        <div className='mt-4 flex justify-center'>
                            <Image
                                src='/images/transparent-system-pie-chart.webp'
                                alt='Transparent System Pie Chart'
                                width={540}
                                height={361}
                                className='h-auto w-full max-w-sm object-contain'
                            />
                        </div>

                        <div className='space-y-3'>
                            {stats.map((stat) => (
                                <div
                                    key={stat.title}
                                    className='relative flex items-center gap-4 overflow-hidden rounded-xl p-4'>
                                    <div className='pointer-events-none absolute -right-15 xl:right-5'>
                                        <Image
                                            src='/images/grid-background-card.webp'
                                            alt='Grid Decoration'
                                            width={400}
                                            height={300}
                                            className='object-contain'
                                        />
                                    </div>
                                    <div className='relative h-20 w-20 shrink-0 sm:h-24 sm:w-24 lg:h-30 lg:w-30'>
                                        <Image src={stat.icon} alt={stat.title} fill className='object-contain' />
                                    </div>
                                    <div className='space-y-2'>
                                        <p className='text-slr-navy-foreground font-bebas-neue text-xl font-bold uppercase md:text-2xl'>
                                            {stat.title}
                                        </p>
                                        <p className='text-slr-navy-foreground/60 text-xs uppercase sm:text-sm md:text-base'>
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyJoinSection;
