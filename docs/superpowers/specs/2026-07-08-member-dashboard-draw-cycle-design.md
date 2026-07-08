# SP1 — Member Dashboard & Draw Cycle (live integration)

**Date:** 2026-07-08
**Sub-project:** 1 of 4 (decomposed from: discounts, BENY, e-books, reading page, entry engine, draw pool, member dashboard, draw cycle).
**Scope:** Wire the member dashboard (`/member`) and the member Giveaways pages (`/member/giveaways`, `/member/giveaways/[id]`) to live API data. Folds four requested tasks — _member dashboard, entry-calculation display, draw-pool display, basic draw-cycle logic_ — because they share one data source and the backend owns the actual math (token→CSV rows, `draw_pass`, 28-day cycle, `state+tier` pool). The frontend only **displays** those outputs.

Follows `docs/API-INTEGRATION.md` throughout: curl-first DTOs, envelope→`data`, `React.cache` + `no-store` for authed reads, per-section `EmptyState` on failure, `-`/`0`/`money÷100` fallbacks, **`entry_status` only — never `draw_pass`**.

---

## 1. Live data sources (verified by curl 2026-07-08)

| Endpoint | Status | Drives |
|---|---|---|
| `GET /memberships/me` | ✅ works | Summary card: sub-tier, price, billing status, cycle anchor (`activatedAt`) |
| `GET /entries/` | ✅ works (already integrated) | **Draw-cycle surface**: `entry_status`, token count, cycle window (`start_at`/`end_at`), renewal countdown |
| `GET /discounts/` | ✅ works (RED/BLUE; 403 visitor) | Featured discounts strip (`is_featured`) |
| `GET /notifications/` | ✅ works (already integrated) | Header bell (unchanged) |
| `GET /giveaways/` | 🐞 **500 INTERNAL_ERROR (all tiers)** | Current-draw card + upcoming-giveaways + list page → **degrade to EmptyState** |
| `GET /giveaways/{id}` | 🐞 unverifiable (list is 500) | Giveaway detail → degrade to `notFound`/EmptyState |

### Real shapes (off live responses)

`GET /memberships/me` → identical to the existing `MembershipRecord`:
```
{ id, userId, subTierId:"r4", billingStatus:"ACTIVE", activatedAt, pendingBonusNextCycle,
  subTier:{ id, tier:"RED", marketingName, priceCents:2000, token, ... } }
```
Notes: `billingStatus` is **UPPERCASE**; **no `state`** (comes from session); **no next-payment / BENY** fields.

`GET /entries/` → `data.current_cycle`:
```
{ cycle_id, start_at, end_at, tier:"r4", base_token, referral_bonus, total_token, entry_status:"active" }
```
`end_at` = `start_at` + 28 days → authoritative **next-renewal date**. `total_token` = renderable token count. `entry_status` = active|inactive.

---

## 2. Field mapping (mock → live)

**MembershipSummaryCard** (`MembershipSummary`)
- `sub_tier` ← `memberships/me.subTierId` uppercased (`r4`→`R4`); fallback session.
- `state` ← session identity (`me` has none).
- `billing_status` ← `me.billingStatus` lowercased + mapped (`ACTIVE`→active, `PAST_DUE`→past_due, `CANCELED/CANCELLED`→canceled, else active).
- `next_payment_date` ← `entries.current_cycle.end_at`; fallback `me.activatedAt` + 28d; else `-`.
- `beny_addon` ← **`null` = hidden** until SP4 (BENY sub-project). Card renders the BENY row only when the value is non-null.
- price + "entries per draw" continue to derive from `SUB_TIERS[sub_tier]` (matches live `priceCents`); no change.

**DrawStatusCard** — repurposed to the live **cycle** (giveaways 500-blocked):
- `entry_status` ← `current_cycle.entry_status` (real, never `draw_pass`).
- `total_entries` ← `current_cycle.total_token` (real token count).
- `draw_pool` ← `formatDrawPool(group, state)`.
- `draws_at` ← `current_cycle.end_at` (renewal countdown).
- Card gains two optional props: `eyebrow` (default "Current Draw" → passed "Current Cycle") and optional `prize_label` (omit the trophy footer when absent). No `current_cycle` → EmptyState.

