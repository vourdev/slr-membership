import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import PageHero from '../_components/page-hero';
import {
    Award,
    CalendarCheck,
    CreditCard,
    HeartHandshake,
    Layers,
    Map,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Ticket,
    Trophy,
    UserPlus
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'About · SLR Rewards',
    description:
        'Smart Life Rewards is an Australian membership club built to help everyday Australians beat the cost of living through weekly draws, partner discounts, and digital offers.'
};

const goldButtonStyle: React.CSSProperties = {
    color: '#0C1132',
    background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
    borderTop: '2px solid #FFDC75'
};

const stats = [
    { icon: Map, label: 'States & territories', value: '8' },
    { icon: CalendarCheck, label: 'Draws per week', value: 'Up to 7' },
    { icon: Layers, label: 'Membership tiers', value: '3' },
    { icon: ShieldCheck, label: 'Backed by', value: 'TPAL' }
];

const howItWorks = [
    {
        icon: UserPlus,
        title: 'Sign up',
        body: 'Pick your tier — free Visitor, $10 Red, or $26 Premium. Tell us your state for the draw pool.'
    },
    {
        icon: Ticket,
        title: 'Get entries',
        body: 'Entries are allocated automatically after each successful monthly payment. Reset every cycle.'
    },
    {
        icon: Trophy,
        title: 'Win prizes',
        body: 'TPAL processes the draw under permit. Winners are notified by email and SMS — no claims needed.'
    },
    {
        icon: RefreshCw,
        title: 'Renew or cancel',
        body: 'Auto-renew each month at the same price, or cancel from your account any time. No fine print.'
    }
];

const values: {
    icon: typeof HeartHandshake;
    title: string;
    body: string;
    accent: 'gold' | 'red' | 'blue';
}[] = [
    {
        icon: HeartHandshake,
        title: 'Made for Australians',
        body: 'Every feature is designed around how Australians actually spend, save, and live — fuel, groceries, dining, and family essentials.',
        accent: 'gold'
    },
    {
        icon: ShieldCheck,
        title: 'Transparent & compliant',
        body: 'Draws are processed by TPAL, an independent authorised provider, so every winner is selected fairly and in line with permit requirements.',
        accent: 'red'
    },
    {
        icon: Sparkles,
        title: 'Real value, every month',
        body: 'Your membership pays for itself through partner discounts alone — prize draws and digital offers are the bonus on top.',
        accent: 'blue'
    },
    {
        icon: Award,
        title: 'No tricks, no fine print',
        body: 'Flat monthly pricing, no hidden fees, no auto-upsells. Cancel any time from your account.',
        accent: 'gold'
    }
];

const accentStyles = {
    gold: {
        wrap: 'border-[#D4AF3759]',
        bg: 'bg-[linear-gradient(89.12deg,rgba(245,215,142,0.15)_3.07%,rgba(212,175,55,0.15)_41.36%,rgba(255,224,102,0.15)_60.5%,rgba(160,112,24,0.15)_98.79%)]',
        text: 'text-[#FFDC75]'
    },
    red: { wrap: 'border-[#C8152E66]', bg: 'bg-[#C8152E1A]', text: 'text-[#E88888]' },
    blue: { wrap: 'border-[#2878E84D]', bg: 'bg-[#2878E81A]', text: 'text-[#6AB0F0]' }
};

const partnerLogos = Array.from({ length: 10 }, (_, i) => `/images/list-partner-logo-${i + 1}.webp`);

