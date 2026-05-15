import type { FC, ReactNode } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GoldCtaButtonProps = {
    href: string;
    children: ReactNode;
    /** Optional className for the wrapping <Link>. */
    className?: string;
    /** Optional className passed through to the inner <Button>. */
    buttonClassName?: string;
};

/**
 * GoldCtaButton — the primary call-to-action button used across tier sections.
 * Gold gradient fill, dark-navy text, light-gold top edge.
 */
const GoldCtaButton: FC<GoldCtaButtonProps> = ({ href, children, className, buttonClassName }) => (
    <Link href={href} className={cn('block', className)}>
        <Button
            className={cn('bg-gradient-gold h-10 w-full rounded-xl font-bold uppercase sm:h-11', buttonClassName)}
            style={{ color: '#0C1132', borderTop: '2px solid #FFDC75' }}>
            {children}
        </Button>
    </Link>
);

export default GoldCtaButton;
