'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface DateRangePickerProps {
    startDate?: string;
    endDate?: string;
    onRangeChange: (start?: string, end?: string) => void;
    placeholder?: string;
    className?: string;
}

export function DateRangePicker({
    startDate,
    endDate,
    onRangeChange,
    placeholder = 'Pilih Rentang Tanggal',
    className
}: DateRangePickerProps) {
    const selectedRange: DateRange | undefined = React.useMemo(() => {
        return {
            from: startDate ? new Date(startDate) : undefined,
            to: endDate ? new Date(endDate) : undefined
        };
    }, [startDate, endDate]);

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id='date'
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal xl:w-72',
                            !startDate && 'text-muted-foreground'
                        )}>
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        <span className='truncate'>
                            {startDate ? (
                                endDate ? (
                                    <>
                                        {format(new Date(startDate), 'dd LLL yyyy', { locale: id })} -{' '}
                                        {format(new Date(endDate), 'dd LLL yyyy', { locale: id })}
                                    </>
                                ) : (
                                    format(new Date(startDate), 'dd LLL yyyy', { locale: id })
                                )
                            ) : (
                                <span>{placeholder}</span>
                            )}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                        initialFocus
                        mode='range'
                        defaultMonth={selectedRange?.from}
                        selected={selectedRange}
                        onSelect={(range) => {
                            onRangeChange(
                                range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
                                range?.to ? format(range.to, 'yyyy-MM-dd') : undefined
                            );
                        }}
                        numberOfMonths={2}
                    />
                    <div className='flex items-center justify-end border-t p-2'>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 text-xs text-red-500 hover:text-red-600'
                            onClick={() => onRangeChange(undefined, undefined)}>
                            <X className='mr-1 h-3 w-3' />
                            Hapus Filter
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
