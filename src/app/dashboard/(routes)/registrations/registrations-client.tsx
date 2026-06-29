'use client';

import { DataTable } from '@/components/data-table';
import Heading from '@/components/ui/heading';

import { registrationsColumns } from './_components/columns';
import { registrationsData } from './_components/data';

export function RegistrationsClient() {
    return (
        <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
            <Heading title='Registrations' description='Registered members (dummy data)' />

            <DataTable searchKey='name' columns={registrationsColumns} data={registrationsData} />
        </div>
    );
}
