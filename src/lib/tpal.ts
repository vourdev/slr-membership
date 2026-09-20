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

/**
 * Which of the two conditions kept a member out of the export, so the admin table can say why
 * instead of leaving a bare "Excluded" to chase down by hand. draw_pass is internal-only, so the
 * copy names the cause and never the count.
 */
export function tpalExclusionReason(
    drawPass: number | string | null | undefined,
    billingStatus: string | null | undefined
): string | null {
    // Mirrors the "-" cell in the members table: an absent draw_pass is unknown, not zero.
    if (drawPass === null || drawPass === undefined) return null;

    const dp = typeof drawPass === 'number' ? drawPass : Number(drawPass);
    if (Number.isNaN(dp) || isTpalEligible(drawPass, billingStatus)) return null;

    const billingOff = (billingStatus ?? '').toLowerCase() !== 'active';
    const noEntries = !(dp > 0 || dp === -1);

    if (billingOff && noEntries) return 'Billing is not active, and no entries are left this cycle.';
    if (billingOff) return `Billing is "${billingStatus || 'unknown'}" — only active billing is exported.`;

    return 'Billing is active, but no entries are left this cycle.';
}
