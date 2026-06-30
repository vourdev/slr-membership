import type { ReactNode } from 'react';

import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

interface SectionTitleProps {
    children: ReactNode;
    viewAllHref?: string;
}

export function SectionTitle({ children, viewAllHref }: SectionTitleProps) {
    return (
        <div className='mb-3 flex items-center justify-between gap-2'>
            <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>{children}</h2>
            {viewAllHref && (
                <Link
                    href={viewAllHref}
                    className='text-slr-gold-label inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase transition-opacity hover:opacity-80'>
                    View all <ArrowRight className='size-3.5' />
                </Link>
            )}
        </div>
    );
}
