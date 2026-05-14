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
        title: 'Visitors get weekly draws',
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
                                className='border-slr-navy-border/50 bg-slr-navy-card/60 hover:border-slr-gold/40 flex items-start gap-4 rounded-2xl border p-5 backdrop-blur-sm transition-colors'>
                                <div className='shrink-0'>
                                    <Image
                                        src={benefit.icon}
                                        alt={benefit.title}
                                        width={56}
                                        height={56}
                                        className='h-12 w-12 object-contain'
                                    />
                                </div>
                                <div>
                                    <h3 className='text-slr-navy-foreground text-base font-bold'>{benefit.title}</h3>
                                    <p className='text-slr-navy-foreground/70 mt-1 text-sm leading-relaxed'>
                                        {benefit.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pie chart and stats */}
                    <div className='space-y-6'>
                        <div className='border-slr-navy-border/50 bg-slr-navy-card/60 rounded-2xl border p-6 backdrop-blur-sm'>
                            <h3 className='text-slr-navy-foreground text-center text-lg font-bold tracking-wide uppercase'>
                                Transparent System & Chart
                            </h3>
                            <div className='mt-4 flex justify-center'>
                                <Image
                                    src='/images/transparent-system-pie-chart.webp'
                                    alt='Transparent System Pie Chart'
                                    width={420}
                                    height={420}
                                    className='h-auto w-full max-w-sm object-contain'
                                />
                            </div>
                        </div>

                        <div className='space-y-3'>
                            {stats.map((stat) => (
                                <div
                                    key={stat.title}
                                    className='border-slr-navy-border/50 bg-slr-navy-card/60 flex items-center gap-4 rounded-xl border p-4 backdrop-blur-sm'>
                                    <Image
                                        src={stat.icon}
                                        alt={stat.title}
                                        width={48}
                                        height={48}
                                        className='h-12 w-12 object-contain'
                                    />
                                    <div>
                                        <p className='text-slr-navy-foreground text-sm font-bold'>{stat.title}</p>
                                        <p className='text-slr-navy-foreground/60 text-xs'>{stat.description}</p>
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
