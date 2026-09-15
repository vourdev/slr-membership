import { isVisitorTier, tierGroupOf } from '@/lib/member';

import { describe, expect, it } from 'vitest';

describe('isVisitorTier', () => {
    it('recognises an explicit Visitor from the API, on either field', () => {
        expect(isVisitorTier('visitor', 'visitor')).toBe(true);
        expect(isVisitorTier('VISITOR', null)).toBe(true);
        expect(isVisitorTier(null, ' visitor ')).toBe(true);
    });

    it('does not treat paid members as Visitor', () => {
        expect(isVisitorTier('red', 'r4')).toBe(false);
        expect(isVisitorTier('blue', 'b10')).toBe(false);
    });

    it('does not lock anyone out when the tier is missing', () => {
        expect(isVisitorTier(null, null)).toBe(false);
        expect(isVisitorTier(undefined, undefined)).toBe(false);
        expect(isVisitorTier('', '')).toBe(false);
    });
});

describe('tierGroupOf', () => {
    it('keeps Visitor as its own group instead of reading it as RED', () => {
        expect(tierGroupOf('VISITOR')).toBe('visitor');
    });

    it('maps paid sub-tiers to their group', () => {
        expect(tierGroupOf('R4')).toBe('red');
        expect(tierGroupOf('B10')).toBe('blue');
    });
});
