'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { menuItems } from '@/data/menu-items';
import { logoutAction } from '@/lib/logout-action';
import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { UserInfo } from '../ui/user-info';
import { Menu, X } from 'lucide-react';

type NavbarProps = {
    user?: any;
};

export function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className='bg-slr-navy-deep/95 border-slr-navy-border/60 fixed top-0 right-0 left-0 z-50 mx-auto w-full border-b backdrop-blur-md'>
            <nav className='px-4 py-3 sm:px-6'>
                <div className='mx-auto grid max-w-7xl grid-cols-2 items-center gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'>
                    {/* Logo */}
                    <div className='flex items-center justify-self-start'>
                        <Link href='/' className='flex items-center gap-2'>
                            <Image
                                src='/images/slr-rewards-logo.webp'
                                alt='SLR Rewards Logo'
                                width={48}
                                height={48}
                                priority
                                className='h-10 w-auto sm:h-11'
                            />
                            <span className='sr-only'>SLR Rewards</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <ul className='hidden items-center gap-1 justify-self-center xl:flex'>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.url;
                            return (
                                <li key={item.text}>
                                    <Link
                                        href={item.url}
                                        className={cn(
                                            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'text-slr-gold'
                                                : 'text-slr-navy-foreground/80 hover:text-slr-gold'
                                        )}>
                                        {item.text}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Right side: Join Us / User */}
                    <div className='flex items-center gap-3 justify-self-end'>
                        {user ? (
                            <div className='hidden xl:flex'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <UserInfo user={user?.user} showEmail={true} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href='/dashboard'>Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => logoutAction()}>Log Out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <Link href='/sign-in' className='hidden xl:flex'>
                                <Button className='slr-gold-gradient text-slr-gold-foreground hover:opacity-90 h-10 rounded-full px-6 font-semibold shadow-md'>
                                    Join Us
                                </Button>
                            </Link>
                        )}

                        {/* Mobile toggler */}
                        <button
                            onClick={toggleMenu}
                            type='button'
                            className='text-slr-navy-foreground flex cursor-pointer items-center justify-center focus:outline-none xl:hidden'
                            aria-controls='mobile-menu'
                            aria-expanded={isOpen}>
                            {isOpen ? (
                                <X className='h-6 w-6' aria-hidden='true' />
                            ) : (
                                <Menu className='h-6 w-6' aria-hidden='true' />
                            )}
                            <span className='sr-only'>Toggle navigation</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <Transition
                show={isOpen}
                enter='transition ease-out duration-200 transform'
                enterFrom='opacity-0 -translate-y-2'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150 transform'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 -translate-y-2'>
                <div id='mobile-menu' className='border-slr-navy-border/40 border-t xl:hidden'>
                    <ul className='flex flex-col gap-1 px-4 py-4'>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.url;
                            return (
                                <li key={item.text} onClick={toggleMenu}>
                                    <Link
                                        href={item.url}
                                        className={cn(
                                            'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                            isActive
                                                ? 'text-slr-gold bg-white/5'
                                                : 'text-slr-navy-foreground/80 hover:bg-white/5'
                                        )}>
                                        {item.text}
                                    </Link>
                                </li>
                            );
                        })}
                        <li className='pt-2'>
                            {!user && (
                                <Link href='/sign-in' className='block w-full' onClick={toggleMenu}>
                                    <Button className='slr-gold-gradient text-slr-gold-foreground w-full rounded-full font-semibold'>
                                        Join Us
                                    </Button>
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </Transition>
        </header>
    );
}

export default Navbar;
