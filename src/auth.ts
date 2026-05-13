import { authConfig } from '@/auth.config';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-endpoints';

import axios from 'axios';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

type LoginResponse = {
    success: boolean;
    data?: {
        token: string;
        message?: string;
        user: { user_id: string; full_name: string; email: string };
        roles: { name: string }[];
    };
};

type UserDetailResponse = {
    success: boolean;
    data?: {
        region?: { region_id?: string | null };
    };
};

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                const forwarded = req.headers.get('x-forwarded-for');
                const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0] : '127.0.0.1';

                try {
                    const { data } = await axios.post<LoginResponse>(
                        `${API_BASE_URL}${API_ENDPOINTS.authLogin}`,
                        {
                            email: credentials.email,
                            password: credentials.password
                        },
                        {
                            headers: {
                                'X-Forwarded-For': clientIp,
                                'X-Real-IP': clientIp
                            }
                        }
                    );

                    if (!data.success || !data.data) return null;

                    const { user, token, roles } = data.data;

                    let region_id = '';
                    try {
                        const detail = await axios.get<UserDetailResponse>(
                            `${API_BASE_URL}/api/users/${user.user_id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'X-Forwarded-For': clientIp
                                }
                            }
                        );
                        region_id = detail.data?.data?.region?.region_id ?? '';
                    } catch {
                        region_id = '';
                    }

                    return {
                        id: user.user_id,
                        user_id: user.user_id,
                        name: user.full_name,
                        email: user.email,
                        role: roles?.[0]?.name ?? 'ROLE_USER',
                        accessToken: token,
                        region_id
                    };
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || 'Login failed';
                    throw new Error(errorMessage);
                }
            }
        })
    ],
    session: { strategy: 'jwt' }
});
