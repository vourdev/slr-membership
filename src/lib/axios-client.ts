// lib/axios-client.ts
'use client';

import { API_BASE_URL } from '@/lib/api-endpoints';

import axios from 'axios';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            toast.error('Sesi login sudah berakhir, silakan login ulang');
            signOut({ redirectTo: '/sign-in' });

            return;
        }

        return Promise.reject(error);
    }
);
