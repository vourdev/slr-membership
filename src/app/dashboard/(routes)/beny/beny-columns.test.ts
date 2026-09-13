import { benyColumnsFor } from './_components/columns';

import { describe, expect, it, vi } from 'vitest';

describe('benyColumnsFor', () => {
    const handlers = {
        onActivate: vi.fn(),
        onDeactivate: vi.fn()
    };

    it('includes Deactivated Date column for cancelled tab (BENY-04)', () => {
        const columns = benyColumnsFor('cancelled', handlers);
        const deactivatedCol = columns.find((c) => c.key === 'deactivatedAt');

        expect(deactivatedCol).toBeDefined();
        expect(deactivatedCol?.label).toBe('Deactivated Date');
    });

    it('includes basic columns (name, email, phone) on all tabs', () => {
        for (const tab of ['pending_activation', 'active', 'pending_deactivation', 'cancelled'] as const) {
            const columns = benyColumnsFor(tab, handlers);
            const keys = columns.map((c) => c.key);
            expect(keys).toContain('name');
            expect(keys).toContain('email');
            expect(keys).toContain('phone');
        }
    });

    it('includes requestedAt and action on pending_activation tab', () => {
        const columns = benyColumnsFor('pending_activation', handlers);
        const keys = columns.map((c) => c.key);
        expect(keys).toContain('requestedAt');
        expect(keys).toContain('rowAction');
    });

    it('includes activatedAt on active tab', () => {
        const columns = benyColumnsFor('active', handlers);
        const keys = columns.map((c) => c.key);
        expect(keys).toContain('activatedAt');
    });

    it('includes rowAction on pending_deactivation tab', () => {
        const columns = benyColumnsFor('pending_deactivation', handlers);
        const keys = columns.map((c) => c.key);
        expect(keys).toContain('rowAction');
    });
});
