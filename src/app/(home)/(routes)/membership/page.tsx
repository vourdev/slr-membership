import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { goldButtonStyle } from '@/lib/styles';

import PageHero from '../_components/page-hero';
import ComparisonMatrix from './_components/comparison-matrix';
import { CheckCircle2, Sparkles, Tag } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Membership · SLR Rewards',
    description:
        "Compare Smart Life Rewards membership tiers — Visitor (free), SLR Red ($10/mo), and SLR Premium ($26/mo). Choose the plan that's right for you."
};

const tierCardStyles = {
    visitor: {
        wrapper: 'border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)]',
        eyebrow: 'text-slr-dim',
        price: 'text-white'
    },
    red: {
        wrapper: 'border-[#C8152E66] bg-[linear-gradient(154.36deg,#1C0308_0.82%,#2A0810_49.73%,#1A0306_98.65%)]',
        eyebrow: 'text-[#E88888]',
        price: 'text-white'
    },
    blue: {
        wrapper: 'border-[#2878E84D] bg-[linear-gradient(154.36deg,#0E1828_0.82%,#142034_49.73%,#0E1828_98.65%)]',
        eyebrow: 'text-[#6AB0F0]',
        price: 'text-white'
    }
};

const tiers = [
    {
        key: 'visitor' as const,
        eyebrow: 'Free',
        name: 'Visitor',
        price: 'FREE',
        priceNote: 'No credit card required',
        tagline: 'Try SLR without committing — enter the weekly Visitor draw and explore the platform.',
        bestFor: 'Curious newcomers',
        perks: [
            'Weekly Visitor draw ($50 cash, state-based)',
            'Browse the partner discount directory',
            'Browse e-book listings',
            'Email notifications for new draws'
        ],
        cta: 'Sign Up Free',
        href: '/sign-up'
    },
    {
        key: 'red' as const,
        eyebrow: 'Most popular',
        name: 'SLR Red',
        price: '$10',
        priceNote: '/ month · billed via Stripe',
        tagline: 'Real value from day one — partner discount codes, weekly draws, and full e-book access.',
        bestFor: 'Everyday savers',
        perks: [
            'Up to 7 prize draws every week',
            '4–7 entries per cycle, state + tier pool',
            'Unlock all partner discount codes',
            'Read all e-books in your browser',
            'One Spin Wheel attempt per cycle',
            'Monthly mega draw eligibility'
        ],
        cta: 'Join Red · $10/mo',
        href: '/sign-up'
    },
    {
        key: 'blue' as const,
        eyebrow: 'Best value',
        name: 'SLR Premium',
        price: '$26',
        priceNote: '/ month · billed via Stripe',
        tagline: 'The full SLR experience — premium prize pool, member-only deals, and priority support.',
        bestFor: 'Maximum rewards',
        perks: [
            'Everything in SLR Red',
            '10+ entries per cycle, Premium pool',
            'Premium prize pool (cars, holidays, cash)',
            'Member-only discount deals',
            'Priority customer support',
            'BENY add-on available (+$5/mo)'
        ],
        cta: 'Join Premium · $26/mo',
        href: '/sign-up'
    }
];

