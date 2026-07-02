import type { Metadata } from 'next';

import SectionEyebrow from '@/components/common/section-eyebrow';

import { EbookLibraryGrid } from './_components/ebook-library-grid';

export const metadata: Metadata = {
    title: 'E-Book Library · SLR Rewards',
    description: 'Browse and download SLR digital ebooks — view each one in your browser or download the PDF.'
};

export default function EbookLibraryPage() {
    return (
        <main className='bg-slr-ink min-h-screen pt-28 pb-16 md:pt-32 md:pb-24'>
            <div className='mx-auto max-w-7xl px-4'>
                <div className='text-center'>
                    <SectionEyebrow label='Digital Library' color='#E2B42B' lineColor='#B08A20' />
                    <h1 className='font-bebas-neue mt-3 text-4xl tracking-wider text-white uppercase md:text-5xl xl:text-6xl'>
                        E-Book Library
                    </h1>
                </div>
                <EbookLibraryGrid />
            </div>
        </main>
    );
}
