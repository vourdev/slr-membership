# Visitor-aware Member Dashboard — Design

**Date:** 2026-07-09
**Scope:** Make the member dashboard home (`/member`) visitor-aware, and verify the other member modules already match the Notion PRD for the Visitor role.

Aligned to Notion PRD v3.2 (EN) §2.1 roles + per-module access rules (fetched 2026-07-09).

---

## 1. Audit result (member area vs PRD)

| Module | PRD rule for Visitor | Current | Verdict |
|---|---|---|---|
| Discounts | no access → upgrade CTA | `canAccess` gate + CTA | ✅ correct |
| BENY | can't buy → upgrade CTA | gated in discounts page | ✅ correct |
| E-books list | list visible | cards render, `is_locked` per tier | ✅ correct |
| E-books reader | content gated → upgrade CTA | 403 → upgrade gate | ✅ correct |
| Giveaways | Visitor draw only | API returns only Visitor draw; board hides RED/BLUE tabs | ✅ correct |
| Entry History | full (1 token) | live entries | ✅ verify |
| Prizes | informational | shows visitor prize | ✅ verify |
| Profile | full | Visitor Pass | ✅ verify |
| Referral | accessible; reward = manual gift, no token bonus | `ComingSoon` (unbuilt) | ⚠️ out of scope |
| **Dashboard home** | mixed | **not visitor-aware** | 🔴 fix |

Only the dashboard home needs changes; the rest is PRD-correct or unbuilt.

## 2. Live visitor data (verified)

- `GET /memberships/me` (visitor) → `subTierId: "visitor"`, `priceCents: 0`, `token: 1`, `drawPassDefault: -1` (infinite), `billingStatus: "ACTIVE"`.
- `GET /entries/` (visitor) → `current_cycle` exists (`tier: visitor`, `total_token: 1`, `entry_status: active`, 28-day window) — but visitor has **no billing renewal** per PRD.
- `GET /giveaways/` (visitor) → returns **only** the Visitor Weekly Draw (`is_entered: true`, prize `$25 Coles Gift Card`).

## 3. Changes (approach A — conditional props + one banner)

**`src/app/member/page.tsx`**
- Derive `isVisitor = memberGroup === 'visitor'`.
- Render **`VisitorUpgradeBanner`** at the top **only when `isVisitor`**.
- **Draw card for visitor:** feed the real Visitor Weekly Draw from `giveaways/` (the first/soonest visitor giveaway) into `DrawStatusCard` with the `Current Draw` framing (prize + `draws_at` countdown + `entry_status` + 1 entry). Paid tiers keep the existing "Current Cycle · Renews" (from `entries/`). If `giveaways/` is empty for a visitor, fall back to the cycle card.
- Pass `isVisitor` to `MembershipSummaryCard`.

**`src/app/member/_components/dashboard/visitor-upgrade-banner.tsx`** (new)
- Server component, gold-accented card. Copy: "You're on the free Visitor pass — upgrade to RED or BLUE to unlock partner discounts, e-books, cash draws and the BENY add-on." + **Upgrade** button → `/member/profile` (matches existing upgrade links from ebooks/giveaways gates). Uses `goldButtonStyle`.

**`src/app/member/_components/dashboard/membership-summary-card.tsx`**
- Add optional `isVisitor?: boolean`. When true, **hide the Billing + Next-payment rows** (visitor is free, no renewal). Keep the tier (Visitor Pass), price (Free), and Entries-per-draw (1). BENY row already hidden via `beny_addon === null`.

## 4. Verify (no code change expected)
Render `/member` + `/member/entry-history` + `/member/prizes` + `/member/profile` as `visitor@` and confirm no billing/renewal artifacts leak; the draw card shows the Visitor draw; the upgrade banner shows.

## 5. Non-goals
- Referral page (stays `ComingSoon`).
- Paid-tier dashboard behavior (unchanged).
- Quick-actions lock badges / featured-discounts upsell strip (YAGNI — the banner covers the upsell).

## 6. Verification
`npm run type-check` · `npx eslint` on touched files · live authed render as `visitor@` (banner + summary without billing rows + Visitor draw card) and `red@` (unchanged paid dashboard).
