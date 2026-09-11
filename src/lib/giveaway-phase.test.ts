import { giveawayPhase } from '@/lib/api/resources/giveaways';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Freeze time so clock-based branches are deterministic
const NOW = new Date('2025-07-15T12:00:00Z').getTime();

beforeEach(() => vi.useFakeTimers({ now: NOW }));
afterEach(() => vi.useRealTimers());

describe('giveawayPhase', () => {
    // ── Clock-based logic (original behaviour) ────────────────────────

    it('returns "drawn" when draws_at is in the past', () => {
        expect(giveawayPhase(null, '2025-07-10T00:00:00Z')).toBe('drawn');
    });

    it('returns "upcoming" when opens_at is in the future', () => {
        expect(giveawayPhase('2025-08-01T00:00:00Z', '2025-09-01T00:00:00Z')).toBe('upcoming');
    });

    it('returns "active" when open and not yet drawn', () => {
        expect(giveawayPhase('2025-07-01T00:00:00Z', '2025-08-01T00:00:00Z')).toBe('active');
    });

    it('returns "active" when both dates are null', () => {
        expect(giveawayPhase(null, null)).toBe('active');
    });

    // ── Status-based overrides (DRAW-04) ──────────────────────────────

    it.each(['DRAWN', 'COMPLETED', 'CLOSED', 'drawn', 'Completed'])(
        'returns "drawn" for status "%s" even when draws_at is in the future',
        (status) => {
            expect(giveawayPhase('2025-07-01T00:00:00Z', '2025-08-01T00:00:00Z', status)).toBe('drawn');
        }
    );

    it('ignores empty-string status', () => {
        expect(giveawayPhase('2025-07-01T00:00:00Z', '2025-08-01T00:00:00Z', '')).toBe('active');
    });

    it('ignores null / undefined status', () => {
        expect(giveawayPhase('2025-07-01T00:00:00Z', '2025-08-01T00:00:00Z', null)).toBe('active');
        expect(giveawayPhase('2025-07-01T00:00:00Z', '2025-08-01T00:00:00Z', undefined)).toBe('active');
    });

    // ── hasWinner override (DRAW-03/05) ───────────────────────────────

    it('returns "drawn" when hasWinner is true, regardless of dates', () => {
        expect(giveawayPhase('2025-07-01T00:00:00Z', '2025-08-01T00:00:00Z', null, true)).toBe('drawn');
    });

    it('returns "active" when hasWinner is false and dates say active', () => {
        expect(giveawayPhase('2025-07-01T00:00:00Z', '2025-08-01T00:00:00Z', null, false)).toBe('active');
    });

    // ── Priority: status > hasWinner > clock ──────────────────────────

    it('status takes priority over a future draws_at and false hasWinner', () => {
        expect(giveawayPhase('2025-07-01T00:00:00Z', '2025-08-01T00:00:00Z', 'DRAWN', false)).toBe('drawn');
    });
});
