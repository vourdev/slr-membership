import { cn } from '@/lib/utils';
import type { EntryStatus } from '@/types/member';

type EntryStatusBadgeValue = EntryStatus | 'expired';

interface EntryStatusBadgeProps {
    status: EntryStatusBadgeValue;
    className?: string;
}

const TONE: Record<EntryStatusBadgeValue, { wrapper: string; dot: string; label: string }> = {
    active: {
        wrapper: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
        dot: 'bg-emerald-400',
        label: 'Active'
    },
    inactive: {
        wrapper: 'text-slr-dim border-white/15 bg-white/5',
        dot: 'bg-slr-dim',
        label: 'Inactive'
    },
    expired: {
        wrapper: 'border-white/10 bg-white/[0.03] text-white/40',
        dot: 'bg-white/30',
        label: 'Expired'
    }
};

export function EntryStatusBadge({ status, className }: EntryStatusBadgeProps) {
    const tone = TONE[status] ?? TONE.inactive;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                tone.wrapper,
                className
            )}>
            <span className={cn('size-1.5 rounded-full', tone.dot)} />
            {tone.label}
        </span>
    );
}
