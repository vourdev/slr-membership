import { notFound } from 'next/navigation';

import { getDiscount } from '@/lib/api/resources/discounts';
import { getAccessToken } from '@/lib/api/server';

import { DiscountForm } from '../_components/discount-form';

interface EditDiscountPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditDiscountPage({ params }: EditDiscountPageProps) {
    const { id } = await params;
    const token = await getAccessToken();

    if (!token) notFound();

    try {
        const d = await getDiscount(id, token);

        const initialData = {
            id: d.discount_id,
            title: d.title || '',
            partnerName: d.partner_name || '',
            category: d.category || '',
            description: d.description ?? '',
            terms: d.terms ?? '',
            code: d.code ?? '',
            thumbnailUrl: d.thumbnail_url ?? '',
            logoUrl: d.logo_url ?? '',
            websiteUrl: d.website_url ?? '',
            mapsUrl: d.maps_url ?? '',
            isFeatured: d.is_featured
        };

        return <DiscountForm initialData={initialData} />;
    } catch (error) {
        console.error('Failed to fetch discount:', error);
        notFound();
    }
}
