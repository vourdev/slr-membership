'use client';

import { DataTable } from '@/components/data-table';
import Heading from '@/components/ui/heading';

import { registrationsColumns } from './_components/columns';

export type RegistrationRow = {
    id: string;
    name: string;
    email: string;
    tier: string;
    state: string;
    status: string;
    registered_at: string;
};

export function RegistrationsClient({ data }: { data: RegistrationRow[] }) {
    return (
        <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
            <Heading title='Registrations' description='Registered members' />

            <DataTable searchKey='name' columns={registrationsColumns} data={data} />
        </div>
    );
}
