export type Registration = {
    id: string;
    name: string;
    email: string;
    tier: string;
    state: string;
    status: string;
    registered_at: string;
};

// Dummy data — swap for API once the registrations endpoint is ready.
export const registrationsData: Registration[] = [
    {
        id: 'r1',
        name: 'Olivia Bennett',
        email: 'olivia.b@example.com',
        tier: 'SLR Blue',
        state: 'NSW',
        status: 'Active',
        registered_at: '2026-06-21'
    },
    {
        id: 'r2',
        name: 'Liam Harrison',
        email: 'liam.h@example.com',
        tier: 'SLR Red',
        state: 'VIC',
        status: 'Active',
        registered_at: '2026-06-20'
    },
    {
        id: 'r3',
        name: 'Charlotte Nguyen',
        email: 'charlotte.n@example.com',
        tier: 'Visitor',
        state: 'QLD',
        status: 'Pending',
        registered_at: '2026-06-20'
    },
    {
        id: 'r4',
        name: 'Noah Williams',
        email: 'noah.w@example.com',
        tier: 'SLR Blue',
        state: 'WA',
        status: 'Active',
        registered_at: '2026-06-19'
    },
    {
        id: 'r5',
        name: 'Amelia Scott',
        email: 'amelia.s@example.com',
        tier: 'SLR Red',
        state: 'SA',
        status: 'Active',
        registered_at: '2026-06-18'
    },
    {
        id: 'r6',
        name: 'Jack Thompson',
        email: 'jack.t@example.com',
        tier: 'Visitor',
        state: 'TAS',
        status: 'Cancelled',
        registered_at: '2026-06-17'
    },
    {
        id: 'r7',
        name: 'Isla Robinson',
        email: 'isla.r@example.com',
        tier: 'SLR Blue',
        state: 'ACT',
        status: 'Active',
        registered_at: '2026-06-16'
    },
    {
        id: 'r8',
        name: 'William Carter',
        email: 'william.c@example.com',
        tier: 'SLR Red',
        state: 'NT',
        status: 'Pending',
        registered_at: '2026-06-15'
    },
    {
        id: 'r9',
        name: 'Mia Edwards',
        email: 'mia.e@example.com',
        tier: 'Visitor',
        state: 'NSW',
        status: 'Active',
        registered_at: '2026-06-14'
    },
    {
        id: 'r10',
        name: 'Henry Mitchell',
        email: 'henry.m@example.com',
        tier: 'SLR Blue',
        state: 'VIC',
        status: 'Active',
        registered_at: '2026-06-13'
    },
    {
        id: 'r11',
        name: 'Ava Collins',
        email: 'ava.c@example.com',
        tier: 'SLR Red',
        state: 'QLD',
        status: 'Cancelled',
        registered_at: '2026-06-12'
    },
    {
        id: 'r12',
        name: 'Lucas Baker',
        email: 'lucas.b@example.com',
        tier: 'SLR Blue',
        state: 'WA',
        status: 'Active',
        registered_at: '2026-06-11'
    }
];
