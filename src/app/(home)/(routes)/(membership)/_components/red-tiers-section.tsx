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
        <section className='bg-slr-navy-deep relative py-16 md:py-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <div className='mt-4 flex w-full items-center justify-center gap-2'>
                        <div className='h-px w-16 bg-[linear-gradient(270deg,#D0302F_0%,rgba(255,255,255,0)_100%)]'></div>
                        <p className='text-xs font-semibold text-red-600 uppercase md:text-sm'> Member Prize Tiers</p>
                        <div className='h-px w-16 bg-[linear-gradient(90deg,#D0302F_0%,rgba(255,255,255,0)_100%)]'></div>
                    </div>

                    <h2 className='font-bebas-neue mt-2 text-center text-[56px] leading-[0.90] font-medium tracking-wider text-white uppercase md:text-[72px] md:leading-none'>
                        SLR <span className='text-red-600'>RED</span> Reward Tiers
                    </h2>
                    <p className='mt-2 text-center text-sm leading-relaxed text-[#CDCECF] xl:text-base'>
                        Member prize tickets are base on your tier level.
                    </p>
                </div>

                <div className='mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {/* Main red card */}
                    <div className='relative isolate rounded-2xl p-1.25 shadow-[0px_0px_20px_0px_#776D6D26]'>
                        <div
                            className='absolute inset-0 -z-10 rounded-2xl bg-[linear-gradient(180deg,#FF6B7A_10%,#C8152E_25%,#8B0010_75.24%,#C8152E_87.62%,#FF6B7A_100%)] [mask-composite:exclude] p-[5px] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]'
                            aria-hidden='true'
                        />

                        {/* Isi Card dengan Background Gradient */}
                        <div className='relative overflow-hidden rounded-[calc(1rem-5px)] bg-[linear-gradient(180deg,#530710_0%,#37040D_30%,#220408_60%,#470818_87.62%)] p-6'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <Image
                                        src='/icons/ic-slr-red-reward.webp'
                                        alt='SLR Red'
                                        width={100}
                                        height={100}
                                        className='h-25 w-25 object-contain'
                                    />
                                    <div>
                                        <p className='text-2xl font-extrabold text-white'>
                                            SLR RED <span className='text-[#F5D78E]'>$10</span>
                                        </p>
                                    </div>
                                </div>
                                <div className='rounded-full bg-[#F5D78E] px-3 py-1 text-[10px] font-bold tracking-wider text-[#0C1132] uppercase'>
                                    Best Value
                                </div>
                            </div>

                            <p className='mt-2 text-xs text-white/60'>Per month — cancel anytime</p>

                            <div className='mt-6 grid grid-cols-2 gap-4 text-sm'>
                                <div>
                                    <p className='mb-2 text-[10px] font-bold tracking-widest text-[#FF6B7A] uppercase'>
                                        Key Benefits
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {redBenefits.perks.map((item) => (
                                            <li key={item} className='flex gap-2 text-white/90'>
                                                <span className='text-[#F5D78E]'>✓</span>
                                                <span className='text-xs'>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <p className='mb-2 text-[10px] font-bold tracking-widest text-[#FF6B7A] uppercase'>
                                        SLR Red Tier Rewards
                                    </p>
                                    <ul className='space-y-1.5'>
                                        {redBenefits.rewards.map((item) => (
                                            <li key={item} className='flex gap-2 text-white/90'>
                                                <span className='text-[#F5D78E]'>✓</span>
                                                <span className='text-xs'>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <Link href='/sign-up' className='mt-6 block'>
                                {/* Menggunakan styling button yang kita buat sebelumnya */}
                                <Button className='slr-gold-gradient h-11 w-full rounded-full border-t-2 border-[#FFDC75] font-bold text-[#0C1132] shadow-[inset_0px_8px_12px_0px_#FFFFFF14,inset_16px_24px_64px_-24px_#FFFFFF14,0px_24px_24px_-16px_#DAAF1133]'>
                                    Join Now · $10/mo
                                </Button>
                            </Link>
                        </div>
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
