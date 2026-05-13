import { RegionLayoutId } from './region';

// ========== TYPES & INTERFACES ==========

export type PriceChangeType = 'price' | 'price-change';

export type PriceType = 'level-harga' | 'kaltara' | 'mtm' | 'yoy' | 'ytd';

export interface PriceDataPoint {
    date: string;
    price: number;
}

export interface KomoditasItem {
    kabupaten: string;
    currentPrice: number;
    change: number;
    icon: string;
    data: PriceDataPoint[];
}

export interface DaerahItem {
    komoditas: string;
    currentPrice: number;
    change: number;
    icon: string;
    data: PriceDataPoint[];
}

export interface KomoditasData {
    beras: KomoditasItem[];
    gula: KomoditasItem[];
    bawang: KomoditasItem[];
    'cabai-merah'?: KomoditasItem[];
    'cabai-rawit'?: KomoditasItem[];
    'bawang-merah'?: KomoditasItem[];
    'bawang-putih'?: KomoditasItem[];
    'daging-sapi'?: KomoditasItem[];
    'daging-ayam'?: KomoditasItem[];
    'telur-ayam'?: KomoditasItem[];
    'gula-pasir'?: KomoditasItem[];
    'minyak-goreng'?: KomoditasItem[];
    jagung?: KomoditasItem[];
    kedelai?: KomoditasItem[];
}

export interface DaerahData {
    [kabupaten: string]: DaerahItem[];
}

export interface DropdownOption {
    value: string;
    label: string;
}

export type FilterType = 'komoditas' | 'daerah';

export type KomoditasKey = keyof KomoditasData;

export interface PriceCardProps {
    title: string;
    currentPrice: number;
    change: number;
    icon: string;
    data: PriceDataPoint[];
}

export interface TooltipPayload {
    value: number;
    dataKey: string;
}

export interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

export type PriceTypeRegionValue = {
    id: RegionLayoutId;
    name: string;
    icon: string;
    price: string;
    percentage: string;
    status: string;
    value?: string;
};

export type PriceTypeRegionGroup = {
    commodityId: string;
    infoPriceTypeId: PriceType;
    monthId: string;
    values: PriceTypeRegionValue[];
};

export type PriceTypeRegionVisual = {
    fill: string; // warna map (SVG)
    statusColor: string; // badge bg+text
    valueColor?: string; // teks persen (khusus ketersediaan)
};

export type PriceTypeRegionVisualConfig = {
    [commodityId: string]: {
        'level-harga': Record<RegionLayoutId, PriceTypeRegionVisual>;
        kaltara: Record<RegionLayoutId, PriceTypeRegionVisual>;
        mtm?: Record<RegionLayoutId, PriceTypeRegionVisual>;
        legend?: any;
    };
};

export type LegendItem = {
    key: string; // 'defisit' | 'rentan' | ...
    label: string; // teks yang tampil di legend
    bgClass: string; // bg-red-400, bg-emerald-400, dst
    valueRange?: string; // khusus neraca / ketersediaan bila perlu (misal '0% - 46%' atau '> 0%')
};

export type RegionLegend = {
    neraca: LegendItem[];
    ketersediaan: LegendItem[];
};
