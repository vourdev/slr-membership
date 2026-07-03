import { Column } from '@/components/data-table';

export const membersColumns: Column[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'tier', label: 'Tier' },
    { key: 'state', label: 'State' },
    { key: 'status', label: 'Status' },
    { key: 'registered_at', label: 'Registered' },
    { key: 'action', label: 'Action' }
];
