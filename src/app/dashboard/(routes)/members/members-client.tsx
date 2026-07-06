'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { DataTable } from '@/components/data-table';

import { membersColumns } from './_components/columns';
import { deleteMemberAction } from './actions';
import { toast } from 'sonner';

export type MemberRow = {
    id: string;
    name: string;
    email: string;
    tier: string;
    state: string;
    status: string;
    registered_at: string;
};

export function MembersClient({ data }: { data: MemberRow[] }) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const handleEdit = (row: MemberRow) => {
        router.push(`/dashboard/members/${row.id}`);
    };

    const handleDelete = (row: MemberRow) => {
        startTransition(async () => {
            try {
                await deleteMemberAction(row.id);
                toast.success('Member deleted.');
                router.refresh();
            } catch {
                toast.error('Could not delete member.');
            }
        });
    };

    return (
        <div className='overflow-x-auto'>
            <DataTable
                searchKey='name'
                columns={membersColumns}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
