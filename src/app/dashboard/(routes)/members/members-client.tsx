'use client';

import { DataTable } from '@/components/data-table';
import Heading from '@/components/ui/heading';

import { membersColumns } from './_components/columns';

export type MemberRow = {
    id: string;
    name: string;
    email: string;
    tier: string;
    state: string;
    status: string;
    registered_at: string;
};

export function MembersClient({ data, onDelete }: { data: MemberRow[]; onDelete?: (row: MemberRow) => void }) {
    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-auto px-4 py-6'>
            <Heading title='Members' description='Registered members' />

            <DataTable searchKey='name' columns={membersColumns} data={data} onDelete={onDelete} />
        </div>
    );
}
