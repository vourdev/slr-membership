'use client';

import { useState, useTransition } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AlertModal } from '@/components/alert-modal';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import type { EbookAdmin, EbookTier } from '@/lib/api/resources/ebooks';

import { ebooksColumns } from './_components/columns';
import { deleteEbookAction } from './actions';
import { Plus, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

export type EbookRow = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    coverUrl: string;
    category: string;
    footnote: string;
    tier?: EbookTier;
    reading: number;
    chapters: number;
    locked: string;
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
            <p className='text-sm font-semibold'>Ebooks list failed — report this to the backend</p>
        </div>
        <dl className='mt-3 grid grid-cols-1 gap-1 font-mono text-xs sm:grid-cols-2'>
            <div className='flex gap-2'>
                <dt className='text-muted-foreground'>status</dt>
                <dd className='select-all'>{error.status}</dd>
            </div>
            <div className='flex gap-2'>
                <dt className='text-muted-foreground'>code</dt>
                <dd className='select-all'>{error.code ?? '-'}</dd>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
                <dt className='text-muted-foreground'>message</dt>
                <dd className='select-all'>{error.message}</dd>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
                <dt className='text-muted-foreground'>requestId</dt>
                <dd className='select-all'>{error.requestId ?? '-'}</dd>
            </div>
        </dl>
    </div>
);

export function EbooksClient({ initialRows, listError }: { initialRows: EbookRow[]; listError: ListError | null }) {
    const router = useRouter();
    const [rows, setRows] = useState<EbookRow[]>(initialRows);
    const [deleteTarget, setDeleteTarget] = useState<EbookRow | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleEdit = (row: EbookRow) => {
        router.push(`/dashboard/ebooks/${row.id}`);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        const { id } = deleteTarget;
        startTransition(async () => {
            const res = await deleteEbookAction(id);
            if (res.ok) {
                setRows((prev) => prev.filter((r) => r.id !== id));
                toast.success(res.message);
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
            setDeleteTarget(null);
        });
    };

    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-auto px-4 py-6'>
            <div className='flex items-center justify-between'>
                <Heading title='Ebooks' description='Create, edit and remove ebooks' />
                <Button asChild>
                    <Link href='/dashboard/ebooks/new'>
                        <Plus className='mr-2 h-4 w-4' />
                        New Ebook
                    </Link>
                </Button>
            </div>

            {listError ? <ListErrorCard error={listError} /> : null}

            <DataTable
                searchKey='title'
                columns={ebooksColumns}
                data={rows}
                onEdit={(row) => handleEdit(row as EbookRow)}
                onDelete={(row) => setDeleteTarget(row as EbookRow)}
            />

            <AlertModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                loading={isPending}
                className='dashboard-theme dark'
            />
        </div>
    );
}
