import { notFound } from 'next/navigation';

import { getEbooks } from '@/lib/api/resources/ebooks';
import { getAccessToken } from '@/lib/api/server';

import { EbookForm } from '../_components/ebook-form';

interface EditEbookPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditEbookPage({ params }: EditEbookPageProps) {
    const { id } = await params;
    const token = await getAccessToken();

    if (!token) notFound();

    const ebooks = await getEbooks(token);
    const ebook = ebooks.find((e) => e.ebook_id === id);

    if (!ebook) notFound();

    const initialData = {
        id: ebook.ebook_id,
        title: ebook.title || '',
        subtitle: ebook.subtitle || '',
        description: ebook.description || '',
        coverUrl: ebook.cover_url || '',
        category: ebook.category || '',
        footnote: ebook.footnote || '',
        tierAccess: 'RED' as const, // default since listing doesn't return the tier
        readingTimeMinutes: ebook.reading_time_minutes || 0
    };

    return <EbookForm initialData={initialData} />;
}
