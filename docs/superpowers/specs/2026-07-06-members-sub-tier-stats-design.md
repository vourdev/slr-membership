# Members Sub-Tier Stats — Design

Date: 2026-07-06
Status: Approved (design)
Module: admin dashboard → Members

## Goal

Integrate `GET /api/v1/memberships/stats` (admin-viewable member counts per sub-tier)
into the dashboard Members list page as a header stats card. Currently the Members
list page early-returns a full-page EmptyState because `GET /admin/members` 400s on
the backend. This change makes the page useful again: live sub-tier counts + total
render even while the members-list backend stays broken.

## Live API (verified via curl, not OpenAPI)

Rule 2 (docs/API-INTEGRATION.md): hit live first. The OpenAPI summary said
"grouped by tier+state" — **wrong / drifted**. Real response:

```
GET /api/v1/memberships/stats   (Authorization: Bearer <admin token>)

{
  "success": true,
  "message": "Request completed successfully",
  "data": [
    { "_count": { "_all": 1 }, "subTierId": "r4" },
    { "_count": { "_all": 7 }, "subTierId": "visitor" },
    { "_count": { "_all": 1 }, "subTierId": "b4" }
  ]
}
```

Facts:
- Grouped by `subTierId` **only** — no state dimension.
- Prisma-raw shape: count sits at `_count._all`.
- **Sparse**: only sub-tiers with ≥1 member appear. Absent sub-tier = 0 members.
- Works live for the admin token — no 400/403 (unlike `/admin/members`, `/discounts/`).
- Distinct from `/admin/dashboard`, which buckets by **base tier** (RED/BLUE/Visitor);
  this is finer, per **sub-tier** (r4 vs r7 vs b10).

## Scope

In:
- `endpoints.ts` — add `memberships.stats`.
- `resources/memberships.ts` — DTO + `getMembershipStats(token)` (normalize + sort).
- `members/_components/sub-tier-stats.tsx` — new server component (presentational).
- `members/page.tsx` — fetch stats + members in parallel; restructure render matrix.
- `members-client.tsx` — slim to the `DataTable` + edit/delete handlers only
  (container + `Heading` move up into `page.tsx`).

