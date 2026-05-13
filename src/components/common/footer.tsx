'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ChevronUp, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    const membershipLinks = [
        { name: 'Join Now', href: '#join' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Reward Tiers', href: '#tiers' },
        { name: 'Discount Partners', href: '#partners' }
    ];

    const informationLinks = [
        { name: 'About SLR', href: '#about' },
        { name: 'Terms & Conditions', href: '#terms' },
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'FAQ', href: '#faq' }
    ];

    const legalLinks = [
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Disclaimer', href: '#disclaimer' }
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className='bg-slr-navy-deep text-slr-navy-foreground border-slr-navy-border/40 border-t'>
            {/* Top brand band */}
            <div className='border-slr-navy-border/40 border-b py-8'>
                <div className='mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-6'>
                    <Image
                        src='/images/slr-rewards-logo.webp'
                        alt='SLR Rewards'
                        width={80}
                        height={80}
                        className='h-14 w-auto'
                    />
                </div>
            </div>

            {/* Links */}
            <div className='mx-auto max-w-7xl px-6 py-12'>
                <div className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4'>
                    <div>
                        <div className='mb-4 flex items-center gap-3'>
                            <Image
                                src='/images/slr-rewards-logo.webp'
                                alt='SLR Rewards'
                                width={56}
                                height={56}
                                className='h-12 w-auto'
                            />
                            <div className='text-base leading-tight font-extrabold tracking-wide'>SMART LIFE REWARDS</div>
                        </div>
                        <p className='text-slr-navy-foreground/70 text-sm leading-relaxed'>
                            Australia&apos;s Best Value Rewards Club. Helping Australians beat the cost of living with
                            weekly rewards, partner discounts, and digital offers.
                        </p>
                    </div>

                    <div>
                        <h3 className='mb-4 text-sm font-bold tracking-widest uppercase'>Membership</h3>
                        <ul className='space-y-3'>
                            {membershipLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='text-slr-navy-foreground/70 hover:text-slr-gold text-sm transition-colors'>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className='mb-4 text-sm font-bold tracking-widest uppercase'>Information</h3>
                        <ul className='space-y-3'>
                            {informationLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='text-slr-navy-foreground/70 hover:text-slr-gold text-sm transition-colors'>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className='mb-4 text-sm font-bold tracking-widest uppercase'>Legal</h3>
                        <ul className='space-y-3'>
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='text-slr-navy-foreground/70 hover:text-slr-gold text-sm transition-colors'>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className='text-slr-navy-foreground/70 mt-4 flex items-center gap-2 text-sm'>
                            <Mail className='h-4 w-4' />
                            <span>support@slrrewards.com.au</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className='border-slr-navy-border/40 border-t'>
                <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row'>
                    <p className='text-slr-navy-foreground/60 text-center text-xs md:text-start'>
                        © {new Date().getFullYear()} Smart Life Rewards Pty Ltd. All rights reserved. Australia&apos;s
                        Best Value Rewards Club.
                    </p>
                    <button
                        type='button'
                        onClick={scrollToTop}
                        className='text-slr-navy-foreground/70 hover:text-slr-gold flex cursor-pointer items-center gap-2 text-xs transition-colors'>
                        <span>Back to top</span>
                        <ChevronUp className='h-4 w-4' />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
