import { notFound } from 'next/navigation';

import { handleApiAuthError } from '@/lib/api/guard';
import { getAdminPartnerLogo } from '@/lib/api/resources/partner-logos';
import { getAccessToken } from '@/lib/api/server';

import { PartnerLogoForm } from '../_components/partner-logo-form';

export default async function EditPartnerLogoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const token = await getAccessToken();

    if (!token) notFound();

    try {
        const logo = await getAdminPartnerLogo(id, token);

        return (
            <PartnerLogoForm
                initialData={{
                    id: logo.partner_id,
                    name: logo.name ?? '',
                    logoUrl: logo.logo_url ?? '',
                    websiteUrl: logo.website_url ?? '',
                    sortOrder: logo.sort_order ?? 0,
                    isActive: logo.is_active
                }}
            />
        );
    } catch (error) {
        handleApiAuthError(error);
        notFound();
    }
}
