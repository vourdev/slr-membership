import { RegionLayoutId } from './region';

export type NeracaTabType = 'neraca' | 'ketersediaan' | 'kebutuhan';
export type NeracaDateType = '3m' | '6m' | 'year';

export type ProvinceType = string;
export type PeriodType = '3 Bulan' | '6 Bulan' | '1 Tahun';

export interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        color: string;
        name: string;
        value: number;
        payload: ChartDataPoint;
    }>;
}

export interface ActiveLines {
    neraca: boolean;
    ketersediaan: boolean;
    kebutuhan: boolean;
}

export interface CommodityBaseValue {
    neraca: number;
    ketersediaan: number;
    kebutuhan: number;
    trend: number;
    volatility: number;
}

export interface ProvinceData {
    base: number;
    kebutuhanFactor: number;
}

export interface ChartDataPoint {
    periode: string;
    neraca: number;
    ketersediaan: number;
    kebutuhan: number;
}

export interface TableDataPoint extends ChartDataPoint {
    status: string; // 'Surplus' | 'Defisit' | 'Seimbang'
}

export type RegionValue = {
    id: RegionLayoutId;
    name: string;
    icon: string;
    ton: number;
    status: string;
    value?: string;
};

export type RegionGroup = {
    commodityId: string;
    infoTypeId: 'neraca' | 'ketersediaan';
    monthId: string;
    values: RegionValue[];
};

export type RegionVisual = {
    fill: string;
    statusColor: string;
    valueColor?: string;
};

export type RegionVisualConfig = {
    [commodityId: string]: {
        [timeBase: string]: {
            neraca: Record<RegionLayoutId, RegionVisual>;
            ketersediaan: Record<RegionLayoutId, RegionVisual>;
            kebutuhan?: Record<RegionLayoutId, RegionVisual>;
            legend?: any;
        };
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
