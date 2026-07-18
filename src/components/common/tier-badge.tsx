import { SUB_TIERS, TIER_VISUALS } from '@/constant/tiers';
import { cn } from '@/lib/utils';
import type { SubTierCode, TierGroup } from '@/types/member';

import { Crown, Flame, type LucideIcon, Sparkles } from 'lucide-react';

const GROUP_ICON: Record<TierGroup, LucideIcon> = {
    visitor: Sparkles,
    red: Flame,
    blue: Crown
};

const SIZES = {
    sm: { wrap: 'h-5 gap-1 px-2 text-xs', icon: 'size-3' },
    md: { wrap: 'h-6 gap-1.5 px-2.5 text-xs', icon: 'size-3.5' }
} as const;

interface TierBadgeProps {
    subTier: SubTierCode;
    size?: keyof typeof SIZES;
    /** Show the tier group with the marketing name, e.g. "RED · Plus". Off → "Plus". */
    showGroup?: boolean;
    className?: string;
}

/** Tier pill supporting Visitor + every paid sub-tier (R1/R4/R7, B1/B4/B7/B10). */
export function TierBadge({ subTier, size = 'md', showGroup = true, className }: TierBadgeProps) {
    const meta = SUB_TIERS[subTier];
    const visual = TIER_VISUALS[meta.group];
    const Icon = GROUP_ICON[meta.group];
    const sz = SIZES[size];

    const label =
        meta.group === 'visitor'
            ? 'Visitor'
            : showGroup
              ? `${visual.label} · ${meta.marketingName}`
              : meta.marketingName;

    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-full border font-semibold tracking-wide uppercase',
                sz.wrap,
                visual.textClass,
                className
            )}
            style={{ background: visual.badgeBg, borderColor: visual.badgeBorder }}>
            <Icon className={cn(sz.icon, 'shrink-0')} />
            {label}
        </span>
    );
}

interface TierGroupBadgeProps {
    group: TierGroup;
    size?: keyof typeof SIZES;
    className?: string;
}

/** Tier pill keyed to a tier group only (no sub-tier) — e.g. for giveaway cards. */
export function TierGroupBadge({ group, size = 'sm', className }: TierGroupBadgeProps) {
    const visual = TIER_VISUALS[group];
    const Icon = GROUP_ICON[group];
    const sz = SIZES[size];

    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-full border font-semibold tracking-wide uppercase',
                sz.wrap,
                visual.textClass,
                className
            )}
            style={{ background: visual.badgeBg, borderColor: visual.badgeBorder }}>
            <Icon className={cn(sz.icon, 'shrink-0')} />
            {visual.label}
        </span>
    );
}
