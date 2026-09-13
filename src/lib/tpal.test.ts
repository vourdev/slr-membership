import { isTpalEligible } from '@/lib/tpal';

import { describe, expect, it } from 'vitest';

describe('isTpalEligible', () => {
    it('is eligible with draw passes left and active billing', () => {
        expect(isTpalEligible(4, 'active')).toBe(true);
        expect(isTpalEligible('4', 'ACTIVE')).toBe(true);
        expect(isTpalEligible(-1, 'active')).toBe(true);
    });

    it('is not eligible once billing stops, even with draw passes left', () => {
        // TPAL-01: subscription cancelled, billing inactive, draw_pass still 4.
        expect(isTpalEligible(4, 'inactive')).toBe(false);
        expect(isTpalEligible(4, 'grace')).toBe(false);
        expect(isTpalEligible(4, null)).toBe(false);
    });

    it('is not eligible without draw passes', () => {
        expect(isTpalEligible(0, 'active')).toBe(false);
        expect(isTpalEligible('-', 'active')).toBe(false);
        expect(isTpalEligible(null, 'active')).toBe(false);
    });
});
