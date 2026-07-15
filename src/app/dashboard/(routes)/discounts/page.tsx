import { handleApiAuthError } from '@/lib/api/guard';
import { getDiscounts } from '@/lib/api/resources/discounts';
import { getAccessToken } from '@/lib/api/server';
import { ApiError } from '@/lib/api/types';

import { type DiscountRow, DiscountsClient, type ListError } from './discounts-client';

export default async function DiscountsPage() {
    const token = await getAccessToken();

    let rows: DiscountRow[] = [];
    let listError: ListError | null = null;

    // The list is tier-gated to RED/BLUE members, so admin currently gets 403.
    // We still attempt it and surface the exact error so it can be reported to
    // the backend. If they open it up, the real rows render here automatically.
    try {
        const discounts = token ? await getDiscounts(token) : [];
        rows = discounts.map((d) => ({
            id: d.discount_id,
            title: d.title || '-',
            partner: d.partner_name || '-',
            category: d.category || '-',
            featured: d.is_featured ? 'Yes' : 'No',
            active: '-'
        }));
    } catch (error) {
        handleApiAuthError(error); // 401 only → force logout; 403 falls through
        if (error instanceof ApiError) {
            const payload = error.payload as { code?: string; requestId?: string } | undefined;
            listError = {
                status: error.status,
                message: error.message,
                code: payload?.code ?? null,
                requestId: payload?.requestId ?? null
            };
        } else {
            listError = { status: 0, message: String(error), code: null, requestId: null };
        }
    }

    return <DiscountsClient initialRows={rows} listError={listError} />;
}
