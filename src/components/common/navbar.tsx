'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { menuItems } from '@/constant/menu-items';
import { logoutAction } from '@/lib/logout-action';
import { cn } from '@/lib/utils';
import { Button, Transition } from '@headlessui/react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { UserInfo } from '../ui/user-info';
import Container from './container';
import { Menu, X } from 'lucide-react';

type NavbarProps = {
    user?: any;
};

export function Navbar({ user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeHash, setActiveHash] = useState<string>('');
    const [scrolled, setScrolled] = useState<boolean>(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Track current hash so hash-based menu items can show their active state
    useEffect(() => {
        const updateHash = () => setActiveHash(window.location.hash || '');
        updateHash();
        window.addEventListener('hashchange', updateHash);
        return () => window.removeEventListener('hashchange', updateHash);
    }, []);

    // Track scroll for subtle navbar shadow feedback
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Glassmorphism style per spec
    const glassStyle: React.CSSProperties = {
        background: 'linear-gradient(117.58deg, rgba(215, 237, 237, 0.16) -47.79%, rgba(204, 235, 235, 0) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0, 0, 0, 0.4)' : 'none'
    };

    // Gold gradient CTA style per spec
    const goldButtonStyle: React.CSSProperties = {
        background: 'linear-gradient(89.12deg, #F5D78E 3.07%, #D4AF37 41.36%, #FFE066 60.5%, #A07018 98.79%)'
    };

    const isActive = (url: string) => {
        if (!url) return false;
        // hash-based item (e.g. "#pricing")
        if (url.startsWith('#')) {
            if (url === '#') return activeHash === '' || activeHash === '#';
            return activeHash === url;
        }
        // pathname-based item
        return pathname === url;
    };

    return (
        <header
            className={cn(
                'fixed top-0 right-0 left-0 z-50 mx-auto max-w-7xl bg-transparent lg:px-4',
                scrolled ? 'lg:pt-0' : 'lg:pt-1'
            )}>
            <Container className='px-0!'>
                <nav
                    style={glassStyle}
                    className={cn(
                        'mx-auto flex items-center justify-between px-5 py-2.5 transition-all duration-300 lg:mt-5',
                        isOpen ? '' : 'rounded-b-2xl lg:rounded-xl'
                    )}>
                    {/* Logo */}
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

                    {/* Desktop Menu */}
                    <ul className='hidden items-center gap-1 xl:flex'>
                        {menuItems.map((item) => {
                            const active = isActive(item.url);
                            return (
                                <li key={item.text}>
                                    <Link
                                        href={item.url}
                                        className={cn(
                                            'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                                            active ? 'text-white' : 'text-[#CDCECF] hover:text-white'
                                        )}>
                                        {item.text}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

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
                            <Link
                                href='/sign-up'
                                style={goldButtonStyle}
                                className='hidden rounded-xl px-8 py-2.5 font-bold text-[#1a1408] shadow-md transition-opacity hover:opacity-90 xl:block'>
                                Join Now
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
                </nav>
            </Container>

            {/* Mobile Menu */}
            <Transition
                show={isOpen}
                enter='transition ease-out duration-200 transform'
                enterFrom='opacity-0 -translate-y-2'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150 transform'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 -translate-y-2'>
                <div id='mobile-menu' style={glassStyle} className='mx-auto rounded-b-2xl shadow-lg xl:hidden'>
                    <ul className='flex flex-col gap-1 px-4 py-4'>
                        {menuItems.map((item) => {
                            const active = isActive(item.url);
                            return (
                                <li key={item.text} onClick={toggleMenu}>
                                    <Link
                                        href={item.url}
                                        className={cn(
                                            'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                            active
                                                ? 'bg-white/5 text-white'
                                                : 'text-[#CDCECF] hover:bg-white/5 hover:text-white'
                                        )}>
                                        {item.text}
                                    </Link>
                                </li>
                            );
                        })}
                        <li className='pt-2'>
                            <Link
                                href='#cta'
                                style={goldButtonStyle}
                                className='block w-full rounded-xl px-5 py-2 text-center font-bold text-[#1a1408] shadow-md'
                                onClick={toggleMenu}>
                                Join Now
                            </Link>
                        </li>
                    </ul>
                </div>
            </Transition>
        </header>
    );
}
