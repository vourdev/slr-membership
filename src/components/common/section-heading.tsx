import type { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SectionHeadingProps = {
    children: ReactNode;
    className?: string;
    /** Render as <h1> instead of <h2> (e.g. for the hero). Defaults to h2. */
    as?: 'h1' | 'h2' | 'h3';
};

/**
 * Section heading — Bebas Neue, uppercase, responsive 56px → 72px with tight line-height.
 * Use plain text or nested <span> for accent words (e.g. gradient-coloured tier names).
 *
 * Example:
 *   <SectionHeading>
 *     SLR <span className='text-red-600'>RED</span> Reward Tiers
 *   </SectionHeading>
 */
const SectionHeading: FC<SectionHeadingProps> = ({ children, className, as = 'h2' }) => {
    const Tag = as;

    return (
        <Tag
            className={cn(
                'font-bebas-neue text-center text-[56px] leading-[0.90] font-medium tracking-wider text-white uppercase md:text-[72px] md:leading-none',
                className
            )}>
            {children}
        </Tag>
    );
};

export default SectionHeading;
