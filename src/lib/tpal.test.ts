import { isTpalEligible, tpalExclusionReason } from '@/lib/tpal';

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

describe('tpalExclusionReason', () => {
    it('says nothing for an eligible member', () => {
        expect(tpalExclusionReason(4, 'active')).toBeNull();
        expect(tpalExclusionReason(-1, 'active')).toBeNull();
    });

    it('names the billing status when that is the blocker', () => {
        // TPAL-05: Stripe says active, the API still reports inactive.
        expect(tpalExclusionReason(4, 'inactive')).toBe('Billing is "inactive" — only active billing is exported.');
        expect(tpalExclusionReason(4, null)).toBe('Billing is "unknown" — only active billing is exported.');
    });

    it('points at the entries when billing is fine', () => {
        // TPAL-04: billing active, draw_pass sitting at 0.
        expect(tpalExclusionReason(0, 'active')).toBe('Billing is active, but no entries are left this cycle.');
    });

    it('reports both when both are wrong', () => {
        expect(tpalExclusionReason(0, 'inactive')).toBe('Billing is not active, and no entries are left this cycle.');
    });

    it('stays silent when draw_pass is unknown, matching the "-" cell', () => {
        expect(tpalExclusionReason('-', 'active')).toBeNull();
        expect(tpalExclusionReason(null, 'inactive')).toBeNull();
    });
});
