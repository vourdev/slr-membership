import { auth } from '@/auth';
import { getServerApi } from '@/lib/server-api';

import { UsersClient } from './users-client';

type UsersPageSearchParams = {
    page?: string;
    limit?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
};

type UsersPageProps = {
    searchParams: Promise<UsersPageSearchParams>;
};

type ApiRole = {
    role_id: string;
    name: string;
    is_active: boolean;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
};

type ApiRegion = {
    region_id: string;
    name: string;
    code: string;
    is_active: boolean;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
};

type ApiUser = {
    user_id: string;
    full_name: string;
    email: string;
    roles: ApiRole[];
    region: ApiRegion;
    is_active: boolean;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
};

export type UsersApiResponse = {
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

export default async function UsersPage({ searchParams }: UsersPageProps) {
    const sp = await searchParams;
    const session: any = await auth();
    const accessToken = (session?.user as any)?.accessToken as string | undefined;

    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    };

    const page = Number(sp.page ?? 1);
    const limit = Number(sp.limit ?? 10);
    const search = sp.search ?? '';
    const sort = sp.sort ?? 'created_at';
    const order = (sp.order as 'asc' | 'desc') ?? 'desc';

    const api = await getServerApi();

    const codeRegion = session?.user.region_id ?? '';

    const { data } = await api.get<UsersApiResponse>('/api/users', {
        params: {
            page,
            limit,
            search: search || undefined,
            sort,
            order
        }
    });

    const targetRole = session?.user?.role;

    const rows = data.data
        .filter((u) => {
            if (targetRole === 'ROLE_SUPER_ADMIN') {
                return true;
            }

            const currentUserRole = u.roles[0]?.name;
            const currentUserRegion = u.region?.region_id;

            if (targetRole === 'ROLE_SPV') {
                return (
                    currentUserRole === 'ROLE_USER' ||
                    (currentUserRole === 'ROLE_SPV' && currentUserRegion === codeRegion)
                );
            }

            return currentUserRole === targetRole && currentUserRegion === codeRegion;
        })
        .map((u) => ({
            id: u.user_id,
            name: u.full_name,
            email: u.email,
            region: u.region?.name ?? '-',
            roles: u.roles[0]?.name,
            is_active: u.is_active,
            created_at: u.created_at
        }));

    return (
        <UsersClient
            data={rows}
            headers={headers}
            page={data.pagination.page}
            limit={data.pagination.limit}
            total={data.pagination.total}
            search={search}
            sort={sort}
            order={order}
        />
    );
}
