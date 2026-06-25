import { ReactNode } from 'react';

type PageHeroProps = {
    eyebrow: string;
    title: ReactNode;
    description?: ReactNode;
    accent?: 'gold' | 'red' | 'blue';
};

const accentStyles = {
    gold: {
        text: 'text-[#E2B42B]',
        lineLeft: 'bg-[linear-gradient(270deg,#B08A20_0%,rgba(255,255,255,0)_100%)]',
        lineRight: 'bg-[linear-gradient(90deg,#B08A20_0%,rgba(255,255,255,0)_100%)]'
    },
    red: {
        text: 'text-red-600',
        lineLeft: 'bg-[linear-gradient(270deg,#D0302F_0%,rgba(255,255,255,0)_100%)]',
        lineRight: 'bg-[linear-gradient(90deg,#D0302F_0%,rgba(255,255,255,0)_100%)]'
    },
    blue: {
        text: 'text-[#2878E8]',
        lineLeft: 'bg-[linear-gradient(270deg,#2878E8_0%,rgba(255,255,255,0)_100%)]',
        lineRight: 'bg-[linear-gradient(90deg,#2878E8_0%,rgba(255,255,255,0)_100%)]'
    }
};

const PageHero = ({ eyebrow, title, description, accent = 'gold' }: PageHeroProps) => {
    const a = accentStyles[accent];

    return (
        <section className='slr-stars-bg relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20'>
            <div
                aria-hidden='true'
                className='pointer-events-none absolute top-[10%] left-1/2 -z-0 hidden h-105 w-200 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.25)_0%,rgba(212,175,55,0.08)_1%,transparent_70%)] mix-blend-screen blur-3xl xl:block'
            />
            <div
                aria-hidden='true'
                className='pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-1/2 bg-linear-to-b from-transparent via-[#131619]/70 to-[#131619]'
            />

            <div className='relative z-20 mx-auto max-w-3xl px-4 text-center'>
                <div className='flex w-full items-center justify-center gap-2'>
                    <div className={`h-px w-16 ${a.lineLeft}`} />
                    <p className={`text-xs font-semibold uppercase md:text-sm ${a.text}`}>{eyebrow}</p>
                    <div className={`h-px w-16 ${a.lineRight}`} />
                </div>

                <h1 className='font-bebas-neue mt-3 text-center text-[48px] leading-[0.95] font-medium tracking-wider text-white uppercase md:text-[64px] xl:text-[72px]'>
                    {title}
                </h1>

                {description && (
                    <p className='mt-5 text-center text-sm leading-relaxed text-[#ADB0B5] md:text-base'>
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
};

export default PageHero;
