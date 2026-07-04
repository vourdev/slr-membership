'use client';

import { useState, useTransition } from 'react';

import { AlertModal } from '@/components/alert-modal';
import EmptyState from '@/components/common/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { activateBenyAction } from './actions';
import { TriangleAlert, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export type BenyRow = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    requestedAt: string;
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
            <p className='text-sm font-semibold'>Pending BENY list unavailable — report this to the backend</p>
        </div>
        <p className='text-muted-foreground mt-1 text-xs'>{`GET /api/v1/admin/beny/pending failed, so pending BENY subscriptions can't be shown.`}</p>
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

export function BenyClient({ initialRows, listError }: { initialRows: BenyRow[]; listError: ListError | null }) {
    const [rows, setRows] = useState<BenyRow[]>(initialRows);
    const [activateTarget, setActivateTarget] = useState<BenyRow | null>(null);
    const [isPending, startTransition] = useTransition();

    const confirmActivate = () => {
        if (!activateTarget) return;
        const { id } = activateTarget;
        startTransition(async () => {
            const res = await activateBenyAction(id);
            if (res.ok) {
                setRows((prev) => prev.filter((r) => r.id !== id));
                toast.success(res.message);
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
            setActivateTarget(null);
        });
    };

    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-auto px-4 py-6'>
            <Heading title='BENY Activations' description='Review and activate pending BENY add-on subscriptions' />

            {listError ? <ListErrorCard error={listError} /> : null}

            {rows.length === 0 && !listError ? (
                <EmptyState
                    icon={UserCheck}
                    title='No pending activations'
                    description='All BENY subscriptions have been handled. New pending requests will appear here.'
                />
            ) : (
                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-muted-foreground font-medium'>Name</TableHead>
                                <TableHead className='text-muted-foreground font-medium'>Email</TableHead>
                                <TableHead className='text-muted-foreground font-medium'>Phone</TableHead>
                                <TableHead className='text-muted-foreground font-medium'>Status</TableHead>
                                <TableHead className='text-muted-foreground font-medium'>Requested</TableHead>
                                <TableHead className='w-32 text-right'>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className='font-medium'>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phone}</TableCell>
                                    <TableCell>
                                        <Badge variant='secondary' className='uppercase'>
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{row.requestedAt}</TableCell>
                                    <TableCell className='text-right'>
                                        <Button size='sm' disabled={isPending} onClick={() => setActivateTarget(row)}>
                                            <UserCheck className='mr-2 h-4 w-4' />
                                            Activate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <AlertModal
                isOpen={!!activateTarget}
                onClose={() => setActivateTarget(null)}
                onConfirm={confirmActivate}
                loading={isPending}
                className='slr-admin dark'
            />
        </div>
    );
}
