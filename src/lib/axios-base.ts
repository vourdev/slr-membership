'use client';

import { API_BASE_URL } from '@/lib/api-endpoints';

import axios from 'axios';

export const apiBase = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
