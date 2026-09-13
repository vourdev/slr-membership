/**
 * Whether a member belongs in the TPAL draw export, as the admin panel should show it.
 *
 * draw_pass alone is not enough: the backend leaves it untouched when a subscription is
 * cancelled, so a cancelled member kept showing "Eligible" even though the CSV export already
 * left them out. Requiring an active billing status makes the panel agree with the export —
 * checked against the production CSV of 2026-09-12, with no member differing.
 *
 * -1 is the unlimited draw_pass the retired Visitor tier used.
 */
export function isTpalEligible(drawPass: number | string | null | undefined, billingStatus: string | null | undefined) {
    const dp = typeof drawPass === 'number' ? drawPass : Number(drawPass);
    if (Number.isNaN(dp)) return false;

    return (dp > 0 || dp === -1) && (billingStatus ?? '').toLowerCase() === 'active';
}
