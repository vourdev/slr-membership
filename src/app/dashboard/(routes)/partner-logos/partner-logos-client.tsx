'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { type ListError, ListErrorCard } from '@/components/common/list-error-card';
import { DataTable } from '@/components/data-table';

import { partnerLogosColumns } from './_components/columns';
import { deletePartnerLogoAction } from './actions';
import { toast } from 'sonner';

export type PartnerLogoRow = {
    id: string;
    logo: string;
    name: string;
    website: string;
    active: string;
    order: number;
};

export function PartnerLogosClient({
    initialRows,
    listError
}: {
    initialRows: PartnerLogoRow[];
    listError: ListError | null;
}) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const handleDelete = (row: PartnerLogoRow) => {
        startTransition(async () => {
            const res = await deletePartnerLogoAction(row.id);
            if (res.ok) {
                toast.success(res.message);
                router.refresh();
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
        });
    };

    return (
        <div className='flex flex-col gap-4'>
            {listError ? (
                <ListErrorCard
                    error={listError}
                    title='Partner logos could not be loaded'
                    description='The list below may be incomplete. Share this reference with the backend team.'
                />
            ) : null}

            <DataTable
                searchKey='name'
                columns={partnerLogosColumns}
                data={initialRows}
                onEdit={(row) => router.push(`/dashboard/partner-logos/${(row as PartnerLogoRow).id}`)}
                onDelete={(row) => handleDelete(row as PartnerLogoRow)}
            />
        </div>
    );
}
