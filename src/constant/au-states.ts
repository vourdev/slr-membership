export const AU_STATE_CODES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'] as const;

export type AuStateCode = (typeof AU_STATE_CODES)[number];

export const AU_STATES: { code: AuStateCode; label: string }[] = [
    { code: 'VIC', label: 'Victoria' },
    { code: 'NSW', label: 'New South Wales' },
    { code: 'QLD', label: 'Queensland' },
    { code: 'SA', label: 'South Australia' },
    { code: 'WA', label: 'Western Australia' },
    { code: 'TAS', label: 'Tasmania' },
    { code: 'NT', label: 'Northern Territory' },
    { code: 'ACT', label: 'Australian Capital Territory' }
];