Out (YAGNI):
- Zero-filling absent sub-tiers (present-only; see Decisions).
- Any state dimension (API doesn't return it).
- Fixing the `/admin/members` 400 (backend bug, out of FE scope).
- Touching `/dashboard` home (placement decided: Members page).

## Data layer

### endpoints.ts

Add under `memberships`:

```ts
stats: '/api/v1/memberships/stats'
```

### resources/memberships.ts

```ts
// Raw Prisma-groupBy row as returned by GET /memberships/stats.
interface RawSubTierStat {
    _count: { _all: number };
    subTierId: string;
}

// Normalized, display-ready count per sub-tier.
export interface SubTierCount {
    subTierId: string;
    count: number;
}

// Canonical display order; unknown ids sort last (appended in encounter order).
const SUB_TIER_ORDER: Record<string, number> = {
    visitor: 0, r1: 1, r4: 2, r7: 3, b1: 4, b4: 5, b7: 6, b10: 7
};

export const getMembershipStats = cache(async (token: string): Promise<SubTierCount[]> => {
    const raw = await apiFetch<RawSubTierStat[]>(API.memberships.stats, { token, cache: 'no-store' });
    return raw
        .map((r) => ({ subTierId: r.subTierId || '-', count: r._count?._all ?? 0 }))
        .sort((a, b) => (SUB_TIER_ORDER[a.subTierId] ?? 99) - (SUB_TIER_ORDER[b.subTierId] ?? 99));
});
```

- `React.cache` per-request dedup (`server-cache-react`).
- `cache: 'no-store'` — live counts, authed.
- Defensive defaults per rule 7: missing id → `'-'`, missing count → `0`.
- Total is derived by the consumer (`counts.reduce`), not stored.

## UI layer

### members/_components/sub-tier-stats.tsx (new, server component)

Presentational only. No `'use client'`. Props:

```ts
{ counts: SubTierCount[]; total: number }
```

Renders a shadcn `Card`:
- Bold total members (`total.toLocaleString()`).
- `flex flex-wrap` of chips, one per `counts` entry: label + count.
- Empty `counts` (total 0) → single muted "No members yet" line inside the card.

Label + tier-color derivation via a module-level index map (`js-index-maps`,
`rerender-no-inline-components` — this component is defined at module scope, never
inside another component):

```ts
const SUB_TIER_LABEL: Record<string, string> = {
    visitor: 'Visitor',
    r1: 'RED · 1 tok', r4: 'RED · 4 tok', r7: 'RED · 7 tok',
    b1: 'BLUE · 1 tok', b4: 'BLUE · 4 tok', b7: 'BLUE · 7 tok', b10: 'BLUE · 10 tok'
};
```

- Label fallback: unknown id → `id.toUpperCase()`; `'-'` stays `'-'`.
- Chip accent by prefix: `visitor` → neutral, `r*` → RED tier color, `b*` → BLUE
  tier color. Reuse SLR tokens (dashboard admin theme, already dark navy).
- Token counts sourced from CLAUDE.md tier table (R1/R4/R7 = 1/4/7; B1/B4/B7/B10 = 1/4/7/10).

### members/page.tsx (restructure)

```
const token = await getAccessToken();

// independent — fetch in parallel (async-parallel). Settle independently so one
// failure does not blank the other.
const [statsResult, membersResult] = await Promise.allSettled([
    token ? getMembershipStats(token) : Promise.resolve([]),
    token ? getAdminMembers(token) : Promise.resolve([])
]);
```

- On each rejected result, call `handleApiAuthError(reason)` so a 401 still forces
  logout (must run for **both** rejections before deciding render).
- Derive `statsOk`, `rows`, `listOk`, `total`.

Render matrix (`rendering-conditional-render` — ternaries, no `&&`):

| stats | list | render |
|-------|------|--------|
| ok    | ok   | `Heading` + `SubTierStats` + `MembersClient` (table) |
| ok    | fail | `Heading` + `SubTierStats` + inline list-unavailable `DashboardEmptyState` |
| fail  | ok   | `Heading` + `MembersClient` (table); stats omitted silently |
| fail  | fail | full-page `DashboardEmptyState` (current behavior preserved) |

`page.tsx` owns the outer container (`mx-auto max-w-7xl ... px-4 py-6`) + `Heading`.

### members-client.tsx (slim)

Remove the outer container `div` and `Heading` (now owned by `page.tsx`). Keep:
`'use client'`, router, `useTransition`, `deleteMemberAction`, toast, and the
`DataTable` (wrapped in the `overflow-x-auto` needed for the table). `MemberRow`
type export unchanged.

## Decisions

- **Present-only, not zero-filled.** Show only returned sub-tiers; canonical sort
  keeps order stable. Rejected zero-fill (all 8 rows always) — adds noise for the
  common case, no real benefit for an at-a-glance strip.
- **Placement: Members list page header** (user-selected over /dashboard home).
- **Card, not a bare strip** — reuses the dashboard `Card` visual language; total
  gets emphasis, chips wrap responsively.
- **`Promise.allSettled`, not `Promise.all`** — the two fetches fail independently
  (`/admin/members` is known-broken); `all` would let the broken list reject the
  whole page and defeat the entire point. Auth-error handling still runs per rejection.

## Applied react-best-practices

- `async-parallel` — stats + members fetched together, not sequentially.
- `server-cache-react` — `getMembershipStats` wrapped in `React.cache`.
- `rerender-no-inline-components` — `SubTierStats` at module scope; label/order maps
  hoisted to module level.
- `rendering-conditional-render` — ternary render matrix, no `&&` branches.
- `js-index-maps` — `SUB_TIER_LABEL` / `SUB_TIER_ORDER` maps for O(1) lookup.

## Verification

- `npm run type-check`
- `npx eslint <touched files>`
- Live curl already confirmed the shape; re-curl after wiring to confirm normalized
  render matches (r4=1, visitor=7, b4=1, total=9 for current data).
- Manual: load `/dashboard/members` as admin — stats card renders above the
  list-EmptyState (since `/admin/members` still 400s).
```
