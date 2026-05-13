import React, { useId } from 'react';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { API_BASE_URL } from '@/lib/api-endpoints';
import { formatNumber } from '@/lib/utils';

import { Loader2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PriceCardProps {
    groupData: any;
    filterType: 'komoditas' | 'daerah';
    isLoading?: boolean;
}

export const PriceCard: React.FC<PriceCardProps> = ({ groupData, filterType, isLoading }) => {
    const gradientId = useId();

    if (isLoading) {
        return (
            <Card className='flex h-100 w-full items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
            </Card>
        );
    }

    const dailyData = groupData?.daily_data || [];
    if (dailyData.length === 0) return null;

    const latestData = dailyData[dailyData.length - 1];
    const title = filterType !== 'komoditas' ? groupData?.commodity?.name : groupData?.region?.name;
    const icon = filterType !== 'komoditas' ? groupData?.commodity?.icon_url : groupData?.region?.icon_url;

    const currentPrice = latestData?.price || 0;
    const prevPrice = latestData?.prev_price || 0;
    const priceDiff = currentPrice - prevPrice;

    const chartData = dailyData.map((item: any) => ({
        ...item,
        xValue: item.price_date
    }));

    const prices = chartData.map((d: any) => formatNumber(d.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const yAxisFormatter = (value: number) => {
        return `${(value / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}k`;
    };

    return (
        <Card className='w-full overflow-hidden border shadow-sm'>
            <CardHeader className='pb-2'>
                <div className='flex items-center gap-3'>
                    <div className='relative h-10 w-10 shrink-0 rounded-md border bg-slate-50 p-1'>
                        <Image
                            src={`${API_BASE_URL}/${icon}`}
                            alt={title || 'icon'}
                            fill
                            sizes='20'
                            className='object-contain'
                        />
                    </div>
                    <div className='flex-1'>
                        <CardTitle className='text-xs font-bold tracking-tight text-slate-500 uppercase'>
                            {title}
                        </CardTitle>
                        <div className='flex items-center gap-2'>
                            <span className='text-xl font-bold'>Rp {formatNumber(currentPrice)}</span>
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                    priceDiff >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {priceDiff >= 0 ? '+' : '-'} Rp {formatNumber(Math.abs(priceDiff))}{' '}
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className='px-1 pb-4'>
                <div className='h-62.5 w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.15} />
                                    <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />

                            <XAxis
                                dataKey='xValue'
                                interval={0}
                                tick={(props) => {
                                    const { x, y, payload } = props;
                                    return (
                                        <g transform={`translate(${x},${y})`}>
                                            <text
                                                x={0}
                                                y={0}
                                                dy={10}
                                                textAnchor='end'
                                                fill='#64748b'
                                                fontSize={10}
                                                transform='rotate(-35)'>
                                                {payload.value}
                                            </text>
                                        </g>
                                    );
                                }}
                                axisLine={false}
                                tickLine={false}
                                height={50}
                            />
                            <YAxis
                                tickFormatter={yAxisFormatter}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                domain={[Math.floor(minPrice * 0.9), Math.ceil(maxPrice * 1.1)]}
                            />

                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className='rounded-md border bg-white p-2 text-[11px] shadow-xl'>
                                                <p className='font-mono text-slate-400'>
                                                    {payload[0].payload.price_date}
                                                </p>
                                                <p className='text-sm font-bold text-blue-600'>
                                                    Rp {formatNumber(payload[0].value)}
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            <Area
                                type='monotone'
                                dataKey='price'
                                stroke='#3b82f6'
                                strokeWidth={2}
                                fill={`url(#${gradientId})`}
                                name='Stock'
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
