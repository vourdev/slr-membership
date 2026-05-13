import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export const fillToBg = (fillClass: string) => fillClass.replace('fill-', 'bg-');

export const formatNumber = (num: number | string) => num?.toLocaleString('id-ID', { maximumFractionDigits: 0 });

export const formatRupiah = (value: string | number): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue) || numericValue === null || numericValue === undefined) {
        return 'Rp0,00';
    }

    return numericValue.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
};

export function formatDate(date: Date | undefined) {
    if (!date) {
        return '';
    }

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

export function isValidDate(date: Date | undefined) {
    if (!date) {
        return false;
    }

    return !isNaN(date.getTime());
}

export function createKeyName(name: string) {
    if (!name) return '';

    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

export const normalizeKey = (value?: string) =>
    (value ?? '').trim().toLowerCase().replace(/\s+/g, '_').replace(/-+/g, '_');

export const separatorNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const normalizeRegionKey = (value: string) => {
    return value.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-').trim();
};

export const toNumber = (v?: string) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

export function formatNumericColumn(ws: XLSX.WorkSheet, columnIndex: number) {
    if (!ws['!ref']) return;

    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let r = range.s.r + 1; r <= range.e.r; r++) {
        const addr = XLSX.utils.encode_cell({ r, c: columnIndex });
        const cell = ws[addr];
        if (cell && typeof cell.v === 'number') {
            cell.t = 'n';
            cell.z = '#,##0.00';
        }
    }
}

export const formatDateIndonesian = (dateString: string, formatType: 'full' | 'short' | 'date' = 'date') => {
    const date = new Date(dateString);

    switch (formatType) {
        case 'full':
            return format(date, 'EEEE, dd MMMM yyyy', { locale: id });
        case 'short':
            return format(date, 'dd MMM yyyy', { locale: id });
        case 'date':
        default:
            return format(date, 'dd MMMM yyyy', { locale: id });
    }
};

export const formatPriceDifference = (current: number, previous: number) => {
    const difference = current - previous;

    if (difference === 0) return '± Rp 0';

    const sign = difference > 0 ? '+' : '-';
    const formattedValue = formatNumber(Math.abs(difference));

    return `${sign} Rp ${formattedValue}`;
};

export function pad2(n: number) {
    return n < 10 ? '0' + n : String(n);
}

export function formatPriceComparison(
    current: number,
    previous: number,
    format: 'amount' | 'percentage' | 'both' = 'amount'
): string {
    if (previous === 0) {
        switch (format) {
            case 'percentage':
                return current > 0 ? '' : '0%';
            case 'amount':
                return current > 0 ? `+ Rp ${formatNumber(current)}` : '± Rp 0';
            case 'both':
                const amount = current > 0 ? `+ Rp ${formatNumber(current)}` : '± Rp 0';
                return `${amount} (+∞%)`;
        }
    }

    const difference = current - previous;
    const percentage = (difference / previous) * 100;

    const formattedAmount =
        difference === 0 ? '± Rp 0' : `${difference > 0 ? '+' : '-'} Rp ${formatNumber(Math.abs(difference))}`;

    const formattedPercentage = percentage === 0 ? '±0%' : `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;

    switch (format) {
        case 'amount':
            return formattedAmount;
        case 'percentage':
            return formattedPercentage;
        case 'both':
            return `${formattedAmount} (${formattedPercentage})`;
    }
}
