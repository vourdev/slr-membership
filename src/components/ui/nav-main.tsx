'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from '@/components/ui/sidebar';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { Box, ChevronDown, ClipboardList, LayoutGrid, UsersIcon } from 'lucide-react';

export function NavMain({ user }) {
    const isSuperAdmin = user?.role?.includes('ROLE_SUPER_ADMIN');
    const isSVP = user?.role?.includes('ROLE_SPV');

    const baseItems: any[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid
        },
        {
            title: 'Registrations',
            href: '/dashboard/registrations',
            icon: ClipboardList
        }
    ];

    const adminOnlyItems = [
        {
            title: 'Master Data',
            icon: Box,
            items: [
                {
                    title: 'Wilayah',
                    href: '/dashboard/master-data/wilayah'
                },
                {
                    title: 'Commodity',
                    href: '/dashboard/master-data/commodity'
                }
                // {
                //     title: 'Categories',
                //     href: '/dashboard/master-data/categories'
                // }
            ]
        }
    ];

    const userManagementItems = [
        {
            title: 'Users',
            href: '/dashboard/users',
            icon: UsersIcon
        }
    ];

    let items = [...baseItems];

    if (isSuperAdmin || isSVP) {
        items = [...items, ...userManagementItems];
    }

    if (isSuperAdmin) {
        items = [...items, ...adminOnlyItems];
    }

    const pathname = usePathname();

    return (
        <SidebarGroup className='px-2 py-0'>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>

            <SidebarMenu>
                {items?.map((item) => {
                    const href = typeof item.href === 'string' ? item.href : item.href;
                    const hasChildren = !!item.items && item.items.length > 0;

                    const isActive = !!href && pathname === href;
                    const isChildActive = hasChildren
                        ? item.items!.some((child) => pathname.startsWith(child.href))
                        : false;

                    if (!hasChildren) {
                        return (
                            <SidebarMenuItem key={href ?? item.title}>
                                <SidebarMenuButton asChild isActive={isActive} tooltip={{ children: item.title }}>
                                    <Link href={href ?? '#'} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible key={item.title} defaultOpen={isChildActive} className='group/collapsible'>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        isActive={isChildActive || isActive}
                                        tooltip={{ children: item.title }}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronDown className='ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items!.map((child) => {
                                            const childActive = pathname === child.href;

                                            return (
                                                <SidebarMenuSubItem key={child.href}>
                                                    <SidebarMenuSubButton asChild isActive={childActive}>
                                                        <Link href={child.href} prefetch>
                                                            <span>{child.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
