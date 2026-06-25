import type { ReactNode } from 'react';

import { CreditCard, FileText, Layers, Tag } from 'lucide-react';

export type MenuItem = {
    text: string;
    url: string;
    icon?: ReactNode;
};

export const menuItems: MenuItem[] = [
    { text: 'Membership', url: '/' },
    { text: 'Files', url: '/files' },
    { text: 'Tiers', url: '/tiers' },
    { text: 'Discount', url: '/discount' }
];

export default menuItems;
