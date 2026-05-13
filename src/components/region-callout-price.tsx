'use client';

import React from 'react';

import Image from 'next/image';

import { API_BASE_URL } from '@/lib/api-endpoints';
import { formatNumber, formatPriceComparison, formatPriceDifference, separatorNumber } from '@/lib/utils';
import { PriceChangeType, PriceType } from '@/types/price';
import { RegionStat } from '@/types/status';

import clsx from 'clsx';

export type RegionLayout = {
    left: number;
    top: number;
    anchor?: string;
};

interface RegionCalloutPriceProps {
    region: RegionStat;
    layout: RegionLayout;

    activeTab: PriceChangeType;

    className?: string;
    selectedPriceType: PriceType;
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

function hexToRgba(hex: string, alpha = 0.1) {
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

function getStatusStyle(
    item: RegionStat,
    activeTab: PriceChangeType,
    isPercentage = false,
    selectedPriceType: PriceType
): React.CSSProperties {
    let baseColor: string | undefined;

    switch (activeTab) {
        case 'price':
            if (selectedPriceType === 'level-harga') {
                baseColor = item.commodity_price_status?.color;
            } else {
                baseColor = item.price_status?.metadata?.color;
            }
            break;

        case 'price-change':
            baseColor = item.price_status?.metadata?.color;
            break;
    }

    if (!baseColor) {
        return isPercentage
            ? { color: '#9CA3AF' }
            : {
                  backgroundColor: '#F3F4F6',
                  color: '#374151'
              };
    }

    if (isPercentage) {
        return {
            color: getReadableTextColor(baseColor)
        };
    }

    return {
        backgroundColor: hexToRgba(baseColor),
        color: getReadableTextColor(baseColor)
    };
}

function getUnitValue(item: RegionStat, activeTab: PriceChangeType, selectedPriceType: PriceType): string {
    let value: number | null | undefined;
    switch (selectedPriceType) {
        case 'level-harga':
            if (activeTab === 'price') {
                value = item.price;
            } else if (activeTab === 'price-change') {
                value = item.price;
            }
            break;

        case 'kaltara':
            if (activeTab === 'price-change') {
                value = item.price;
            } else {
                value = item.compare_price;
            }
            break;

        default:
            value = item.price;
            break;
    }

    return value ? `Rp ${formatNumber(value)}` : 'Rp 0';
}

function getStatusValue(item: RegionStat, activeTab: PriceChangeType, selectedPriceType: PriceType) {
    switch (activeTab) {
        case 'price':
            if (selectedPriceType == 'level-harga') {
                return item.commodity_price_status.status;
            } else {
                return item.price_percentage ? `${item.price_percentage}%` : '';
            }
        case 'price-change':
            const currentPrice = item.price || 0;
            const previousPrice = item?.prev_price || item?.prev_year_price || item?.prev_year_avg_price || 0;

            return formatPriceComparison(currentPrice, previousPrice, 'percentage');
        default:
            return '';
    }
}

function getPercentageValue(item: RegionStat, activeTab: PriceChangeType) {
    switch (activeTab) {
        case 'price':
            return item.price_percentage ? `${item.price_percentage}%` : '0';

        case 'price-change':
            if (!item.price && item.price !== 0) {
                return '0%';
            }

            const comparisonPrice = item?.prev_price || item?.prev_year_price || 0;

            if (comparisonPrice === null || comparisonPrice === undefined) {
                return '0%';
            }

            return formatPriceDifference(
                item.price || 0,
                item?.prev_price || item?.prev_year_price || item?.prev_year_avg_price || 0
            );

        default:
            return '';
    }
}

export const RegionCalloutPrice: React.FC<RegionCalloutPriceProps> = ({
    region,
    layout,
    className,
    activeTab,
    selectedPriceType
}) => {
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
                        {getUnitValue(region, activeTab, selectedPriceType)}
                    </div>

                    <div className='mt-2 flex items-center gap-2'>
                        {activeTab !== 'price' && (
                            <p
                                className='text-sm font-medium'
                                style={getStatusStyle(region, activeTab, true, selectedPriceType)}>
                                {getPercentageValue(region, activeTab)}
                            </p>
                        )}

                        {getStatusValue(region, activeTab, selectedPriceType) !== '' && (
                            <div
                                className='inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold'
                                style={getStatusStyle(region, activeTab, false, selectedPriceType)}>
                                {getStatusValue(region, activeTab, selectedPriceType)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
