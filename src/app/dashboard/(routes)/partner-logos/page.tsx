import Link from 'next/link';

import { DashboardPageShell } from '@/app/dashboard/_components/page-shell';
import type { ListError } from '@/components/common/list-error-card';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { handleApiAuthError } from '@/lib/api/guard';
import { toListError } from '@/lib/api/list-error';
import { comparePartnerLogos, getAdminPartnerLogos } from '@/lib/api/resources/partner-logos';
import { getAccessToken } from '@/lib/api/server';

import { type PartnerLogoRow, PartnerLogosClient } from './partner-logos-client';
import { Plus } from 'lucide-react';

export default async function PartnerLogosPage() {
    const token = await getAccessToken();

    let rows: PartnerLogoRow[] = [];
    let listError: ListError | null = null;

    try {
        const logos = token ? await getAdminPartnerLogos(token) : [];
        rows = [...logos].sort(comparePartnerLogos).map((p) => ({
            id: p.partner_id,
            logo: p.logo_url || '',
            name: p.name || '-',
            website: p.website_url || '-',
            active: p.is_active ? 'Yes' : 'No',
            order: p.sort_order ?? 0
        }));
    } catch (error) {
        handleApiAuthError(error);
        listError = toListError(error);
    }

    return (
        <DashboardPageShell>
            <div className='flex items-center justify-between'>
                <Heading
                    title='Partner Logos'
                    description='Logos shown in the Community Givebacks section of the homepage'
                />
                <Button asChild>
                    <Link href='/dashboard/partner-logos/new'>
                        <Plus className='mr-2 h-4 w-4' />
                        New Partner Logo
                    </Link>
                </Button>
            </div>

            <PartnerLogosClient initialRows={rows} listError={listError} />
        </DashboardPageShell>
    );
}
