import Link from 'next/link';

import { ChevronRight, FileText, HelpCircle, type LucideIcon, Mail, ScrollText, Shield } from 'lucide-react';

interface SupportLink {
    label: string;
    href: string;
    icon: LucideIcon;
}

const LINKS: SupportLink[] = [
    { label: 'FAQs', href: '/faq', icon: HelpCircle },
    { label: 'Giveaway Rules', href: '/giveaway-rules', icon: ScrollText },
    { label: 'Terms & Conditions', href: '/terms', icon: FileText },
    { label: 'Privacy Policy', href: '/privacy', icon: Shield },
    { label: 'Contact Support', href: '/contact', icon: Mail }
];

export function SupportLinks() {
    return (
        <section className='bg-card-dark-navy border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>Support</h2>

            <div className='mt-2 divide-y divide-white/5'>
                {LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group flex items-center gap-3 py-3 text-sm text-white/90 transition-colors hover:text-white'>
                        <link.icon className='text-slr-gold-label size-4 shrink-0' />
                        {link.label}
                        <ChevronRight className='text-slr-dim ml-auto size-4 transition-transform group-hover:translate-x-0.5' />
                    </Link>
                ))}
            </div>
        </section>
    );
}
