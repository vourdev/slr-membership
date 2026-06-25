import type { FC, ReactNode } from 'react';

import Link from 'next/link';

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
 * GoldPillButton — the metallic gold pill CTA (vertical gradient, gold border,
 * inset highlight, wide tracking). Used in the hero and feature sections.
 * Distinct from GoldCtaButton, which is the flatter full-width tier CTA.
 */
const GoldPillButton: FC<GoldPillButtonProps> = ({ href, children = 'JOIN NOW', withArrow = true, className }) => (
    <Link
        href={href}
        className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl px-8 py-2.5 transition-opacity hover:opacity-90 sm:gap-2 sm:rounded-2xl lg:gap-3 lg:px-12 lg:py-3',
            className
        )}
        style={{
            background: 'linear-gradient(180deg, #8C5C0F 0%, #FFD44D 35%, #FFF299 50%, #EBB32E 65%, #80520A 100%)',
            border: '2px solid #66420A',
            boxShadow: '0px 8px 14px rgba(0, 0, 0, 0.4), inset 0px 1px 1px rgba(255, 242, 179, 0.85)'
        }}>
        <span className='text-base leading-tight font-bold tracking-[2px] text-[#1a1408] uppercase sm:tracking-[2.5px] lg:text-xl lg:tracking-[3px]'>
            {children}
        </span>
        {withArrow && <ArrowRightIcon className='h-4 w-4 text-[#2E1F05] sm:h-5 sm:w-5 lg:h-6 lg:w-6' />}
    </Link>
);

export default GoldPillButton;
