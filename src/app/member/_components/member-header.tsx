'use client';

import Link from 'next/link';

import { TierBadge } from '@/components/common/tier-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import { logoutAction } from '@/lib/logout-action';
import type { CurrentMember } from '@/types/member';

import { Bell, ChevronDown, LogOut, UserCircle } from 'lucide-react';

interface MemberHeaderProps {
    user: { name?: string | null; email?: string | null; image?: string | null } | null;
    member: CurrentMember;
    notificationsCount: number;
}

export function MemberHeader({ user, member, notificationsCount }: MemberHeaderProps) {
    const getInitials = useInitials();
    const email = user?.email ?? '';
    const firstName = member.name.split(' ')[0];

    return (
        <header className='border-slr-navy-border/60 bg-slr-navy-deep/80 sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-md md:px-6'>
            <SidebarTrigger className='-ml-1' />

            <div className='ml-auto flex items-center gap-1.5 sm:gap-2'>
                <button
                    type='button'
                    aria-label={
                        notificationsCount > 0 ? `Notifications, ${notificationsCount} unread` : 'Notifications'
                    }
                    className='text-slr-muted hover:text-foreground relative inline-flex size-9 items-center justify-center rounded-lg border border-white/5 bg-white/3 transition-colors hover:bg-white/6'>
                    <Bell className='size-4' />
                    {notificationsCount > 0 && (
                        <span className='absolute -top-1 -right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-4 font-bold text-white'>
                            {notificationsCount}
                        </span>
                    )}
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type='button'
                            className='flex items-center gap-2 rounded-lg border border-white/5 bg-white/3 py-1 pr-2 pl-1 transition-colors hover:bg-white/6'>
                            <Avatar className='size-7'>
                                <AvatarImage src={user?.image ?? ''} alt={member.name} />
                                <AvatarFallback className='bg-slr-navy-card text-xs font-semibold text-white'>
                                    {getInitials(member.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span className='hidden text-sm font-medium text-white sm:inline'>{firstName}</span>
                            <TierBadge
                                subTier={member.sub_tier}
                                size='sm'
                                showGroup={false}
                                className='hidden sm:inline-flex'
                            />
                            <ChevronDown className='text-slr-muted size-4' />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-56'>
                        <DropdownMenuLabel className='flex flex-col'>
                            <span className='truncate font-medium'>{member.name}</span>
                            {email && <span className='text-slr-muted truncate text-xs font-normal'>{email}</span>}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href='/member/profile'>
                                <UserCircle className='size-4' /> Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => logoutAction()}>
                            <LogOut className='size-4' /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
