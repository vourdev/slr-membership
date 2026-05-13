'use client';

import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/axios-client';
import { AuthHeaders } from '@/types/auth-header';

export interface CommoditiesItem {
    key: string;
    value: string;
    label: string;
}

export function useCommoditiesDropdown({ headers }: { headers?: AuthHeaders }) {
    const [commodities, setCommodities] = useState<CommoditiesItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommodities = async () => {
            try {
                const res = await apiClient.get<{ data: CommoditiesItem[] }>('/api/commodities/dropdown', {
                    headers
                });

                setCommodities(res.data.data || []);
            } catch (err) {
                setError('Gagal memuat Commodities');
            } finally {
                setLoading(false);
            }
        };

        fetchCommodities();
    }, []);

    return { commodities, loading, error };
}
