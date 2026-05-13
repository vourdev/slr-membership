// app/dashboard/users/[userId]/page.tsx
import { auth } from '@/auth';
import { getServerApi } from '@/lib/server-api';

import UserForm from '../_components/user-form';

type UsersDetailPageProps = {
    params: Promise<{
        userId: string;
    }>;
};
type ApiRole = {
    role_id: string;
    name: string;
    is_active: boolean;
    region_id: string;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
};

type ApiUserDetail = {
    user_id: string;
    full_name: string;
    region_id: string;
    email: string;
    roles: ApiRole[];
    is_active: boolean;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
};

type UserDetailResponse = {
    success: boolean;
    status: number;
    message: string;
    data: ApiUserDetail;
    timestamp: string;
};

const UsersDetailPage = async ({ params }: UsersDetailPageProps) => {
    const { userId } = await params;
    const session: any = await auth();
    const accessToken = (session?.user as any)?.accessToken as string | undefined;
    const targetRole = session?.user?.role;
    const api = await getServerApi();

    const dataRegion = await api.get(`/api/users/${session.user.user_id}`);
    const codeRegion = dataRegion.data.data.region?.region_id ?? '';
    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    };

    if (userId === 'new') {
        return (
            <div className='flex flex-col'>
                <div className='flex-1 space-y-4 px-4 py-8 pt-6'>
                    <UserForm codeRegion={codeRegion} role={targetRole} initialData={null} headers={headers} />
                </div>
            </div>
        );
    }

    const { data } = await api.get<UserDetailResponse>(`/api/users/${userId}`);
    const u = data.data;

    const user = {
        id: u.user_id,
        full_name: u.full_name,
        email: u.email,
        role_id: u.roles?.length > 0 ? u.roles[0].role_id : 'a87bf382-0c2e-4431-8b9a-e06a98faabd1',
        is_active: u.is_active,
        region_id: u.region_id ?? '',
        created_at: u.created_at,
        updated_at: u.updated_at
    };

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 px-4 py-8 pt-6'>
                <UserForm codeRegion={codeRegion} initialData={user} headers={headers} role={targetRole} />
            </div>
        </div>
    );
};

export default UsersDetailPage;
