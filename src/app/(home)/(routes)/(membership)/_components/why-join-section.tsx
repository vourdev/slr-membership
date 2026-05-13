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
        <section className='slr-section-bg py-16 md:py-24'>
            <div className='mx-auto max-w-6xl px-4'>
                <div className='text-center'>
                    <p className='text-slr-navy-foreground/60 text-[10px] font-semibold tracking-[0.3em] uppercase md:text-xs'>
                        Members Benefits
                    </p>
                    <h2 className='text-slr-navy-foreground mt-3 text-3xl font-extrabold md:text-4xl'>
                        WHY MEMBERS JOIN <span className='text-slr-gold'>SLR?</span>
                    </h2>
                </div>

                <div className='mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2'>
                    {/* Benefits list */}
                    <ul className='space-y-4'>
                        {benefits.map((benefit) => (
                            <li
                                key={benefit.title}
                                className='border-slr-navy-border/50 bg-slr-navy-card/60 flex items-start gap-4 rounded-2xl border p-5 backdrop-blur-sm transition-colors hover:border-slr-gold/40'>
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
