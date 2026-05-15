import { AuStateCode } from '@/constant/au-states';

export type TierKey = 'visitor' | 'red' | 'blue';

export type SignUpFormData = {
    name: string;
    email: string;
    password: string;
    state: AuStateCode | '';
    phone: string;
    tier: TierKey | null;
    beny: boolean;
};

export type SpinPrize = {
    label: string;
    discountPercent: number;
};

export const TIER_PRICE: Record<TierKey, number> = {
    visitor: 0,
    red: 10,
    blue: 26
};

export const TIER_LABEL: Record<TierKey, string> = {
    visitor: 'Visitor',
    red: 'SLR Red',
    blue: 'SLR Premium'
};

export const BENY_PRICE = 5;
