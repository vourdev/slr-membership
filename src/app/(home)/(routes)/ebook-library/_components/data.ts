export type EbookLibraryItem = {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    pdf_url: string;
};

// Dummy data — swap image/pdf_url for real ebook assets (or the CMS API) later.
export const ebookLibrary: EbookLibraryItem[] = [
    {
        id: 'everyday-fitness',
        title: 'Everyday Fitness Blueprint',
        subtitle: 'At-Home Fitness, Strength & Motivation for Life',
        image: '/images/everyday-fitness-ebook.webp',
        pdf_url: '/ebooks/sample.pdf'
    },
    {
        id: 'simple-health-reset',
        title: 'Simple Health Reset',
        subtitle: 'Everyday Food, Nutrition & Healthy Living',
        image: '/images/everyday-fitness-ebook.webp',
        pdf_url: '/ebooks/sample.pdf'
    },
    {
        id: 'smart-living',
        title: 'Smart Living Blueprint',
        subtitle: 'Lifestyle Initiatives',
        image: '/images/everyday-fitness-ebook.webp',
        pdf_url: '/ebooks/sample.pdf'
    }
];