const AboutPage = () => {
    return (
        <>
            <PageHero
                eyebrow='Our Story'
                title={
                    <>
                        About <span className='text-red-600'>Smart Life</span>{' '}
                        <span className='bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-transparent'>
                            Rewards
                        </span>
                    </>
                }
                description="A homegrown rewards club, built to help everyday Australians beat the rising cost of living — one cycle at a time."
            />

            <section className='bg-slr-navy-deep relative py-12 md:py-20'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-2'>
                        <div className='order-2 lg:order-1'>
                            <div className='flex items-center gap-2'>
                                <div className='h-px w-12 bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                                <p className='text-xs font-semibold tracking-widest text-[#E2B42B] uppercase md:text-sm'>
                                    Our mission
                                </p>
                            </div>
                            <h2 className='font-bebas-neue mt-3 text-3xl tracking-wider text-white uppercase md:text-5xl xl:text-6xl'>
                                Why we built{' '}
                                <span className='bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-transparent'>
                                    SLR
                                </span>
                            </h2>
                            <div className='mt-5 space-y-4 text-sm leading-relaxed text-[#CDCECF] md:text-base'>
                                <p>
                                    Rewards programs in Australia were either tied to a single retailer or buried inside
                                    loyalty schemes nobody could actually use. Meanwhile the cost of living kept rising —
                                    fuel, groceries, energy, everything.
                                </p>
                                <p>
                                    We wanted a membership that worked the other way around. One flat monthly fee. Real
                                    discounts at the brands Australians already shop with. Weekly prize draws backed by
                                    a legally compliant provider. And the option to upgrade — or stay free — without
                                    ever being pressured.
                                </p>
                                <p>
                                    That is SLR today. A growing community of members across every state and territory,
                                    getting more value out of every dollar they already spend.
                                </p>
                            </div>
                            <div className='mt-7 flex flex-wrap gap-3'>
                                <Link href='/sign-up'>
                                    <Button style={goldButtonStyle} className='h-11 rounded-xl px-7 font-bold uppercase'>
                                        Join Now
                                    </Button>
                                </Link>
                                <Link href='/membership'>
                                    <Button
                                        variant='outline'
                                        className='h-11 rounded-xl border border-[#FFD147] bg-[#FFD1471A] px-7 font-semibold text-[#FFDC75] hover:bg-[#FFD14726] hover:text-[#FFDC75]'>
                                        Compare Plans
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className='order-1 flex justify-center lg:order-2'>
                            <div className='relative aspect-square w-full max-w-sm overflow-hidden rounded-full sm:max-w-md lg:max-w-full'>
                                <Image
                                    src='/images/smart-life.webp'
                                    alt='Australians enjoying Smart Life Rewards'
                                    fill
                                    sizes='(max-width: 1024px) 400px, 560px'
                                    className='object-cover'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-8 md:py-12'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='overflow-hidden rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] shadow-[0px_0px_20px_0px_#776D6D26]'>
                        <div className='grid grid-cols-2 divide-x divide-y divide-white/5 sm:grid-cols-4 sm:divide-y-0'>
                            {stats.map(({ icon: Icon, label, value }) => (
                                <div key={label} className='flex flex-col items-center gap-2 p-6 text-center md:p-8'>
                                    <div
                                        className='flex h-10 w-10 items-center justify-center rounded-xl'
                                        style={{
                                            background:
                                                'linear-gradient(89.12deg, rgba(245,215,142,0.15) 3.07%, rgba(212,175,55,0.15) 41.36%, rgba(255,224,102,0.15) 60.5%, rgba(160,112,24,0.15) 98.79%)',
                                            border: '1px solid #D4AF3759'
                                        }}>
                                        <Icon className='h-5 w-5 text-[#FFDC75]' />
                                    </div>
                                    <p className='font-bebas-neue bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl'>
                                        {value}
                                    </p>
                                    <p className='text-[10px] font-semibold tracking-widest text-[#8EA0B8] uppercase md:text-xs'>
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-20'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='text-center'>
                        <div className='flex w-full items-center justify-center gap-2'>
                            <div className='h-px w-16 bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                            <p className='text-xs font-semibold tracking-widest text-[#E2B42B] uppercase md:text-sm'>
                                Member journey
                            </p>
                            <div className='h-px w-16 bg-[linear-gradient(90deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                        </div>
                        <h2 className='font-bebas-neue mt-3 text-3xl tracking-wider text-white uppercase md:text-5xl'>
                            How SLR works
                        </h2>
                        <p className='mx-auto mt-3 max-w-xl text-sm text-[#CDCECF] md:text-base'>
                            Four steps from signing up to winning. No paperwork, no claim forms — the platform handles
                            it for you.
                        </p>
                    </div>

                    <div className='mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'>
                        {howItWorks.map(({ icon: Icon, title, body }, idx) => (
                            <div
                                key={title}
                                className='relative flex flex-col rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26]'>
                                <span className='font-bebas-neue absolute top-4 right-5 bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-5xl font-extrabold text-transparent opacity-30'>
                                    0{idx + 1}
                                </span>
                                <div
                                    className='flex h-12 w-12 items-center justify-center rounded-xl'
                                    style={{
                                        background:
                                            'linear-gradient(89.12deg, rgba(245,215,142,0.15) 3.07%, rgba(212,175,55,0.15) 41.36%, rgba(255,224,102,0.15) 60.5%, rgba(160,112,24,0.15) 98.79%)',
                                        border: '1px solid #D4AF3759'
                                    }}>
                                    <Icon className='h-6 w-6 text-[#FFDC75]' />
                                </div>
                                <h3 className='font-bebas-neue mt-5 text-xl tracking-wider text-white uppercase md:text-2xl'>
                                    {title}
                                </h3>
                                <p className='mt-2 text-sm leading-relaxed text-[#CDCECF]'>{body}</p>
                            </div>
                        ))}
                    </div>

                    <div className='mt-8 flex items-center justify-center gap-2 text-xs text-[#8EA0B8]'>
                        <CreditCard className='h-3.5 w-3.5' />
                        <span>Payments processed securely by Stripe. Draws conducted under permit by TPAL.</span>
                    </div>
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-20'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='text-center'>
                        <div className='flex w-full items-center justify-center gap-2'>
                            <div className='h-px w-16 bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                            <p className='text-xs font-semibold tracking-widest text-[#E2B42B] uppercase md:text-sm'>
                                Our principles
                            </p>
                            <div className='h-px w-16 bg-[linear-gradient(90deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                        </div>
                        <h2 className='font-bebas-neue mt-3 text-3xl tracking-wider text-white uppercase md:text-5xl'>
                            What we stand for
                        </h2>
                        <p className='mx-auto mt-3 max-w-xl text-sm text-[#CDCECF] md:text-base'>
                            Four principles guide every decision we make about features, pricing, and partnerships.
                        </p>
                    </div>

                    <div className='mt-12 grid grid-cols-1 gap-5 md:grid-cols-2'>
                        {values.map(({ icon: Icon, title, body, accent }) => {
                            const s = accentStyles[accent];
                            return (
                                <div
                                    key={title}
                                    className='flex items-start gap-4 rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-6 shadow-[0px_0px_20px_0px_#776D6D26] md:p-7'>
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${s.wrap} ${s.bg}`}>
                                        <Icon className={`h-6 w-6 ${s.text}`} />
                                    </div>
                                    <div>
                                        <h3 className='font-bebas-neue text-xl tracking-wider text-white uppercase md:text-2xl'>
                                            {title}
                                        </h3>
                                        <p className='mt-1 text-sm leading-relaxed text-[#CDCECF]'>{body}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-16'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='text-center'>
                        <div className='flex w-full items-center justify-center gap-2'>
                            <div className='h-px w-16 bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                            <p className='text-xs font-semibold tracking-widest text-[#E2B42B] uppercase md:text-sm'>
                                Trusted by
                            </p>
                            <div className='h-px w-16 bg-[linear-gradient(90deg,#B08A20_0%,rgba(255,255,255,0)_100%)]' />
                        </div>
                        <p className='mx-auto mt-3 max-w-xl text-sm text-[#CDCECF] md:text-base'>
                            Australian brands that work with SLR to bring members real, everyday value.
                        </p>
                    </div>

                    <div className='mt-10 grid grid-cols-3 items-center gap-4 sm:grid-cols-5 md:gap-6 lg:grid-cols-10'>
                        {partnerLogos.map((src) => (
                            <div
                                key={src}
                                className='relative flex aspect-square items-center justify-center rounded-xl border border-white/5 bg-white/2 p-3 transition-colors hover:border-white/10'>
                                <Image
                                    src={src}
                                    alt=''
                                    fill
                                    sizes='(max-width: 640px) 100px, 120px'
                                    className='object-contain p-3 opacity-80 transition-opacity hover:opacity-100'
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-20'>
                <div className='mx-auto max-w-4xl px-4'>
                    <div className='relative isolate rounded-2xl p-1.25 shadow-[0px_0px_20px_0px_#776D6D26]'>
                        <div
                            className='absolute inset-0 -z-10 rounded-2xl bg-[linear-gradient(180deg,#FFE066_10%,#D4AF37_25%,#A07018_75%,#D4AF37_87%,#FFE066_100%)] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] mask-exclude p-1.25'
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
                                Ready to start saving?
                            </h2>
                            <p className='mx-auto mt-3 max-w-md text-sm text-[#CDCECF] md:text-base'>
                                Join free as a Visitor, or unlock the full rewards club from $10/month.
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

export default AboutPage;
