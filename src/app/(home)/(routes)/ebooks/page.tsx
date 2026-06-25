import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import PageHero from '../_components/page-hero';
import EbookGrid from './_components/ebook-grid';
import { BookMarked, Lock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
    title: 'E-Books · SLR Rewards',
    description:
        'Browse the SLR e-book library — practical guides on cost of living, finance, family, health, and lifestyle. Read full content with SLR Red or Premium membership.'
};

const goldButtonStyle: React.CSSProperties = {
    color: '#0C1132',
    background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)',
    borderTop: '2px solid #FFDC75'
};

const accessLegend = [
    {
        icon: BookMarked,
        title: 'All members',
        body: 'Read in full — including the free Visitor tier.',
        dot: 'bg-[#7CD992]'
    },
    {
        icon: Sparkles,
        title: 'Red & Premium',
        body: 'Available with any paid membership ($10+ /month).',
        dot: 'bg-[#FFDC75]'
    },
    {
        icon: Lock,
        title: 'Premium only',
        body: 'Exclusive to SLR Premium members.',
        dot: 'bg-[#6AB0F0]'
    }
];

const EbooksPage = () => {
    return (
        <>
            <PageHero
                eyebrow='Digital Library'
                title={
                    <>
                        SLR{' '}
                        <span className='bg-[linear-gradient(89.12deg,#F5D78E_3.07%,#D4AF37_41.36%,#FFE066_60.5%,#A07018_98.79%)] bg-clip-text text-transparent'>
                            E-Books
                        </span>
                    </>
                }
                description='Practical, no-fluff guides written for everyday Australians — finance, family, career, health, and lifestyle. Read them all with Red or Premium membership.'
            />

            <section className='bg-slr-navy-deep relative py-8 md:py-12'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        {accessLegend.map(({ icon: Icon, title, body, dot }) => (
                            <div
                                key={title}
                                className='flex items-start gap-3 rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-5 shadow-[0px_0px_13px_0px_#00000080]'>
                                <div
                                    className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'
                                    style={{
                                        background:
                                            'linear-gradient(89.12deg, rgba(245,215,142,0.10) 3.07%, rgba(212,175,55,0.10) 41.36%, rgba(255,224,102,0.10) 60.5%, rgba(160,112,24,0.10) 98.79%)',
                                        border: '1px solid #D4AF3759'
                                    }}>
                                    <Icon className='h-5 w-5 text-[#FFDC75]' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <span className={`h-2 w-2 rounded-full ${dot}`} />
                                        <p className='font-bebas-neue text-lg tracking-wider text-white uppercase'>
                                            {title}
                                        </p>
                                    </div>
                                    <p className='mt-1 text-xs text-[#ADB0B5]'>{body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-16'>
                <div className='mx-auto max-w-7xl px-4'>
                    <EbookGrid />
                </div>
            </section>

            <section className='bg-slr-navy-deep relative py-12 md:py-20'>
                <div className='mx-auto max-w-4xl px-4'>
                    <div className='rounded-2xl border border-[#A0B4D259] bg-[linear-gradient(154.36deg,#141820_0.82%,#1E2530_49.73%,#141820_98.65%)] p-8 text-center shadow-[0px_0px_20px_0px_#776D6D26] md:p-12'>
                        <h2 className='font-bebas-neue text-3xl tracking-wider text-white uppercase md:text-5xl'>
                            Unlock the full library
                        </h2>
                        <p className='mx-auto mt-3 max-w-md text-sm text-[#ADB0B5] md:text-base'>
                            Every e-book reads in your browser — no downloads, no DRM tools. Included with SLR Red and
                            Premium from $10/month.
                        </p>
                        <div className='mt-6 flex flex-wrap justify-center gap-3'>
                            <Link href='/sign-up'>
                                <Button style={goldButtonStyle} className='h-11 rounded-xl px-8 font-bold uppercase'>
                                    Join SLR Red
                                </Button>
                            </Link>
                            <Link href='/membership'>
                                <Button
                                    variant='outline'
                                    className='h-11 rounded-xl border border-[#FFD147] bg-[#FFD1471A] px-8 font-semibold text-[#FFDC75] hover:bg-[#FFD14726] hover:text-[#FFDC75]'>
                                    Compare Plans
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EbooksPage;
