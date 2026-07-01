'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { MemberNotification, NotificationType } from '@/types/member';

import {
    Bell,
    BellOff,
    CalendarClock,
    CheckCheck,
    CreditCard,
    Gift,
    type LucideIcon,
    Sparkles,
    Tag,
    Trophy,
    Users
} from 'lucide-react';

const ICON: Record<NotificationType, LucideIcon> = {
    draw_win: Trophy,
    draw_result: Gift,
    renewal: CalendarClock,
    spin: Sparkles,
    referral: Users,
    tier_change: CreditCard,
    beny: Tag,
    system: Bell
};

function timeAgo(iso: string): string {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d`;

    return `${Math.floor(days / 7)}w`;
}

export function NotificationsPanel({ initial }: { initial: MemberNotification[] }) {
    const router = useRouter();
    const [items, setItems] = useState<MemberNotification[]>(initial);

    const unread = items.filter((n) => !n.read_at).length;

    const markAllRead = () =>
        setItems((xs) => xs.map((n) => (n.read_at ? n : { ...n, read_at: new Date().toISOString() })));

    const openItem = (n: MemberNotification) => {
        setItems((xs) =>
            xs.map((x) => (x.id === n.id && !x.read_at ? { ...x, read_at: new Date().toISOString() } : x))
        );
        if (n.href) router.push(n.href);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type='button'
                    aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
                    className='text-slr-muted hover:text-foreground relative inline-flex size-9 items-center justify-center rounded-lg border border-white/5 bg-white/3 transition-colors hover:bg-white/6'>
                    <Bell className='size-4' />
                    {unread > 0 && (
                        <span className='absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs leading-4 font-bold text-white'>
                            {unread}
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            {/* Portaled outside .slr-member — style explicitly dark. */}
            <PopoverContent
                align='end'
                sideOffset={8}
                className='border-slr-navy-border bg-slr-navy-deep w-[22rem] max-w-[calc(100vw-2rem)] p-0 text-white'>
                <div className='flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3'>
                    <p className='text-sm font-semibold text-white'>Notifications</p>
                    {unread > 0 && (
                        <button
                            type='button'
                            onClick={markAllRead}
                            className='text-slr-gold-label inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80'>
                            <CheckCheck className='size-3.5' /> Mark all read
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className='flex flex-col items-center gap-2 px-4 py-12 text-center'>
                        <BellOff className='text-slr-dim size-6' />
                        <p className='text-slr-muted text-sm'>You&apos;re all caught up.</p>
                    </div>
                ) : (
                    <ul className='max-h-[26rem] divide-y divide-white/5 overflow-y-auto'>
                        {items.map((n) => {
                            const Icon = ICON[n.type];
                            const isUnread = !n.read_at;

                            return (
                                <li key={n.id}>
                                    <button
                                        type='button'
                                        onClick={() => openItem(n)}
                                        className={cn(
                                            'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5',
                                            isUnread && 'bg-white/3'
                                        )}>
                                        <span className='bg-gold-tint flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF3759]'>
                                            <Icon className='text-slr-gold-label size-4' />
                                        </span>
                                        <span className='min-w-0 flex-1'>
                                            <span className='flex items-start justify-between gap-2'>
                                                <span className='text-sm font-medium text-white'>{n.title}</span>
                                                <span className='text-slr-dim shrink-0 text-xs'>
                                                    {timeAgo(n.created_at)}
                                                </span>
                                            </span>
                                            <span className='text-slr-muted mt-0.5 block text-xs leading-relaxed'>
                                                {n.body}
                                            </span>
                                        </span>
                                        {isUnread && (
                                            <span className='bg-slr-gold-label mt-1.5 size-2 shrink-0 rounded-full' />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </PopoverContent>
        </Popover>
    );
}
