export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.smartliferewards.com.au';

// Central endpoint map. Add a namespace per domain as modules are integrated.
export const API = {
    auth: {
        login: '/api/v1/auth/login',
        me: '/api/v1/auth/me',
        refresh: '/api/v1/auth/refresh',
        logout: '/api/v1/auth/logout',
        register: '/api/v1/auth/register',
        verifyOtp: '/api/v1/auth/verify-otp',
        resendOtp: '/api/v1/auth/resend-otp',
        forgotPassword: '/api/v1/auth/forgot-password',
        resetPassword: '/api/v1/auth/reset-password'
    },
    memberships: {
        tiers: '/api/v1/memberships/tiers',
        me: '/api/v1/memberships/me',
        changeTier: '/api/v1/memberships/change-tier'
    },
    admin: {
        members: '/api/v1/admin/members',
        dashboard: '/api/v1/admin/dashboard',
        memberDetail: (userId: string) => `/api/v1/admin/members/${userId}`,
        deleteMember: (userId: string) => `/api/v1/admin/members/${userId}`,
        updateMemberStatus: (userId: string) => `/api/v1/admin/members/${userId}/status`
    },
    discounts: {
        list: '/api/v1/discounts/',
        create: '/api/v1/discounts/',
        remove: (id: string) => `/api/v1/discounts/${id}`
    },
    ebooks: {
        list: '/api/v1/ebooks/',
        create: '/api/v1/ebooks/',
        update: (id: string) => `/api/v1/ebooks/${id}`,
        remove: (id: string) => `/api/v1/ebooks/${id}`
    },
    giveaways: {
        winners: '/api/v1/giveaways/winners'
    },
    entries: {
        history: '/api/v1/entries/'
    },
    notifications: {
        list: '/api/v1/notifications/',
        read: (id: string) => `/api/v1/notifications/${id}/read`
    }
} as const;
