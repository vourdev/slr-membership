// Legacy base used by the older axios client (server-api / axios-client). New
// code should use `@/lib/api/*`. Kept in sync with the real API base URL.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.smartliferewards.com.au';

export const API_ENDPOINTS = {
    authLogin: '/api/v1/auth/login'
};
