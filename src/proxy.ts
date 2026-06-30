import { authConfig } from './auth.config';
import NextAuth from 'next-auth';

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ['/dashboard/:path*', '/member/:path*', '/sign-in']
};
