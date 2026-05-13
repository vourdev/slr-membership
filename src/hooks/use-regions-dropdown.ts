'use client';

import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/axios-client';

export interface RegionItem {
    key: string;
    value: string;
    label: string;
}

type AuthHeaders = {
    'Content-Type'?: string;
    Authorization?: string;
};

export function useRegionsDropdown({ headers }: { headers?: AuthHeaders }) {
    const [regions, setRegions] = useState<RegionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const res = await apiClient.get<{ data: RegionItem[] }>('/api/regions/dropdown', {
                    headers
                });

                setRegions(res.data.data || []);
            } catch (err) {
                setError('Gagal memuat region');
            } finally {
                setLoading(false);
            }
        };

        fetchRegions();
    }, []);

    return { regions, loading, error };
}
