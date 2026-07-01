// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    trustHost: true,
    pages: {
        signIn: '/sign-in'
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;

            // Both the admin dashboard and the member area require a session.
            const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/member');
            const isAuthPage = pathname.startsWith('/sign-in');

            if (!isLoggedIn && isProtectedRoute) {
                return Response.redirect(new URL('/sign-in', nextUrl));
            }

            if (isLoggedIn && isAuthPage) {
                // Land staff on the admin dashboard, members on the member area.
                const role = (auth!.user as { role?: string }).role ?? '';
                const isStaff = /ADMIN|SPV/.test(role);

                return Response.redirect(new URL(isStaff ? '/dashboard' : '/member', nextUrl));
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).accessToken;
                token.role = (user as any).role;
                token.user_id = (user as any).user_id;
                token.region_id = (user as any).region_id;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).accessToken = token.accessToken;
                (session.user as any).role = token.role;
                (session.user as any).user_id = token.user_id;
                (session.user as any).region_id = token.region_id;
            }

            return session;
        }
    },
    providers: []
} satisfies NextAuthConfig;
