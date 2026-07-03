'use client';

import { DataTable } from '@/components/data-table';
import Heading from '@/components/ui/heading';

import { winnersColumns } from './_components/columns';

export type WinnerRow = {
    id: string;
    prize: string;
    giveaway: string;
    tier: string;
    winner: string;
    state: string;
    recorded_at: string;
};

export function WinnersClient({ data }: { data: WinnerRow[] }) {
    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 overflow-x-auto px-4 py-6'>
            <Heading title='Winners' description='Recorded giveaway winners' />

            <DataTable searchKey='winner' columns={winnersColumns} data={data} />
        </div>
    );
}
