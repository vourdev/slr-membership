export type LevelHargaStatus = 'Aman' | 'Rentan' | 'Waspada' | 'Defisit' | 'NoData';

export type MovementStatus = 'Menurun' | 'Stabil' | 'Meningkat' | 'NoData';

export interface RegionStat {
    region: {
        code: string;
        name: string;
        icon_url: string;
    };
    commodity: {
        key_name: string;
        name: string;
        unit: string;
    };
    region_id: string;
    avg_price: number;
    prev_price: number;
    prev_year_price: number;
    prev_year_avg_price: number;
    min_price: number;
    max_price: number;
    compare_price: number;
    compare_price_percentage: number;
    price_percentage: string;
    avg_price_percentage: string;
    commodity_price_status: StatusMeta;
    very_low_status: string;
    low_status: string;
    medium_status: string;
    high_status: string;
    very_high_status: string;
    year: number;
    month: number;
    price: number;
    total_stock: number;
    total_demand: number;
    neraca: number;
    neraca_percentage: number;
    total_stock_percentage: number;
    total_demand_percentage: number;

    neraca_status: StatusMeta;
    stock_status: StatusMeta;
    demand_status: StatusMeta;
    price_status: StatusMeta;
}

export interface StatusMeta {
    key: string;
    name: string;
    status?: string;
    color?: string;
    metadata: {
        color: string;
    };
}
