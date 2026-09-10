import { authConfig } from '@/auth.config';
import { login as apiLogin, getMe } from '@/lib/api/resources/auth';
import { ApiError, apiErrorCode } from '@/lib/api/types';
import { type LoginStep, encodeLoginError } from '@/lib/login-error';

import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

class LoginFailed extends CredentialsSignin {
    constructor(step: LoginStep, error: unknown) {
        super();
        const payload = error instanceof ApiError ? (error.payload as { requestId?: unknown } | undefined) : undefined;
        this.code = encodeLoginError({
            step,
            message: error instanceof ApiError ? error.message : 'Sign-in failed. Please try again.',
            code: error instanceof ApiError ? apiErrorCode(error) : null,
            status: error instanceof ApiError ? error.status : null,
            requestId: typeof payload?.requestId === 'string' ? payload.requestId : null
        });
    }
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = String(credentials.email);
                const password = String(credentials.password);

                const devLoginEnabled = process.env.NEXT_PUBLIC_ALLOW_DEV_LOGIN === 'true';
                if (devLoginEnabled && email === 'SLRadmin' && password === 'SLRadmin') {
                    return {
                        id: 'dev-admin',
                        user_id: 'dev-admin',
                        name: 'SLR Admin',
                        email: 'admin@slr.dev',
                        role: 'ROLE_ADMIN',
                        tier: 'admin',
                        sub_tier: null,
                        state: '',
                        accessToken: 'dev-token',
                        refreshToken: null
                    };
                }

                let session: Awaited<ReturnType<typeof apiLogin>>;
                try {
                    session = await apiLogin(email, password);
                } catch (error) {
                    throw new LoginFailed('login', error);
                }

                // A valid password can still fail here if the profile lookup errors, so keep
                // the steps apart: the form must not blame the member's credentials for it.
                let me: Awaited<ReturnType<typeof getMe>>;
                try {
                    me = await getMe(session.access_token);
                } catch (error) {
                    throw new LoginFailed('profile', error);
                }

                return {
                    id: me.user_id,
                    user_id: me.user_id,
                    name: me.full_name,
                    email: me.email,
                    role: session.user.role,
                    tier: me.tier,
                    sub_tier: me.sub_tier ?? null,
                    state: me.state,

                    requiresPayment: me.requires_payment === true,
                    accessToken: session.access_token,
                    refreshToken: session.refresh_token ?? null
                };
            }
        })
    ],
    session: { strategy: 'jwt' }
});
