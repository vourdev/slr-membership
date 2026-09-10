import { decodeLoginError, describeLoginError, encodeLoginError } from '@/lib/login-error';

import { describe, expect, it } from 'vitest';

describe('login error round-trip', () => {
    it('carries the API message, code, step and request id to the form', () => {
        const raw = encodeLoginError({
            step: 'profile',
            message: 'Something went wrong on our end. Please try again shortly.',
            code: 'INTERNAL_ERROR',
            status: 500,
            requestId: '01a08a1b-6f2f-72eb-8d93-66d47f5ee8a3'
        });
        const detail = decodeLoginError(raw);

        expect(detail.message).toBe('Something went wrong on our end. Please try again shortly.');
        expect(describeLoginError(detail)).toBe(
            'Loading your profile · INTERNAL_ERROR · Ref 01a08a1b-6f2f-72eb-8d93-66d47f5ee8a3'
        );
    });

    it('describes a wrong password as a credentials failure', () => {
        const detail = decodeLoginError(
            encodeLoginError({
                step: 'login',
                message: 'The email or password you entered is incorrect.',
                code: 'INVALID_CREDENTIALS',
                status: 401,
                requestId: null
            })
        );

        expect(describeLoginError(detail)).toBe('Checking your credentials · INVALID_CREDENTIALS');
    });

    it("falls back for Auth.js's own plain codes and missing values", () => {
        for (const raw of ['credentials', '', null, undefined, '{"message":""}']) {
            expect(decodeLoginError(raw).message).toBe('Sign-in failed. Please try again.');
        }
    });
});
