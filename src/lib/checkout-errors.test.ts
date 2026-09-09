import { ApiError } from '@/lib/api/types';
import { isTrialWindowError } from '@/lib/checkout-errors';

import { describe, expect, it } from 'vitest';

const apiError = (message: string) => new ApiError(400, message, { code: 'BAD_REQUEST' });

describe('isTrialWindowError', () => {
    it('matches the message Stripe returns through the API', () => {
        expect(isTrialWindowError(apiError('The `trial_end` date has to be at least 2 days in the future.'))).toBe(
            true
        );
    });

    it('matches regardless of casing or backticks', () => {
        expect(isTrialWindowError(apiError('Invalid TRIAL_END supplied'))).toBe(true);
    });

    it('ignores unrelated API errors', () => {
        expect(isTrialWindowError(apiError('No such customer: cus_seeded_red_123'))).toBe(false);
        expect(isTrialWindowError(apiError('Sign-ups are paused during safe hours.'))).toBe(false);
    });

    it('ignores non-API errors', () => {
        expect(isTrialWindowError(new Error('trial_end'))).toBe(false);
        expect(isTrialWindowError(null)).toBe(false);
        expect(isTrialWindowError(undefined)).toBe(false);
    });
});
