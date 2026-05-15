export type EbookAccess = 'all' | 'paid' | 'blue';

export type Ebook = {
    id: string;
    title: string;
    author: string;
    description: string;
    category: 'Finance' | 'Health' | 'Lifestyle' | 'Career' | 'Family';
    pages: number;
    minutes: number;
    access: EbookAccess;
    cover: {
        from: string;
        to: string;
        accent: string;
    };
};

export const ebookCategories: Ebook['category'][] = ['Finance', 'Health', 'Lifestyle', 'Career', 'Family'];

export const ebooks: Ebook[] = [
    {
        id: 'cost-of-living-playbook',
        title: 'The Cost of Living Playbook',
        author: 'Hannah McKenzie',
        description:
            'Twenty practical tactics Australian households are using to cut hundreds off groceries, fuel, and bills each month — without giving up the things you actually want.',
        category: 'Finance',
        pages: 84,
        minutes: 95,
        access: 'all',
        cover: { from: '#1A0306', to: '#530710', accent: '#FFDC75' }
    },
    {
        id: 'smart-budget-2026',
        title: 'Smart Budget 2026',
        author: 'David Phan',
        description:
            'A modern budgeting framework built around how Australians actually spend in 2026 — apps, BNPL, subscriptions, and the rising cost of essentials.',
        category: 'Finance',
        pages: 112,
        minutes: 130,
        access: 'paid',
        cover: { from: '#0E1828', to: '#142034', accent: '#6AB0F0' }
    },
    {
        id: 'rewards-mindset',
        title: 'The Rewards Mindset',
        author: 'Priya Nair',
        description:
            'How small daily rewards and weekly wins keep you motivated. A behavioural guide to building habits that compound — written specifically for SLR members.',
        category: 'Lifestyle',
        pages: 64,
        minutes: 70,
        access: 'all',
        cover: { from: '#140E00', to: '#1E1600', accent: '#FFDC75' }
    },
    {
        id: 'family-first-finance',
        title: 'Family First Finance',
        author: 'Maria & Tom Ellsworth',
        description:
            'A two-parent guide to running a household on a single, dual, or in-between income. School fees, sport fees, mortgage pressure — and how to stay in front.',
        category: 'Family',
        pages: 96,
        minutes: 110,
        access: 'paid',
        cover: { from: '#1C0308', to: '#2A0810', accent: '#E88888' }
    },
    {
        id: 'career-pivot-after-40',
        title: 'Career Pivot After 40',
        author: 'James Cordell',
        description:
            'You are not too old, too senior, or too late. A direct guide to changing careers mid-life with the resume, story, and network you already have.',
        category: 'Career',
        pages: 78,
        minutes: 85,
        access: 'paid',
        cover: { from: '#0A0A0A', to: '#181818', accent: '#FFFFFF' }
    },
    {
        id: 'healthy-on-a-budget',
        title: 'Healthy on a Budget',
        author: 'Dr Lan Nguyen',
        description:
            'Real meals, real prices, real Australian supermarkets. Twelve weeks of meal plans designed around the cheapest fresh ingredients each season.',
        category: 'Health',
        pages: 132,
        minutes: 150,
        access: 'all',
        cover: { from: '#0B2715', to: '#11421F', accent: '#7CD992' }
    },
    {
        id: 'side-hustle-australia',
        title: 'Side Hustle Australia',
        author: 'Beth Cahill',
        description:
            'A frank look at what actually works in 2026 — from local services and digital products to skilled freelancing — and what the ATO wants you to know.',
        category: 'Career',
        pages: 88,
        minutes: 100,
        access: 'blue',
        cover: { from: '#1A1408', to: '#0C0A04', accent: '#D4AF37' }
    },
    {
        id: 'first-home-honest-guide',
        title: 'First Home: The Honest Guide',
        author: 'Daniel Whitlock',
        description:
            "The version of first-home buying you don't get from real-estate agents — deposits, schemes, inspections, and the offers that actually win in 2026.",
        category: 'Finance',
        pages: 142,
        minutes: 165,
        access: 'blue',
        cover: { from: '#0F2F7A', to: '#0B205D', accent: '#6AB0F0' }
    },
    {
        id: 'weekends-australians-love',
        title: 'Weekends Australians Love',
        author: 'Sarah Beale',
        description:
            'Ninety low-cost weekend ideas across every state and territory — most under $50, plus member discounts you can stack to bring the total even lower.',
        category: 'Lifestyle',
        pages: 110,
        minutes: 120,
        access: 'paid',
        cover: { from: '#1F0F2A', to: '#2E1640', accent: '#C58EE8' }
    },
    {
        id: 'sleep-energy-focus',
        title: 'Sleep, Energy, Focus',
        author: 'Dr Marcus Hale',
        description:
            'The simplest possible system for sleeping better, waking up sharper, and staying focused — based on research that actually applies to working adults.',
        category: 'Health',
        pages: 72,
        minutes: 80,
        access: 'paid',
        cover: { from: '#0A1F2E', to: '#0F2E45', accent: '#62C5E8' }
    },
    {
        id: 'kids-money-conversations',
        title: 'Kids & Money: The Conversations',
        author: 'Naomi Foster',
        description:
            'Twelve real conversations to have with your kids about money, work, and value — sorted by age, complete with prompts and follow-up questions.',
        category: 'Family',
        pages: 68,
        minutes: 75,
        access: 'all',
        cover: { from: '#2A1505', to: '#3D2008', accent: '#F5A65B' }
    },
    {
        id: 'retire-australia-2030',
        title: 'Retire in Australia: 2030 Edition',
        author: 'Greg Lammert',
        description:
            'Super, pension, downsizing, and the genuine cost of retiring in 2030 — built around the new rules and what changed in the latest federal budget.',
        category: 'Finance',
        pages: 156,
        minutes: 180,
        access: 'blue',
        cover: { from: '#15301A', to: '#1F4828', accent: '#7CD992' }
    }
];
