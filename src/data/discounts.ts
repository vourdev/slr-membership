import type { BenyStatus, Discount } from '@/types/member';

// ─────────────────────────────────────────────────────────────────────────────
// Mock partner discounts + BENY status (PRD §4.4). Swap the getters for the
// Axios API client later. BENY status mirrors the member's summary.beny_addon.
// ─────────────────────────────────────────────────────────────────────────────

export const DISCOUNT_CATEGORIES = [
    'Groceries',
    'Fuel',
    'Electronics',
    'Home',
    'Retail',
    'Lifestyle',
    'Health'
] as const;

// Static marketing categories shown for the BENY add-on (not from BENY's system).
export const BENY_CATEGORIES = [
    'Petrol Saving',
    'Retail Partner Discounts',
    'Lifestyle Offers',
    'Health & Wellbeing'
] as const;

const DISCOUNTS: Discount[] = [
    {
        id: 'coles',
        brand: 'Coles',
        category: 'Groceries',
        value_label: '5% off',
        code: 'SLRCOLES5',
        description: '5% off your weekly grocery shop, in-store and online at Coles.',
        terms: 'Excludes gift cards, tobacco & alcohol. One use per cycle.'
    },
    {
        id: 'woolworths',
        brand: 'Woolworths',
        category: 'Groceries',
        value_label: '5% off',
        code: 'SLRWOOL5',
        description: '5% off groceries at Woolworths supermarkets nationwide.',
        terms: 'Excludes gift cards & restricted items. Not with other offers.'
    },
    {
        id: 'bp',
        brand: 'BP',
        category: 'Fuel',
        value_label: '4¢ / L',
        code: 'SLRBP4',
        description: 'Save 4 cents per litre on fuel at participating BP stations.',
        terms: 'Show code at checkout. Max 150L per transaction.'
    },
    {
        id: 'caltex',
        brand: 'Ampol',
        category: 'Fuel',
        value_label: '3¢ / L',
        code: 'SLRAMP3',
        description: 'Save 3 cents per litre at Ampol (formerly Caltex) stations.',
        terms: 'Participating stations only. One redemption per visit.'
    },
    {
        id: 'jbhifi',
        brand: 'JB Hi-Fi',
        category: 'Electronics',
        value_label: '10% off',
        code: 'SLRJB10',
        description: '10% off tech, audio and home entertainment at JB Hi-Fi.',
        terms: 'Excludes Apple & gaming consoles. In-store only.'
    },
    {
        id: 'bunnings',
        brand: 'Bunnings',
        category: 'Home',
        value_label: '$10 off $100',
        code: 'SLRBUN10',
        description: '$10 off when you spend $100 or more at Bunnings Warehouse.',
        terms: 'One use per member per cycle. Excludes trade accounts.'
    },
    {
        id: 'kmart',
        brand: 'Kmart',
        category: 'Retail',
        value_label: '10% off',
        code: 'SLRKM10',
        description: '10% off homewares, apparel and toys at Kmart.',
        terms: 'Online only. Excludes clearance items.'
    },
    {
        id: 'rebel',
        brand: 'Rebel Sport',
        category: 'Retail',
        value_label: '15% off',
        code: 'SLRREB15',
        description: '15% off sportswear, footwear and equipment at Rebel.',
        terms: 'Excludes already-discounted stock. One use per cycle.'
    },
    {
        id: 'amazon',
        brand: 'Amazon AU',
        category: 'Retail',
        value_label: '8% off',
        code: 'SLRAMZ8',
        description: '8% off eligible items sold by Amazon Australia.',
        terms: 'Selected categories only. Applied at checkout.'
    },
    {
        id: 'ubereats',
        brand: 'Uber Eats',
        category: 'Lifestyle',
        value_label: '$15 off',
        code: 'SLRUBER15',
        description: '$15 off your next two Uber Eats orders over $30.',
        terms: 'New & existing users. Delivery fees may apply.'
    },
    {
        id: 'event',
        brand: 'Event Cinemas',
        category: 'Lifestyle',
        value_label: '30% off',
        code: 'SLREVENT30',
        description: '30% off adult movie tickets at Event Cinemas.',
        terms: 'Booking fees apply. Excludes Gold Class & special events.'
    },
    {
        id: 'chemist',
        brand: 'Chemist Warehouse',
        category: 'Health',
        value_label: '12% off',
        code: 'SLRCHEM12',
        description: '12% off vitamins, skincare and health products.',
        terms: 'Excludes prescription medicines. One use per cycle.'
    }
];

export async function getDiscounts(): Promise<Discount[]> {
    return DISCOUNTS;
}

export async function getBenyStatus(): Promise<BenyStatus> {
    return { active: true };
}