const MembershipPage = () => {
    return (
        <>
            <PageHero
                eyebrow='Choose Your Plan'
                title={
                    <>
                        Pick The Right{' '}
                        <span className='bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-transparent'>
                            Membership
                        </span>
                    </>
                }
                description='Three tiers. One flat monthly price each. Real value from the very first day — no contracts, no fine print, cancel any time.'
            />

            <section className='bg-slr-navy-deep relative py-12 md:py-16'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                        {tiers.map((tier) => {
                            const s = tierCardStyles[tier.key];
                            const isFeatured = tier.key === 'red';

                            return (
                                <div
                                    key={tier.key}
                                    className={`relative flex flex-col rounded-2xl border p-6 shadow-[0px_0px_20px_0px_#776D6D26] md:p-8 ${s.wrapper} ${isFeatured ? 'lg:-mt-4 lg:mb-4 lg:scale-[1.02]' : ''}`}>
                                    {isFeatured && (
                                        <div
                                            className='absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-bold tracking-widest uppercase'
                                            style={{
                                                color: '#0C1132',
                                                background:
                                                    'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)'
                                            }}>
                                            Most popular
                                        </div>
                                    )}

                                    <p className={`text-xs font-semibold tracking-widest uppercase ${s.eyebrow}`}>
                                        {tier.eyebrow}
                                    </p>
                                    <h2 className='font-bebas-neue mt-2 text-3xl tracking-wider text-white uppercase md:text-4xl'>
                                        {tier.name}
                                    </h2>

                                    <div className='mt-4 flex items-baseline gap-2'>
                                        <span
                                            className={`font-bebas-neue text-5xl font-extrabold md:text-6xl ${s.price}`}>
                                            {tier.price}
                                        </span>
                                    </div>
                                    <p className='text-slr-dim mt-1 text-xs'>{tier.priceNote}</p>

                                    <p className='text-slr-muted mt-5 text-sm leading-relaxed'>{tier.tagline}</p>

                                    <div className='mt-6 rounded-lg border border-white/5 bg-white/2 p-3'>
                                        <p className='text-slr-dim text-[10px] font-semibold tracking-widest uppercase'>
                                            Best for
                                        </p>
                                        <p className='mt-0.5 text-sm font-semibold text-white'>{tier.bestFor}</p>
                                    </div>

                                    <ul className='mt-6 space-y-3'>
                                        {tier.perks.map((perk) => (
                                            <li key={perk} className='flex items-start gap-2.5'>
                                                <CheckCircle2 className='mt-0.5 h-4 w-4 shrink-0 text-[#FFDC75]' />
                                                <span className='text-sm leading-relaxed text-white/90'>{perk}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className='mt-8 pt-2'>
                                        <Link href={tier.href}>
                                            <Button
                                                style={isFeatured ? goldButtonStyle : undefined}
                                                className={
                                                    isFeatured
                                                        ? 'h-11 w-full rounded-xl font-bold uppercase'
                                                        : 'h-11 w-full rounded-xl border border-[#FFD147] bg-[#FFD1471A] font-semibold text-[#FFDC75] uppercase hover:bg-[#FFD14726] hover:text-[#FFDC75]'
                                                }
                                                variant={isFeatured ? 'default' : 'outline'}>
                                                {tier.cta}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p className='text-slr-dim mt-6 text-center text-xs'>
                        All prices in AUD. Billed monthly through Stripe. Cancel any time from your account.
                    </p>
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-16'>
                <div className='mx-auto max-w-6xl px-4'>
                    <div className='mb-10 text-center'>
                        <div className='mt-4 flex w-full items-center justify-center gap-2'>
                            <div className='h-px w-16 bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]'></div>
                            <p className='text-slr-gold-label text-xs font-semibold uppercase md:text-sm'>
                                Side-by-side
                            </p>
                            <div className='h-px w-16 bg-[linear-gradient(90deg,#B08A20_0%,rgba(255,255,255,0)_100%)]'></div>
                        </div>
                        <h2 className='font-bebas-neue mt-3 text-3xl tracking-wider text-white uppercase md:text-5xl'>
                            Compare every feature
                        </h2>
                        <p className='text-slr-muted mx-auto mt-3 max-w-xl text-sm md:text-base'>
                            What you get at each tier — draws, discounts, content, and account perks.
                        </p>
                    </div>

                    <ComparisonMatrix />
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-16'>
                <div className='mx-auto max-w-6xl px-4'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='rounded-2xl border border-[#D4AF3759] bg-[linear-gradient(154.36deg,#140E00_0.82%,#1E1600_49.73%,#140E00_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26] md:p-8'>
                            <div
                                className='inline-flex h-12 w-12 items-center justify-center rounded-xl'
                                style={{
                                    background:
                                        'linear-gradient(89.12deg, rgba(245,215,142,0.15) 3.07%, rgba(212,175,55,0.15) 41.36%, rgba(255,224,102,0.15) 60.5%, rgba(160,112,24,0.15) 98.79%)',
                                    border: '1px solid #D4AF3759'
                                }}>
                                <Tag className='h-6 w-6 text-[#FFDC75]' />
                            </div>
                            <h3 className='font-bebas-neue mt-4 text-2xl tracking-wider text-white uppercase md:text-3xl'>
                                BENY Add-on
                                <span className='ml-2 align-middle text-base font-normal text-[#FFDC75]'>+$5/mo</span>
                            </h3>
                            <p className='text-slr-muted mt-3 text-sm leading-relaxed'>
                                Unlock the BENY premium discount platform — thousands of additional offers from
                                Australian brands across travel, dining, retail, and more. Available to Red and Premium
                                members. Activation requires a phone number.
                            </p>
                            <p className='text-slr-dim mt-3 text-xs'>
                                Optional. Add during checkout or any time from your account. Cancel any time.
                            </p>
                        </div>

                        <div className='rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26] md:p-8'>
                            <div
                                className='inline-flex h-12 w-12 items-center justify-center rounded-xl'
                                style={{
                                    background:
                                        'linear-gradient(89.12deg, rgba(245,215,142,0.15) 3.07%, rgba(212,175,55,0.15) 41.36%, rgba(255,224,102,0.15) 60.5%, rgba(160,112,24,0.15) 98.79%)',
                                    border: '1px solid #D4AF3759'
                                }}>
                                <Sparkles className='h-6 w-6 text-[#FFDC75]' />
                            </div>
                            <h3 className='font-bebas-neue mt-4 text-2xl tracking-wider text-white uppercase md:text-3xl'>
                                Spin Wheel
                            </h3>
                            <p className='text-slr-muted mt-3 text-sm leading-relaxed'>
                                Every paid member gets one spin during registration checkout each cycle. Outcomes
                                include bonus entries, discount credit, a percentage discount on your next invoice, or
                                no prize. The wheel resets every cycle.
                            </p>
                            <p className='text-slr-dim mt-3 text-xs'>
                                Included with Red and Premium. See{' '}
                                <Link href='/giveaway-rules' className='text-[#FFDC75] hover:underline'>
                                    Giveaway Rules
                                </Link>{' '}
                                for full details.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-20'>
                <div className='mx-auto max-w-4xl px-4'>
                    <div className='relative isolate rounded-2xl p-1.25 shadow-[0px_0px_20px_0px_#776D6D26]'>
                        <div
                            className='absolute inset-0 -z-10 rounded-2xl bg-[linear-gradient(180deg,#FFE066_10%,#D4AF37_25%,#A07018_75%,#D4AF37_87%,#FFE066_100%)] mask-exclude p-1.25 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]'
                            aria-hidden='true'
                        />
                        <div className='rounded-[calc(1rem-5px)] bg-[linear-gradient(180deg,#1A1408_0%,#0C0A04_50%,#1A1408_100%)] p-8 text-center md:p-12'>
                            <Image
                                src='/images/slr-rewards-logo-color.webp'
                                alt='SLR Rewards'
                                width={100}
                                height={100}
                                className='mx-auto h-16 w-auto'
                            />
                            <h2 className='font-bebas-neue mt-6 text-3xl tracking-wider text-white uppercase md:text-5xl'>
                                Start saving today
                            </h2>
                            <p className='text-slr-muted mx-auto mt-3 max-w-md text-sm md:text-base'>
                                Join free or unlock the full club — your first cycle of entries starts as soon as your
                                first payment clears.
                            </p>
                            <div className='mt-6 flex flex-wrap justify-center gap-3'>
                                <Link href='/sign-up'>
                                    <Button
                                        style={goldButtonStyle}
                                        className='h-11 rounded-xl px-8 font-bold uppercase'>
                                        Join Now
                                    </Button>
                                </Link>
                                <Link href='/faq'>
                                    <Button
                                        variant='outline'
                                        className='h-11 rounded-xl border border-[#FFD147] bg-[#FFD1471A] px-8 font-semibold text-[#FFDC75] hover:bg-[#FFD14726] hover:text-[#FFDC75]'>
                                        Read FAQ
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MembershipPage;
