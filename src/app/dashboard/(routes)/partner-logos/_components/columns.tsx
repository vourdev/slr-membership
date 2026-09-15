import Image from 'next/image';

import { Column } from '@/components/data-table';

export const partnerLogosColumns: Column[] = [
    {
        key: 'logo',
        label: 'Logo',
        render: (row) =>
            row.logo ? (
                <span className='flex h-10 w-20 items-center justify-center rounded-md bg-white/5 p-1'>
                    <Image
                        src={row.logo}
                        alt={row.name}
                        width={80}
                        height={40}
                        unoptimized
                        className='max-h-8 w-auto object-contain'
                    />
                </span>
            ) : (
                '-'
            )
    },
    { key: 'name', label: 'Name', render: (row) => <span className='font-medium text-white'>{row.name}</span> },
    { key: 'website', label: 'Website' },
    { key: 'active', label: 'Active' },
    { key: 'order', label: 'Order' },
    { key: 'action', label: 'Action' }
];
