import type { FC, ReactNode } from 'react';

import Link from 'next/link';

import { goldButtonStyle } from '@/lib/styles';
import { cn } from '@/lib/utils';

import { ArrowRightIcon } from 'lucide-react';

type GoldPillButtonProps = {
    /** Destination route. */
    href: string;
    /** Button label. Defaults to "JOIN NOW". */
    children?: ReactNode;
    /** Render the trailing arrow icon. Defaults to true. */
    withArrow?: boolean;
    /** Optional extra classes for the wrapping <Link>. */
    className?: string;
};

/**
 * GoldPillButton — the primary gold CTA used in the hero and feature sections.
 * Flat gold gradient fill, dark text, light-gold top edge (shared `goldButtonStyle`),
 * with an optional trailing arrow. Distinct from GoldCtaButton, the full-width tier CTA.
 */
const GoldPillButton: FC<GoldPillButtonProps> = ({ href, children = 'JOIN NOW', withArrow = true, className }) => (
    <Link
        href={href}
        style={goldButtonStyle}
        className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl px-8 py-2.5 text-base font-bold tracking-wide uppercase shadow-md transition-opacity hover:opacity-90 lg:px-10 lg:py-3 lg:text-lg',
            className
        )}>
        {children}
        {withArrow && <ArrowRightIcon className='h-5 w-5' />}
    </Link>
);

export default GoldPillButton;
