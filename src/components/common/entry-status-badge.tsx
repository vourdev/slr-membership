import { cn } from '@/lib/utils';
import type { EntryStatus } from '@/types/member';

// entry_status is the public, frontend-safe projection of the internal-only
// draw_pass value. Never render a draw_pass count anywhere — only this
// active/inactive state. See CLAUDE.md §1.
interface EntryStatusBadgeProps {
    status: EntryStatus;
    className?: string;
}

export function EntryStatusBadge({ status, className }: EntryStatusBadgeProps) {
    const active = status === 'active';

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                active
                    ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                    : 'text-slr-dim border-white/15 bg-white/5',
                className
            )}>
            <span className={cn('size-1.5 rounded-full', active ? 'bg-emerald-400' : 'bg-slr-dim')} />
            {active ? 'Active' : 'Inactive'}
        </span>
    );
}
