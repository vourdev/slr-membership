/**
 * Carries the real reason a sign-in failed from `authorize()` to the login form.
 *
 * Auth.js only forwards a thrown CredentialsSignin's `code` to the client (it travels in the
 * callback URL's query string), so the detail is packed into that one string. Only what the
 * API already returns to its callers goes in — its user-facing message, error code and request
 * id — never the password or token.
 */

export type LoginStep = 'login' | 'profile';

export interface LoginErrorDetail {
    step: LoginStep;
    message: string;
    code: string | null;
    status: number | null;
    requestId: string | null;
}

const FALLBACK_MESSAGE = 'Sign-in failed. Please try again.';

export function encodeLoginError(detail: LoginErrorDetail): string {
    return JSON.stringify(detail);
}

export function decodeLoginError(raw: string | null | undefined): LoginErrorDetail {
    const fallback: LoginErrorDetail = {
        step: 'login',
        message: FALLBACK_MESSAGE,
        code: null,
        status: null,
        requestId: null
    };
    if (!raw) return fallback;

    try {
        const parsed = JSON.parse(raw) as Partial<LoginErrorDetail>;

        return {
            step: parsed.step === 'profile' ? 'profile' : 'login',
            message: typeof parsed.message === 'string' && parsed.message.trim() ? parsed.message : FALLBACK_MESSAGE,
            code: typeof parsed.code === 'string' ? parsed.code : null,
            status: typeof parsed.status === 'number' ? parsed.status : null,
            requestId: typeof parsed.requestId === 'string' ? parsed.requestId : null
        };
    } catch {
        // Auth.js's own codes (e.g. "credentials") are plain strings, not our JSON.
        return fallback;
    }
}

/** One line for the toast description, e.g. "Loading your profile · INTERNAL_ERROR · Ref 01a0…". */
export function describeLoginError(detail: LoginErrorDetail): string {
    const step = detail.step === 'profile' ? 'Loading your profile' : 'Checking your credentials';

    return [step, detail.code, detail.requestId ? `Ref ${detail.requestId}` : null].filter(Boolean).join(' · ');
}
