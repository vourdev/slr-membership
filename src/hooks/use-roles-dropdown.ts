'use client';

import { useEffect, useState } from 'react';

import { apiClient } from '@/lib/axios-client';

export interface RoleItem {
    key: string;
    value: string;
    label: string;
}
type AuthHeaders = {
    'Content-Type'?: string;
    Authorization?: string;
};

export function useRolesDropdown({ headers }: { headers: AuthHeaders }) {
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await apiClient.get<{ data: RoleItem[] }>('/api/roles/dropdown', { headers });

                setRoles(res.data.data || []);
            } catch (err) {
                setError('Gagal memuat role');
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return { roles, loading, error };
}
