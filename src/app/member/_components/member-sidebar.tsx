'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { TierBadge } from '@/components/common/tier-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import type { CurrentMember } from '@/types/member';

import { MEMBER_NAV } from './member-nav';

interface MemberSidebarProps {
    user: { name?: string | null; email?: string | null; image?: string | null } | null;
    member: CurrentMember;
}

export function MemberSidebar({ user, member }: MemberSidebarProps) {
    const pathname = usePathname();
    const getInitials = useInitials();
    const { isMobile, setOpenMobile } = useSidebar();

    // Dashboard ('/member') is exact-match; deeper pages match by prefix.
    const isActive = (href: string) => (href === '/member' ? pathname === '/member' : pathname.startsWith(href));

    // On mobile the sidebar is an overlay sheet — dismiss it once a destination is
    // picked, otherwise it stays covering the page the user just navigated to.
    const closeOnMobile = () => {
        if (isMobile) setOpenMobile(false);
    };

    return (
        <Sidebar collapsible='icon' variant='inset'>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild>
                            <Link href='/member' prefetch onClick={closeOnMobile}>
                                <Image
                                    src='/images/slr-rewards-logo.webp'
                                    alt='SLR Rewards'
                                    width={250}
                                    height={250}
                                    priority
                                    className='h-7 w-auto object-contain'
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className='px-2 py-2'>
                    <SidebarGroupLabel className='mb-1'>Menu</SidebarGroupLabel>
                    <SidebarMenu className='gap-1.5'>
                        {MEMBER_NAV.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    size='lg'
                                    isActive={isActive(item.href)}
                                    tooltip={{ children: item.title }}
                                    className='gap-3 text-base group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:pl-0! [&>svg]:size-5'>
                                    <Link href={item.href} onClick={closeOnMobile}>
                                        <item.icon />
                                        <span className='group-data-[collapsible=icon]:hidden'>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className='border-sidebar-border bg-sidebar-accent/10 flex items-center gap-2 rounded-lg border p-2 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0'>
                    <Avatar className='size-8'>
                        <AvatarImage src={user?.image ?? ''} alt={member.name} />
                        <AvatarFallback className='bg-slr-navy-card text-sidebar-foreground text-xs font-semibold'>
                            {getInitials(member.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 leading-tight group-data-[collapsible=icon]:hidden'>
                        <span className='text-sidebar-foreground truncate text-sm font-medium'>{member.name}</span>
                        <div className='mt-1'>
                            <TierBadge subTier={member.sub_tier} size='sm' />
                        </div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
