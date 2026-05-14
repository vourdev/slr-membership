import Image from 'next/image';
import Link from 'next/link';

import { Spotlight } from '@/components/ui/spotlight';
import { StarsBackground } from '@/components/ui/stars-background';
import { cn } from '@/lib/utils';

const HeroSection = () => {
    return (
        <section className='slr-stars-bg relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20'>
            {/* Spotlight effect — dim white beams, 3 from each top corner.
                #1 & #2 share the same length; #3 is shorter and dimmer. */}

            {/* LEFT corner */}
            <Spotlight className='-top-40 -left-10 h-[70vh] md:-top-40 md:left-40' fill='white' fillOpacity={0.08} />
            <Spotlight className='-top-40 -left-40 h-[70vh] md:top-0 md:left-30' fill='white' fillOpacity={0.08} />
            <Spotlight className='-top-10 -left-10 h-[55vh] md:top-10 md:-left-10' fill='white' fillOpacity={0.06} />

            {/* RIGHT corner — mirrored horizontally */}
            <Spotlight
                className='-top-40 -right-10 h-[60vh] scale-x-[-1] md:-top-40 md:right-40'
                fill='white'
                fillOpacity={0.08}
            />
            <Spotlight
                className='-top-40 -right-40 h-[60vh] scale-x-[-1] md:top-0 md:right-30'
                fill='white'
                fillOpacity={0.08}
            />
            <Spotlight
                className='-top-10 -right-10 h-[55vh] scale-x-[-1] md:top-10 md:-right-10'
                fill='white'
                fillOpacity={0.06}
            />
            {/* Radial vignette — uses #131619 (not black) so edges blend with the section that follows */}
            <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-[#131619] mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]'></div>

            <div className='absolute top-0 left-0 flex h-screen w-full items-center justify-center bg-[#131619]'>
                <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-[#131619] mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]' />
            </div>

            <StarsBackground />

            {/* Decorative circle gradients — rendered BEFORE the grid so the grid lines stay visible across them */}
            <div
                aria-hidden='true'
                className='pointer-events-none absolute top-[15%] z-10 hidden h-105 w-200 rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.45)_0%,rgba(147,51,234,0.18)_1%,transparent_70%)] mix-blend-screen blur-3xl md:-left-30 md:h-180 xl:block'
            />
            <div
                aria-hidden='true'
                className='pointer-events-none absolute top-[15%] z-10 hidden h-105 w-200 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.12)_1%,transparent_70%)] mix-blend-screen blur-3xl md:-right-30 md:h-180 xl:block'
            />

            {/* Grid pattern — placed on top so the lines remain visible even where the circle gradients glow */}
            <div
                className={cn(
                    'pointer-events-none absolute inset-0 z-[15]',
                    'bg-size-[100px_100px]',
                    'bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]'
                )}
            />

            {/* Bottom fade — smooth gradient to #131619 so hero merges seamlessly with the next section */}
            <div
                aria-hidden='true'
                className='pointer-events-none absolute right-0 bottom-0 left-0 z-[16] h-48 bg-gradient-to-b from-transparent to-[#131619]'
            />

            <div className='relative z-20 mx-auto max-w-6xl px-4'>
                {/* Logo */}
                <div className='mb-8 flex justify-center'>
                    <Image
                        src='/images/slr-rewards-logo-color.webp'
                        alt='SLR Rewards'
                        width={140}
                        height={140}
                        priority
                        className='h-20 w-auto md:h-24'
                    />
                </div>

                {/* Heading */}
                <div className='mb-5 text-center'>
                    <h1 className='text-xl font-semibold text-white uppercase md:text-2xl xl:text-3xl'>
                        Australia&apos;s <span className='text-red-600'>Best Value</span>
                    </h1>
                    <h1 className='bg-[linear-gradient(180deg,#C2C2C2_4.17%,#D7D5D2_40.47%,#B1B1B1_58.61%,#A9A9A9_94.9%)] bg-clip-text text-center text-[34px] leading-[100%] font-extrabold tracking-[0.03em] text-transparent drop-shadow-[-3.78px_15.12px_33.65px_rgba(12,13,67,0.37)] [leading-trim:cap-height] sm:text-[54px] md:text-[64px] xl:text-[72px]'>
                        REWARDS CLUB
                    </h1>
                    <div className='mt-4 flex w-full items-center justify-center gap-4'>
                        <div className='h-px w-8 bg-[linear-gradient(270deg,#FFFFFF_0%,#14171A_100%)]'></div>

                        {/* Teks Tengah */}
                        <p className='text-sm whitespace-nowrap text-[#E8E9E9] md:text-base'>
                            Helping Australians Beat the Cost of Living
                        </p>

                        <div className='h-px w-8 bg-[linear-gradient(90deg,#FFFFFF_0%,#14171A_100%)]'></div>
                    </div>
                </div>

                {/* Stat pills */}
                <div className='mb-8 flex justify-center'>
                    <Image
                        src='/images/slr-list-reward.webp'
                        alt='List SLR Rewards'
                        width={420}
                        height={420}
                        priority
                        className='h-auto w-auto'
                    />
                </div>

                {/* CTA */}
                <div className='mt-8 flex flex-col items-center gap-3'>
                    <Link href='/sign-up'>
                        <Image
                            src='/images/join-membership-now.webp'
                            alt='List SLR Rewards'
                            width={383}
                            height={383}
                            priority
                            className='h-15 w-auto sm:h-20 md:h-23'
                        />
                    </Link>
                </div>

                {/* TV / Giveaway image */}
                <div className='relative mt-12 flex justify-center'>
                    <div className='relative w-full max-w-3xl'>
                        <Image
                            src='/images/giveaway-win.webp'
                            alt='Giveaway and Win Cash Prizes'
                            width={1200}
                            height={700}
                            priority
                            className='h-auto w-full object-contain'
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
