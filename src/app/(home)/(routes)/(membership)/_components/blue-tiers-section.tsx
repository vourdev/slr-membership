import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const bluePerks = {
    perks: [
        'Everything in SLR Red',
        'Premium prize entries',
        'Premium partner discounts',
        'Member-only experiences',
        'Priority customer support'
    ],
    rewards: [
        'Multiple tokens to win',
        'Bonus cash credits',
        'Premium digital deals',
        'Exclusive Black Plus tier access'
    ]
};

const upgrades = [
    { label: 'Silver', value: '$26', tokens: '1 Token' },
    { label: 'Platinum', value: '$52', tokens: '4 Tokens' },
    { label: 'Black', value: '$78', tokens: '7 Tokens' },
    { label: 'Black Plus', value: '$99', tokens: '10 Tokens' }
];

const BlueTiersSection = () => {
    return (
        <section className='slr-section-bg py-16 md:py-24'>
            <div className='mx-auto max-w-6xl px-4'>
                <div className='text-center'>
                    <p className='text-slr-navy-foreground/60 text-[10px] font-semibold tracking-[0.3em] uppercase md:text-xs'>
                        Premium Tier
                    </p>
                    <h2 className='text-slr-navy-foreground mt-3 text-3xl font-extrabold md:text-4xl'>
                        SLR <span className='text-slr-blue-tier'>BLUE</span> REWARD TIERS
                    </h2>
                    <p className='text-slr-navy-foreground/60 mx-auto mt-3 max-w-xl text-sm'>
                        Higher tiers — more chances to win.
                    </p>
                </div>

                <div className='mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Main blue card */}
                    <div className='relative overflow-hidden rounded-2xl border border-slr-blue-tier/60 bg-gradient-to-br from-slr-blue-tier/90 via-slr-blue-tier/70 to-slr-navy-deep p-6 shadow-xl'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <Image
                                    src='/icons/ic-slr-blue-reward.webp'
                                    alt='SLR Blue'
                                    width={56}
                                    height={56}
                                    className='h-12 w-12 object-contain'
                                />
                                <div>
                                    <p className='text-slr-blue-tier-foreground/80 text-[10px] tracking-[0.3em] uppercase'>
                                        Plan
                                    </p>
                                    <p className='text-slr-blue-tier-foreground text-2xl font-extrabold'>
                                        SLR BLUE PREMIUM <span className='text-slr-gold'>$26</span>
                                    </p>
                                </div>
                            </div>
                            <div className='bg-slr-gold text-slr-gold-foreground rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase'>
                                Premium
                            </div>
                        </div>
                        <p className='text-slr-blue-tier-foreground/80 mt-2 text-xs'>Per month — cancel anytime</p>

                        <div className='mt-6 grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <p className='text-slr-blue-tier-foreground/70 mb-2 text-[10px] tracking-widest uppercase'>
                                    Main Benefits
                                </p>
                                <ul className='space-y-1.5'>
                                    {bluePerks.perks.map((item) => (
                                        <li key={item} className='text-slr-blue-tier-foreground flex gap-2'>
                                            <span className='text-slr-gold'>✓</span>
                                            <span className='text-xs'>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className='text-slr-blue-tier-foreground/70 mb-2 text-[10px] tracking-widest uppercase'>
                                    SLR Blue Prize Rewards
                                </p>
                                <ul className='space-y-1.5'>
                                    {bluePerks.rewards.map((item) => (
                                        <li key={item} className='text-slr-blue-tier-foreground flex gap-2'>
                                            <span className='text-slr-gold'>✓</span>
                                            <span className='text-xs'>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <Link href='/sign-up' className='mt-6 block'>
                            <Button className='slr-gold-gradient text-slr-gold-foreground h-11 w-full rounded-full font-bold'>
                                Join Now · $26/mo
                            </Button>
                        </Link>
                    </div>

                    {/* Upgrade cards */}
                    <div className='space-y-4'>
                        {upgrades.map((tier, idx) => {
                            const iconSrc = `/icons/ic-list-slr-blue-reward-${idx + 1}.webp`;
                            return (
                                <div
                                    key={tier.label}
                                    className='border-slr-navy-border/60 bg-slr-navy-card/60 flex items-center justify-between rounded-xl border px-5 py-4 backdrop-blur-sm transition-colors hover:border-slr-blue-tier/50'>
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
                                            <p className='text-slr-navy-foreground/60 text-xs'>Membership entries</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <p className='text-slr-gold text-sm font-bold'>{tier.tokens}</p>
                                        <p className='text-slr-navy-foreground/60 text-[10px] tracking-wider uppercase'>
                                            All access
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <p className='text-slr-navy-foreground/50 mt-10 text-center text-xs'>
                    Each plan gives you one entry into the monthly member prize draws. Higher tiers = more chances to
                    win every month.
                </p>
            </div>
        </section>
    );
};

export default BlueTiersSection;
