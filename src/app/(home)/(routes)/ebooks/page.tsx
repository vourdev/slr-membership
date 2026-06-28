import { Metadata } from 'next';

import EbookHeroSection from './_components/ebook-hero-section';
import EbookReaderSection from './_components/ebook-reader-section';

export const metadata: Metadata = {
    title: 'Smart Living Blueprint · SLR E-Books',
    description:
        'Read the Smart Living Blueprint — a six-chapter SLR guide to living smarter, not harder, covering home, money, time, habits and the quiet power of awareness.'
};

const EbooksPage = () => {
    return (
        <main className='bg-slr-ink pt-12'>
            <EbookHeroSection />
            <EbookReaderSection />
        </main>
    );
};

export default EbooksPage;
