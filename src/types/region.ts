import { ProvinceType } from './neraca';

export const REGION_KEYS = [
    'Kabupaten Malinau',
    'Kabupaten Nunukan',
    'Kabupaten Bulungan',
    'Kabupaten Tana Tidung',
    'Kota Tarakan',
    'Prov Kaltara'
] as const;

export const provinces: ProvinceType[] = [
    'Provinsi Kalimantan Utara',
    'Kabupaten Bulungan',
    'Kabupaten Malinau',
    'Kabupaten Nunukan',
    'Kabupaten Tana Tidung',
    'Kota Tarakan'
];

export const REGION_DISPLAY_MAP = {
    malinau: 'Kabupaten Maliau',
    nunukan: 'Kabupaten Nunukan',
    bulungan: 'Kabupaten Bulungan',
    tarakan: 'Kota Tarakan',
    'tana-tidung': 'Kabupaten Tana Tidung'
};

export type RegionKey = keyof typeof REGION_DISPLAY_MAP;

export type RegionLayoutId = 'nunukan' | 'malinau' | 'tana_tidung' | 'tarakan' | 'bulungan' | 'prov_kaltara';

export interface RegionStatItem {
    region_id: string;
    region: Region;

    commodity_id: string;
    commodity: Commodity;

    year: number;
    month: number;

    price: string;
    prev_price: string;

    total_stock: string;
    prev_total_stock: string;

    total_demand: string;
    prev_total_demand: string;

    neraca: string;
    prev_neraca: string;

    neraca_percentage: string;
    prev_neraca_percentage: string;

    price_percentage: string;
    total_stock_percentage: string;
    total_demand_percentage: string;

    neraca_status: CategoryStatus;
    stock_status: CategoryStatus;
    demand_status: CategoryStatus;
    price_status: CategoryStatus;

    record_count: number;
}

export interface Region {
    region_id: string;
    code: string;
    name: string;
    type: 'regency' | 'city' | string;
    icon_url: string;

    is_active: boolean;

    created_by: string;
    updated_by: string | null;

    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    parent: string | null;
}

export interface Commodity {
    commodity_id: string;
    key_name: string;
    name: string;
    icon_url: string;
    unit: string;
    is_active: boolean;

    created_by: string;
    updated_by: string | null;

    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // price thresholds
    min_very_low_price: number;
    min_low_price: number;
    min_medium_price: number;
    min_high_price: number;
    min_very_high_price: number;

    max_very_low_price: number;
    max_low_price: number;
    max_medium_price: number;
    max_high_price: number;
    max_very_high_price: number;

    // labels
    very_low_status: string;
    low_status: string;
    medium_status: string;
    high_status: string;
    very_high_status: string;
}

export interface CategoryStatus {
    category_id: string;
    name: string; // "Aman", "Meningkat", dst
    type: 'neraca-status' | 'stock-status' | 'demand-status' | 'price-status' | string;
    key: string; // "aman", "menurun", "lebih_rendah", dst
    value: string; // "81% - 100%" atau "Menurun"

    metadata: StatusMetadata;

    is_active: boolean;

    created_by: string;
    updated_by: string | null;

    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface StatusMetadata {
    color: string;
}
