// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/sign-in'
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;

            const isDashboardRoute = pathname.startsWith('/dashboard');
            const isAuthPage = pathname.startsWith('/sign-in');

            if (!isLoggedIn && isDashboardRoute) {
                return Response.redirect(new URL('/sign-in', nextUrl));
            }

            if (isLoggedIn && isAuthPage) {
                return Response.redirect(new URL('/dashboard', nextUrl));
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
