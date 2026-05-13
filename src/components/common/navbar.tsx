'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { menuItems } from '@/data/menu-items';
import { logoutAction } from '@/lib/logout-action';
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

export function Navbar({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className='fixed top-0 right-0 left-0 z-50 mx-auto w-full bg-white shadow transition-all ease-out'>
            <nav className='bg-primary-950 p-4'>
                <div className='grid grid-cols-1 items-center gap-4 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'>
                    <div className='flex w-full items-center justify-between gap-2 justify-self-start sm:gap-3'>
                        <Link href='/' className='flex min-w-0 items-center gap-2 sm:gap-3'>
                            <div className='flex shrink-0 items-center gap-2'>
                                <Image
                                    src='/images/kalimantan-utara-logo.webp'
                                    alt='Logo Pemerintah Kalimantan Utara'
                                    width={40}
                                    height={50}
                                    priority
                                    className='h-auto w-8 sm:w-9'
                                />
                                <Image
                                    src='/icons/ic-bi-indonesia.webp'
                                    alt='Logo Bank Indonesia'
                                    width={40}
                                    height={50}
                                    priority
                                    className='h-auto w-8 sm:w-9'
                                />
                            </div>

                            <div className='flex min-w-0 flex-col'>
                                <div className='truncate text-xs font-bold text-slate-900 sm:text-sm md:text-base'>
                                    DASHBOARD HARGA DAN PASOKAN PANGAN
                                </div>
                                <span className='truncate text-xs font-medium text-gray-600 sm:text-sm'>
                                    Provinsi Kalimantan Utara
                                </span>
                            </div>
                        </Link>

                        <div className='flex items-center xl:hidden'>
                            {user && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <UserInfo
                                            user={user?.user ? user?.user : 'User'}
                                            showEmail={false}
                                            showUsername={false}
                                        />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href='/dashboard'>Dashboard</Link>
                                        </DropdownMenuItem>{' '}
                                        <DropdownMenuItem onClick={() => logoutAction()}>Log Out</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            <button
                                onClick={toggleMenu}
                                type='button'
                                className='text-primary flex cursor-pointer items-center justify-center focus:outline-none xl:hidden'
                                aria-controls='mobile-menu'
                                aria-expanded={isOpen}>
                                {isOpen ? (
                                    <X className='h-7 w-7 text-slate-700' aria-hidden='true' />
                                ) : (
                                    <Menu className='h-7 w-7 text-slate-700' aria-hidden='true' />
                                )}
                                <span className='sr-only'>Toggle navigation</span>
                            </button>
                        </div>
                    </div>

                    <ul className='hidden space-x-6 justify-self-center rounded-full border bg-white/90 px-7 py-2.5 xl:flex'>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.url;

                            return (
                                <li
                                    key={item.text}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                        isActive ? 'text-primary' : 'hover:text-primary text-slate-600'
                                    }`}>
                                    {item.icon}
                                    <Link href={item.url} className='font-medium transition-colors'>
                                        {item.text}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {user ? (
                        <div className='hidden w-auto justify-self-end rounded-full xl:flex'>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <UserInfo user={user?.user} showEmail={true} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href='/dashboard'>Dashboard</Link>
                                    </DropdownMenuItem>{' '}
                                    <DropdownMenuItem onClick={() => logoutAction()}>Log Out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Link href='/sign-in' className='hidden justify-self-end xl:flex'>
                            <Button className='rounded-full px-5 py-5'>Login</Button>
                        </Link>
                    )}
                </div>
            </nav>

            <Transition
                show={isOpen}
                enter='transition ease-out duration-200 transform'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='transition ease-in duration-75 transform'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'>
                <div id='mobile-menu' className='xl:hidden'>
                    <ul className='flex flex-col space-y-5 px-4 pt-4 xl:pb-6'>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.url;

                            return (
                                <li
                                    key={item.text}
                                    onClick={toggleMenu}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'text-primary' // aktif
                                            : 'hover:text-primary text-slate-600'
                                    }`}>
                                    {item.icon}

                                    <Link href={item.url} className='font-medium transition-colors'>
                                        {item.text}
                                    </Link>
                                </li>
                            );
                        })}
                        <li>
                            {!user && (
                                <Link href='/sign-in' className='w-full'>
                                    <Button className='w-full rounded-full px-5 py-5.5'>Login</Button>
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