**FeaturedDiscounts** (`FeaturedDiscount`)
- `brand` ← `partner_name`, `category` ← `category`, `value_label` ← `title` (API carries no discrete value label).
- Filter `is_featured`; visitor (403) or empty → hide section / EmptyState.

**UpcomingGiveaways** ← `giveaways/` → 500 → EmptyState ("No upcoming giveaways right now").

---

## 3. New endpoints + resources

`endpoints.ts` `giveaways`: add `list: '/api/v1/giveaways/'`, `detail: (id) => '/api/v1/giveaways/${id}'`.

`resources/memberships.ts`:
- `getMyMembership(token)` → `apiFetch<MembershipRecord>(API.memberships.me, { token, cache:'no-store' })`, `React.cache`.

`resources/giveaways.ts`:
- `ApiGiveaway` / `ApiGiveawayDetail` DTOs — **UNVERIFIED** (list 500s); modelled off OpenAPI + the winners `giveaway` hint (`{ giveaway_id, name, tier, type }`). Marked in code + carried as a backend blocker.
- `getGiveaways(token)`, `getGiveaway(id, token)` (`React.cache`, `no-store`).
- `toGiveaway()` / `toGiveawayDetail()` mappers → the existing UI `Giveaway`/`GiveawayDetail` types with `-`/`0` defaults, so a backend fix is a field-name tweak, not a rewrite.

---

## 4. Pages

- **`member/page.tsx`** — replace `getMemberDashboard()` mock with `getAccessToken()` + `Promise.all([getMyMembership, getEntryHistory, getDiscounts])` (parallel, no waterfall). Each card wrapped so a failure → its own EmptyState; `handleApiAuthError` on 401. Greeting ← session. UpcomingGiveaways ← `getGiveaways` in its own try/catch → EmptyState.
- **`member/giveaways/page.tsx`** — session identity + `getGiveaways(token)` in try/catch; map → `Giveaway[]` for `GiveawaysBoard`; 500/empty → EmptyState.
- **`member/giveaways/[id]/page.tsx`** — `getGiveaway(id, token)` in try/catch; map → `GiveawayDetail`; failure → `notFound()`.

## 5. Mock retirement

- `data/member-dashboard.ts` — remove `getMemberDashboard` + `DASHBOARD`/`MEMBER` constants. Keep `getCurrentMember`, re-based on `getSessionIdentity` only (safe defaults: name→"Member", sub_tier→"VISITOR", state→"-"). Consumers (layout, discounts, prizes, giveaways) keep working on real session data.
- `data/giveaways.ts` — orphaned after rewiring (only the 2 giveaway pages imported it) → delete.
- `member/layout.tsx` — swap `getMemberDashboard()` → `getCurrentMember()`; drop the `any[]` on notifications.

---

## 6. Backend blockers (build FE anyway; hand to backend)

1. 🐞 **`GET /giveaways/` returns 500 INTERNAL_ERROR for every tier** (red/blue/visitor) — `giveaways/winners` works, so list/detail handlers are broken. Current-draw, upcoming-giveaways, and both giveaway pages degrade to EmptyState until fixed. `ApiGiveaway` DTO is unverified against a real body.
2. `GET /memberships/me` carries **no `state`, no next-payment, no BENY** — state from session, next-payment derived from cycle, BENY deferred to SP4.
3. `entries.current_cycle.total_token` (=7 for seed r4) vs PRD R4 tokens (=4) — seed/data drift; FE renders live `total_token`. Confirm canonical token allocation.
4. Authoritative next-payment + BENY state land with SP4 (`billing/status`, `beny/status`).

## 7. Verification

`npm run type-check` · `npx eslint` on touched files · curl `me`/`entries`/`discounts` with `red@`/`blue@`/`visitor@` · eyeball `/member` (renders on real data; giveaway sections EmptyState) + `/member/giveaways` (EmptyState). Update `docs/API-INTEGRATION.md` progress table + blockers.
