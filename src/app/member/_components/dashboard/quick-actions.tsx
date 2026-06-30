import Link from 'next/link';

import { SectionTitle } from './section-title';
import { BookOpen, Gift, type LucideIcon, TicketPercent, UserCircle } from 'lucide-react';

interface QuickAction {
    title: string;
    href: string;
    icon: LucideIcon;
    desc: string;
}

// The four quick actions called out in PRD §4.2.
const ACTIONS: QuickAction[] = [
    { title: 'Discounts', href: '/member/discounts', icon: TicketPercent, desc: 'Partner offers & BENY' },
    { title: 'Giveaways', href: '/member/giveaways', icon: Gift, desc: 'Active draws by tier' },
    { title: 'E-Books', href: '/member/ebooks', icon: BookOpen, desc: 'Digital library' },
    { title: 'Profile', href: '/member/profile', icon: UserCircle, desc: 'Account & membership' }
];

export function QuickActions() {
    return (
        <section>
            <SectionTitle>Quick Actions</SectionTitle>
            <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
                {ACTIONS.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className='group bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex flex-col gap-3 rounded-xl border p-4 transition-colors'>
                        <span className='bg-gold-tint flex size-10 items-center justify-center rounded-xl border border-[#D4AF3759]'>
                            <action.icon className='text-slr-gold-label size-5' />
                        </span>
                        <span className='space-y-0.5'>
                            <span className='block text-sm font-semibold text-white'>{action.title}</span>
                            <span className='text-slr-dim block text-xs'>{action.desc}</span>
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
