'use client';

import { useState, useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';

import { discountsColumns } from './_components/columns';
import { deleteDiscountAction } from './actions';
import { Plus, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

export type DiscountRow = {
    id: string;
    title: string;
    partner: string;
    category: string;
    featured: string;
};

export type ListError = {
    status: number;
    message: string;
    code: string | null;
    requestId: string | null;
};

const ListErrorCard = ({ error }: { error: ListError }) => (
    <div className='rounded-xl border border-red-500/40 bg-red-500/5 p-4'>
        <div className='flex items-center gap-2 text-red-400'>
            <TriangleAlert className='h-4 w-4' />
            <p className='text-sm font-semibold'>Discounts list unavailable — report this to the backend</p>
        </div>
        <p className='text-muted-foreground mt-1 text-xs'>
            {`GET /api/v1/discounts/ failed, so existing discounts can't be shown. New discounts you create below still work and can be deleted.`}
        </p>
        <dl className='mt-3 grid grid-cols-1 gap-1 font-mono text-xs sm:grid-cols-2'>
            <div className='flex gap-2'>
                <dt className='text-muted-foreground'>status</dt>
                <dd className='text-white select-all'>{error.status}</dd>
            </div>
            <div className='flex gap-2'>
                <dt className='text-muted-foreground'>code</dt>
                <dd className='text-white select-all'>{error.code ?? '-'}</dd>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
                <dt className='text-muted-foreground'>message</dt>
                <dd className='text-white select-all'>{error.message}</dd>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
                <dt className='text-muted-foreground'>requestId</dt>
                <dd className='text-white select-all'>{error.requestId ?? '-'}</dd>
            </div>
        </dl>
    </div>
);

export function DiscountsClient({
    initialRows,
    listError
}: {
    initialRows: DiscountRow[];
    listError: ListError | null;
}) {
    const router = useRouter();
    const [rows, setRows] = useState<DiscountRow[]>(initialRows);
    const [isPending, startTransition] = useTransition();

    const handleEdit = (row: DiscountRow) => {
        router.push(`/dashboard/discounts/${row.id}`);
    };

    // DataTable's action column shows its own confirm dialog before calling this.
    const handleDelete = (row: DiscountRow) => {
        startTransition(async () => {
            const res = await deleteDiscountAction(row.id);
            if (res.ok) {
                setRows((prev) => prev.filter((r) => r.id !== row.id));
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-auto px-4 py-6'>
            <div className='flex items-center justify-between'>
                <Heading title='Discounts' description='Create, edit and remove partner discounts' />
                <Button asChild>
                    <Link href='/dashboard/discounts/new'>
                        <Plus className='mr-2 h-4 w-4' />
                        New Discount
                    </Link>
                </Button>
            </div>

            {listError ? <ListErrorCard error={listError} /> : null}

            <DataTable
                searchKey='title'
                columns={discountsColumns}
                data={rows}
                onEdit={(row) => handleEdit(row as DiscountRow)}
                onDelete={(row) => handleDelete(row as DiscountRow)}
            />
        </div>
    );
}
