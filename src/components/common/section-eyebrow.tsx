import type { FC } from 'react';

import { cn } from '@/lib/utils';

type SectionEyebrowProps = {
    /** The eyebrow label text (will be uppercased via class). */
    label: string;
    /** Text color in hex/CSS color. Also used as the horizontal-line gradient start when `lineColor` is omitted. */
    color: string;
    /** Optional override for the gradient line color (if it should differ from the text color). */
    lineColor?: string;
    /** Optional extra classes for the wrapper. */
    className?: string;
};

/**
 * Section eyebrow — a small uppercase label flanked by two horizontal gradient lines
 * that fade to transparent on either side. Used as the kicker above a section heading.
 *
 * Example: "MEMBER PRIZE TIERS" / "PREMIUM MEMBER TIERS" / "MEMBER BENEFITS"
 */
const SectionEyebrow: FC<SectionEyebrowProps> = ({ label, color, lineColor, className }) => {
    const line = lineColor ?? color;

    return (
        <div className={cn('flex w-full items-center justify-center gap-2', className)}>
            <div
                className='h-px w-16'
                style={{
                    background: `linear-gradient(270deg, ${line} 0%, rgba(255,255,255,0) 100%)`
                }}
                aria-hidden='true'
            />
            <p className='text-xs font-semibold uppercase md:text-sm' style={{ color }}>
                {label}
            </p>
            <div
                className='h-px w-16'
                style={{
                    background: `linear-gradient(90deg, ${line} 0%, rgba(255,255,255,0) 100%)`
                }}
                aria-hidden='true'
            />
        </div>
    );
};

export default SectionEyebrow;
