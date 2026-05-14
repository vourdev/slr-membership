import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const redBenefits = {
    perks: [
        'Up to 7 prize draws every week',
        'Affiliated discounts',
        'Member-only deals',
        'Exclusive monthly mega draw'
    ],
    rewards: ['Digital offers', '$10 cash credit', '$50 voucher', '$100 prize ballot']
};

const upgrades = [
    { label: 'Red', value: '$10', chances: '1 chance', period: 'Monthly entries' },
    { label: 'Gold', value: '$20', chances: '4 chances', period: 'Member entries' },
    { label: 'Black', value: '$30', chances: '7 chances', period: 'Member entries' }
];

const RedTiersSection = () => {
    return (
        <section className='slr-section-bg py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <p className='text-slr-navy-foreground/60 text-[10px] font-semibold tracking-[0.3em] uppercase md:text-xs'>
                        Member Prize Tiers
                    </p>
                    <h2 className='text-slr-navy-foreground mt-3 text-3xl font-extrabold md:text-4xl'>
                        SLR <span className='text-slr-red-tier'>RED</span> REWARD TIERS
                    </h2>
                    <p className='text-slr-navy-foreground/60 mx-auto mt-3 max-w-xl text-sm'>
                        Membership tiers that build to your best level.
                    </p>
                </div>

                <div className='mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Main red card */}
                    <div className='border-slr-red-tier/60 from-slr-red-tier/90 via-slr-red-tier/70 to-slr-navy-deep relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-xl'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <Image
                                    src='/icons/ic-slr-red-reward.webp'
                                    alt='SLR Red'
                                    width={56}
                                    height={56}
                                    className='h-12 w-12 object-contain'
                                />
                                <div>
                                    <p className='text-slr-red-tier-foreground/80 text-[10px] tracking-[0.3em] uppercase'>
                                        Plan
                                    </p>
                                    <p className='text-slr-red-tier-foreground text-2xl font-extrabold'>
                                        SLR RED <span className='text-slr-gold'>$10</span>
                                    </p>
                                </div>
                            </div>
                            <div className='bg-slr-gold text-slr-gold-foreground rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase'>
                                Best Value
                            </div>
                        </div>
                        <p className='text-slr-red-tier-foreground/80 mt-2 text-xs'>Per month — cancel anytime</p>

                        <div className='mt-6 grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <p className='text-slr-red-tier-foreground/70 mb-2 text-[10px] tracking-widest uppercase'>
                                    Key Benefits
                                </p>
                                <ul className='space-y-1.5'>
                                    {redBenefits.perks.map((item) => (
                                        <li key={item} className='text-slr-red-tier-foreground flex gap-2'>
                                            <span className='text-slr-gold'>✓</span>
                                            <span className='text-xs'>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className='text-slr-red-tier-foreground/70 mb-2 text-[10px] tracking-widest uppercase'>
                                    SLR Red Tier Rewards
                                </p>
                                <ul className='space-y-1.5'>
                                    {redBenefits.rewards.map((item) => (
                                        <li key={item} className='text-slr-red-tier-foreground flex gap-2'>
                                            <span className='text-slr-gold'>✓</span>
                                            <span className='text-xs'>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <Link href='/sign-up' className='mt-6 block'>
                            <Button className='slr-gold-gradient text-slr-gold-foreground h-11 w-full rounded-full font-bold'>
                                Join Now · $10/mo
                            </Button>
                        </Link>
                    </div>

                    {/* Upgrade cards */}
                    <div className='space-y-4'>
                        {upgrades.map((tier, idx) => {
                            const iconSrc = `/icons/ic-list-slr-red-reward-${idx + 1}.webp`;
                            return (
                                <div
                                    key={tier.label}
                                    className='border-slr-navy-border/60 bg-slr-navy-card/60 hover:border-slr-red-tier/50 flex items-center justify-between rounded-xl border px-5 py-4 backdrop-blur-sm transition-colors'>
                                    <div className='flex items-center gap-4'>
                                        <Image
                                            src={iconSrc}
                                            alt={tier.label}
                                            width={44}
                                            height={44}
                                            className='h-10 w-10 object-contain'
                                        />
                                        <div>
                                            <p className='text-slr-navy-foreground text-sm font-bold tracking-widest uppercase'>
                                                {tier.label}
                                                <span className='text-slr-gold ml-2 text-base'>{tier.value}</span>
                                            </p>
                                            <p className='text-slr-navy-foreground/60 text-xs'>{tier.period}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-slr-gold text-sm font-bold'>{tier.chances}</p>
                                        <p className='text-slr-navy-foreground/60 text-[10px] tracking-wider uppercase'>
                                            Membership entries
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RedTiersSection;
