// lib/server-api.ts
'use server';

import { redirect } from 'next/navigation';

import { auth, signOut } from '@/auth';
import { API_BASE_URL } from '@/lib/api-endpoints';

import axios, { AxiosError } from 'axios';

export async function getServerApi() {
    const session = await auth();
    const accessToken = (session?.user as any)?.accessToken as string | undefined;

    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        }
    });

    api.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
            const status = error.response?.status;
            const errorCode = error.code;

            const isAuthError = status === 401 || (status === 403 && error.response?.statusText === 'Forbidden');

            const isConnectionError = errorCode === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED');

            if (isAuthError || isConnectionError) {
                redirect('/api/auth/logout');
            }

            return Promise.reject(error);
        }
    );

    return api;
}
