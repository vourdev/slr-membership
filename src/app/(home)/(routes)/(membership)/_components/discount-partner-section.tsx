import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const categories = [
    {
        icon: '/icons/ic-list-slr-smart-life-reward-1.webp',
        title: 'Hospitality',
        subtitle: '& Community'
    },
    {
        icon: '/icons/ic-list-slr-smart-life-reward-2.webp',
        title: 'Rewards',
        subtitle: 'Saving'
    },
    {
        icon: '/icons/ic-list-slr-smart-life-reward-3.webp',
        title: 'Discounts',
        subtitle: '& Contests'
    },
    {
        icon: '/icons/ic-list-slr-smart-life-reward-4.webp',
        title: 'Prize Draws',
        subtitle: 'In Australia'
    },
    {
        icon: '/icons/ic-list-slr-smart-life-reward-5.webp',
        title: 'Member',
        subtitle: 'Benefits'
    }
];

const DiscountPartnerSection = () => {
    return (
        <section className='slr-section-bg py-16 md:py-24'>
            <div className='mx-auto max-w-6xl px-4'>
                <div className='text-center'>
                    <p className='text-slr-navy-foreground/60 text-[10px] font-semibold tracking-[0.3em] uppercase md:text-xs'>
                        Member Access To
                    </p>
                    <h2 className='text-slr-navy-foreground mt-3 text-3xl font-extrabold md:text-4xl'>
                        EXCLUSIVE <span className='text-slr-gold'>DISCOUNT PARTNER</span> PROGRAM
                    </h2>
                    <p className='text-slr-navy-foreground/60 mx-auto mt-3 max-w-xl text-sm'>
                        Save thousands with our partner discounts.
                    </p>
                </div>

                {/* SLR Circle Badge */}
                <div className='mt-12 flex justify-center'>
                    <div className='relative'>
                        <div className='border-slr-gold/60 from-slr-blue-tier/50 to-slr-navy-deep shadow-[0_0_60px_-10px_var(--slr-gold)] flex aspect-square w-56 flex-col items-center justify-center rounded-full border-4 bg-gradient-to-br'>
                            <p className='text-slr-navy-foreground/60 text-[10px] tracking-[0.3em] uppercase'>
                                Rewards
                            </p>
                            <p className='text-slr-gold mt-1 text-4xl font-extrabold tracking-wider'>SLR</p>
                            <p className='text-slr-navy-foreground/80 mt-1 text-[10px] tracking-widest uppercase'>
                                Smart Life Rewards
                            </p>
                            <p className='text-slr-navy-foreground/50 mt-3 text-[9px] tracking-widest uppercase'>
                                Membership
                            </p>
                            <p className='text-slr-gold text-lg font-extrabold'>4 LIFE</p>
                            <Link href='/sign-up'>
                                <Button className='slr-gold-gradient text-slr-gold-foreground mt-3 h-8 rounded-full px-4 text-[10px] font-bold tracking-wider uppercase'>
                                    Start Here
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Category cards */}
                <div className='mt-12 grid grid-cols-2 gap-4 md:grid-cols-5'>
                    {categories.map((cat) => (
                        <div
                            key={cat.title}
                            className='border-slr-navy-border/60 bg-slr-navy-card/60 flex flex-col items-center gap-3 rounded-xl border p-4 text-center backdrop-blur-sm transition-colors hover:border-slr-gold/40'>
                            <Image
                                src={cat.icon}
                                alt={cat.title}
                                width={56}
                                height={56}
                                className='h-12 w-12 object-contain'
                            />
                            <div>
                                <p className='text-slr-navy-foreground text-xs font-bold'>{cat.title}</p>
                                <p className='text-slr-navy-foreground/60 text-[10px]'>{cat.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination dots */}
                <div className='mt-8 flex items-center justify-center gap-2'>
                    <span className='bg-slr-gold h-2 w-6 rounded-full' />
                    <span className='bg-slr-navy-foreground/30 h-2 w-2 rounded-full' />
                    <span className='bg-slr-navy-foreground/30 h-2 w-2 rounded-full' />
                </div>
            </div>
        </section>
    );
};

export default DiscountPartnerSection;
