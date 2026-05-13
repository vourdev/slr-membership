'use client';

import React from 'react';

import Image from 'next/image';

import { API_BASE_URL } from '@/lib/api-endpoints';
import { separatorNumber } from '@/lib/utils';
import { NeracaTabType } from '@/types/neraca';
import { RegionStat } from '@/types/status';

import clsx from 'clsx';

export type RegionLayout = {
    left: number;
    top: number;
    anchor?: string;
};

interface RegionCalloutProps {
    region: RegionStat;
    layout: RegionLayout;

    activeTab: NeracaTabType;

    className?: string;
}

function shadeColor(hex: string, percent: number) {
    const h = hex.replace('#', '');
    let r = parseInt(h.slice(0, 2), 16);
    let g = parseInt(h.slice(2, 4), 16);
    let b = parseInt(h.slice(4, 6), 16);

    r = Math.floor((r * (100 - percent)) / 100);
    g = Math.floor((g * (100 - percent)) / 100);
    b = Math.floor((b * (100 - percent)) / 100);

    const rr = r.toString(16).padStart(2, '0');
    const gg = g.toString(16).padStart(2, '0');
    const bb = b.toString(16).padStart(2, '0');

    return `#${rr}${gg}${bb}`;
}

function hexToRgba(hex: string, alpha = 0.25) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getReadableTextColor(hex: string) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    if (luminance > 0.7) {
        return shadeColor(hex, 30);
    }

    return hex;
}

function getStatusStyle(item: RegionStat, activeTab: NeracaTabType, isPercentage = false): React.CSSProperties {
    let baseColor: string | undefined;

    switch (activeTab) {
        case 'neraca':
            baseColor = item.neraca_status?.metadata?.color;
            break;
        case 'ketersediaan':
            baseColor = item.stock_status?.metadata?.color;
            break;
        case 'kebutuhan':
            baseColor = item.demand_status?.metadata?.color;
            break;
    }

    if (!baseColor) {
        return {
            color: isPercentage ? '#9CA3AF' : '#374151',
            backgroundColor: isPercentage ? 'transparent' : '#F3F4F6',
            fontWeight: '600'
        };
    }

    const textColor = getReadableTextColor(baseColor);

    return {
        backgroundColor: isPercentage ? 'transparent' : hexToRgba(baseColor, 0.25),
        color: textColor,
        fontWeight: '700'
    };
}

function getUnitValue(item: RegionStat, activeTab: NeracaTabType): string {
    let value: number | undefined;

    switch (activeTab) {
        case 'neraca':
            value = item.neraca;
            break;
        case 'ketersediaan':
            value = item.total_stock;
            break;
        case 'kebutuhan':
            value = item.total_demand;
            break;
    }

    if (value === undefined || value === null) {
        return '-';
    }

    return separatorNumber.format(value);
}

function getStatusValue(item: RegionStat, activeTab: NeracaTabType) {
    switch (activeTab) {
        case 'neraca':
            return item.neraca_status.name;
        case 'ketersediaan':
            return item.stock_status.name;
        case 'kebutuhan':
            return item.demand_status.name;
        default:
            return 'Tidak Tersedia';
    }
}

function getPercentageValue(item: RegionStat, activeTab: NeracaTabType) {
    switch (activeTab) {
        case 'neraca':
            return item.neraca_percentage;
        case 'ketersediaan':
            return item.total_stock_percentage;
        case 'kebutuhan':
            return item.total_demand_percentage;
        default:
            return 'Tidak Tersedia';
    }
}

export const RegionCallout: React.FC<RegionCalloutProps> = ({ region, layout, className, activeTab }) => {
    return (
        <div
            className={clsx('callout static w-full lg:w-67.5 xl:absolute', className)}
            style={{
                left: layout.left,
                top: layout.top
            }}
            data-anchor={layout.anchor}>
            <div className='flex items-start gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 lg:gap-4 lg:px-6'>
                <Image
                    src={`${API_BASE_URL}/${region.region.icon_url}`}
                    alt='icon'
                    width={100}
                    height={100}
                    className='h-10 w-9'
                />
                <div className='flex flex-col'>
                    <div className='text-xs font-medium text-slate-900 sm:text-sm'>{region.region.name}</div>

                    <div className='mt-1 text-xl font-bold lg:text-2xl'>
                        {getUnitValue(region, activeTab)} <span className='text-base font-bold'>ton</span>
                    </div>

                    <div className='mt-2 flex items-center gap-2'>
                        <p className='text-sm font-medium' style={getStatusStyle(region, activeTab, true)}>
                            {getPercentageValue(region, activeTab)}%
                        </p>

                        <div
                            className='inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold'
                            style={getStatusStyle(region, activeTab)}>
                            {getStatusValue(region, activeTab)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
