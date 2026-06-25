'use client';

import { useTransition } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { apiClient } from '@/lib/axios-client';
import { AuthHeaders } from '@/types/auth-header';

import { usersColumns } from './_components/columns';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

type UserRow = {
    id: string;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
};

type UsersClientProps = {
    data: UserRow[];
    page: number;
    limit: number;
    total: number;
    search: string;
    sort: string;
    order: 'asc' | 'desc';
    headers: AuthHeaders;
};

type ApiUser = {
    user_id: string;
    full_name: string;
    email: string;
    is_active: boolean;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
};

type UsersApiResponse = {
    success: boolean;
    status: number;
    message: string;
    data: ApiUser[];
    timestamp: string;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
};

export function UsersClient({ data, page, limit, total, search, headers }: UsersClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleEdit = (row: UserRow) => {
        router.push(`/dashboard/users/${row.id}`);
    };

    const onDelete = async (row: UserRow) => {
        if (!headers?.Authorization) {
            toast.error('Sesi login tidak tersedia, silakan login ulang');
            router.push('/sign-in');

            return;
        }

        try {
            const res = await apiClient.delete<UsersApiResponse>(`/api/users/${row.id}`, {
                headers
            });

            if (res.data?.success) {
                toast.success(res.data.message || 'User deleted');
                router.push('/dashboard/users');
                router.refresh();
            } else {
                toast.error(res.data?.message ?? 'Make sure this user is not used in other data');
            }
        } catch (error) {
            console.error(error);
            toast.error('Make sure this user is not used in other data');
        }
    };

    const updateQuery = (params: Record<string, string | number | undefined>) => {
        const sp = new URLSearchParams(searchParams.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === '') {
                sp.delete(key);
            } else {
                sp.set(key, String(value));
            }
        });

        startTransition(() => {
            router.push(`/dashboard/users?${sp.toString()}`);
        });
    };

    const handlePageChange = (newPage: number) => {
        updateQuery({ page: newPage });
    };

    const handleSearchChange = (value: string) => {
        updateQuery({ search: value, page: 1 });
    };

    return (
        <div className='flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4'>
            <div className='flex items-center justify-between'>
                <Heading title='Users' description='Manage Users' />
                <Button onClick={() => router.push(`/dashboard/users/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>

            <DataTable
                searchKey='nama'
                columns={usersColumns}
                data={data}
                // mode server-side
                serverSide
                currentPage={page}
                totalItems={total}
                itemsPerPage={limit}
                searchValue={search}
                isLoading={isPending}
                onPageChange={handlePageChange}
                onSearchChange={handleSearchChange}
                onEdit={handleEdit}
                onDelete={(row) => {
                    onDelete(row);
                }}
            />
        </div>
    );
}
