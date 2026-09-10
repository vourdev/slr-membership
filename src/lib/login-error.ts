/**
 * Carries the real reason a sign-in failed from `authorize()` to the login form.
 *
 * Auth.js only forwards a thrown CredentialsSignin's `code` to the client (it travels in the
 * callback URL's query string), so the API's user-facing message is sent as that code. Nothing
 * else goes in — no password or token.
 */

export const LOGIN_FALLBACK_MESSAGE = 'Sign-in failed. Please try again.';

/** Auth.js's own codes (e.g. "credentials") are not messages meant for members. */
const AUTHJS_CODES = new Set(['credentials', 'CredentialsSignin', 'Configuration']);

export function loginErrorMessage(code: string | null | undefined): string {
    const message = code?.trim();

    return message && !AUTHJS_CODES.has(message) ? message : LOGIN_FALLBACK_MESSAGE;
}
