'use client';

import { useEffect, useState } from 'react';

import { apiBase } from '@/lib/axios-base';

export interface CommoditiesItem {
    key: string;
    value: string;
    label: string;
    commodity_id: string;
    key_name: string;
    name: string;
    icon_url: string;
}

export function useCategoriesDropdown() {
    const [commodities, setCommodities] = useState<CommoditiesItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiBase.get<{ data: CommoditiesItem[] }>('/api/commodities', {
                    params: {
                        page: 1,
                        limit: 50,
                        search: undefined,
                        sort: 'created_at',
                        order: 'desc'
                    }
                });

                setCommodities(res.data.data || []);
            } catch (err) {
                setError('Gagal memuat Categories');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { commodities, loading, error };
}
