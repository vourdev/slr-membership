'use client';
import React from 'react';

import Image from 'next/image';

import { ChevronUp, Globe, Mail, Phone } from 'lucide-react';

type Props = {};

const Footer: React.FC = () => {
    const footerLinks = {
        hubungi_kami: [
            {
                name: 'dpkp@kaltaraprov.go.id',
                href: '',
                icon: <Mail className='h-5 w-5' />
            },
            {
                name: '+62 811-5979-911',
                href: '',
                icon: <Phone className='h-5 w-5' />
            },
            {
                name: 'dpkp.kaltaraprov.go.id',
                href: '',
                icon: <Globe className='h-5 w-5' />
            }
        ]
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className='flex flex-col items-center bg-white pt-6 md:pt-12'>
            <div className='max-w-360 px-4 py-16 md:px-6'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-12'>
                    {/* Brand Column */}
                    <div className='lg:col-span-5'>
                        <div className='mb-6 flex items-center gap-3'>
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
                            <div className='flex flex-col'>
                                <div className='text-base leading-tight font-extrabold text-slate-900'>
                                    DASHBOARD HARGA DAN PASOKAN PANGAN
                                </div>
                                <p className='text-sm text-slate-600'>Provinsi Kalimantan Utara</p>
                            </div>
                        </div>
                        <p className='mb-6 text-sm font-normal text-slate-600'>
                            Aplikasi Informasi Harga dan Pasokan Pangan Provinsi Kalimantan Utara merupakan sistem
                            digital yang menyediakan data harga komoditas dan ketersediaan pasokan pangan secara
                            real-time. Dikelola untuk mendukung transparansi, pengawasan, dan stabilitas pangan di
                            wilayah Kalimantan Utara.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className='lg:col-span-7'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                                <div key={category}>
                                    <h3 className='mb-4 text-lg font-bold text-slate-900'>
                                        {category
                                            .split('_')
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}
                                    </h3>
                                    <p className='mb-2 text-sm font-semibold text-slate-900'>
                                        Sekretariat Tim Pengendalian Inflasi Provinsi Kalimantan Utara
                                    </p>
                                    <p className='mb-2 text-sm font-normal text-slate-600'>
                                        Jl. Agatish No.1, Tanjung Selor Hilir, Kecamatan Tanjung Selor, Kabupaten
                                        Bulungan, Kalimantan Utara 77212
                                    </p>
                                    <ul className='flex flex-col gap-4'>
                                        {links.map((link, index) => (
                                            <li key={index} className='flex items-start gap-2'>
                                                <>
                                                    {link.href !== '' ? (
                                                        <a
                                                            href={link.href}
                                                            className='text-sm text-slate-600 hover:text-gray-900'>
                                                            {link.name}
                                                        </a>
                                                    ) : (
                                                        <div className='flex items-center gap-2 text-sm text-slate-600 hover:text-gray-900'>
                                                            {link.icon}
                                                            {link.name}
                                                        </div>
                                                    )}
                                                </>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div>
                                <h3 className='mb-4 text-lg font-bold text-slate-900'>Sumber Data</h3>
                                <ul className='flex flex-col gap-4'>
                                    <li className='flex flex-col items-start gap-2'>
                                        <Image
                                            src='/icons/ic-dpkp.webp'
                                            alt='logo'
                                            width={100}
                                            height={100}
                                            className='h-18 w-18 md:h-24 md:w-24'
                                        />
                                        <Image
                                            src='/icons/ic-bpn.webp'
                                            alt='logo'
                                            width={100}
                                            height={100}
                                            className='h-12 w-28 md:h-14 md:w-32'
                                        />
                                        <Image
                                            src='/icons/ic-bi.webp'
                                            alt='logo'
                                            width={100}
                                            height={100}
                                            className='h-14 w-42 md:h-16 md:w-48'
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Copyright */}
            <div className='w-full max-w-360 border-t border-gray-200 px-4'>
                <div className='flex flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row md:px-6 xl:px-0'>
                    <p className='text-center text-sm text-slate-800 md:text-start'>
                        Copyright © {new Date().getFullYear()} Dashboard Harga dan Pasokan Pangan Provinsi Kalimantan
                        Utara. Hak Cipta Dilindungi.
                    </p>
                    <div
                        onClick={() => {
                            scrollToTop();
                        }}
                        className='hidden cursor-pointer items-center gap-2 text-sm text-slate-700 lg:flex'>
                        <p>Kembali Keatas</p>
                        <ChevronUp className='h-5 w-5' />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
