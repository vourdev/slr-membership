import { LOGIN_FALLBACK_MESSAGE, loginErrorMessage } from '@/lib/login-error';

import { describe, expect, it } from 'vitest';

describe('loginErrorMessage', () => {
    it('shows the message the API returned', () => {
        expect(loginErrorMessage('Something went wrong on our end. Please try again shortly.')).toBe(
            'Something went wrong on our end. Please try again shortly.'
        );
        expect(loginErrorMessage('The email or password you entered is incorrect.')).toBe(
            'The email or password you entered is incorrect.'
        );
    });

    it("falls back for Auth.js's own codes and empty values", () => {
        for (const code of ['credentials', 'CredentialsSignin', 'Configuration', '', '  ', null, undefined]) {
            expect(loginErrorMessage(code)).toBe(LOGIN_FALLBACK_MESSAGE);
        }
    });
});
