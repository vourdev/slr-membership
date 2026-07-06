# Members Sub-Tier Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render live member counts per sub-tier as a header card on the dashboard Members page, reviving a page that currently shows only a full-page EmptyState because `GET /admin/members` 400s.

**Architecture:** Add `GET /api/v1/memberships/stats` to the API map + a `React.cache`-wrapped resource function that normalizes the sparse Prisma-raw response to a sorted `SubTierCount[]`. A new server-only presentational component renders the counts as tier-colored chips + total. The Members page fetches stats and the members list in parallel with `Promise.allSettled` so a broken list can't blank the stats.

**Tech Stack:** Next.js 16 App Router (RSC), React 19, TypeScript, Tailwind v4, shadcn/ui.

## Global Constraints

Copied verbatim from the spec + docs/API-INTEGRATION.md. Every task's requirements implicitly include these:

- `apiFetch` already unwraps the `{ success, message, data, meta }` envelope → work with `data`.
- Empty/missing display value defaults (rule 7): string → `'-'`, number → `0`. Never blank/`undefined`/`null`/`NaN`.
- Resource functions wrapped in `React.cache`; authed live reads use `cache: 'no-store'`.
- Present-only: show only sub-tiers the API returns (no zero-fill), canonical sort order.
- No test runner in this repo. Each task's verification gate = `npm run type-check` + `npx eslint <touched files>` (+ curl / build / manual where noted). Do NOT add jest/vitest.
- Prettier: 4-space indent, single quotes, JSX single quotes, semicolons, width 120, trailing comma `none`. Path alias `@/*` → `src/*`.
- Server Components by default; add `'use client'` only for interactivity.
- No `draw_pass` in any UI (none of these fields expose it — nothing to guard, just don't add it).

---

### Task 1: Data layer — endpoint + normalized resource function

**Files:**
- Modify: `src/lib/api/endpoints.ts` (memberships namespace)
- Modify: `src/lib/api/resources/memberships.ts` (append DTOs + function)

**Interfaces:**
- Consumes: `API` map + `apiFetch<T>` (existing), `cache` from `react` (already imported in the file).
- Produces:
  - `interface SubTierCount { subTierId: string; count: number }`
  - `getMembershipStats(token: string): Promise<SubTierCount[]>` — sorted canonical, sparse.

- [ ] **Step 1: Add the endpoint path**

In `src/lib/api/endpoints.ts`, add `stats` to the `memberships` block:

```ts
    memberships: {
        tiers: '/api/v1/memberships/tiers',
        me: '/api/v1/memberships/me',
        changeTier: '/api/v1/memberships/change-tier',
        stats: '/api/v1/memberships/stats'
    },
```

- [ ] **Step 2: Add DTOs + resource function**

Append to `src/lib/api/resources/memberships.ts` (end of file; `cache`, `API`, `apiFetch` are already imported at the top):

```ts
// ─── Membership stats (admin-viewable sub-tier distribution) ─────────────────

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

// Canonical display order; unknown ids sort last.
const SUB_TIER_ORDER: Record<string, number> = {
    visitor: 0,
    r1: 1,
    r4: 2,
    r7: 3,
    b1: 4,
    b4: 5,
    b7: 6,
    b10: 7
};

/**
 * Admin: member counts grouped by sub-tier. The API returns a sparse, Prisma-raw
 * array ({ _count: { _all }, subTierId }) — this normalizes to { subTierId, count }
 * sorted in canonical tier order. Live counts → no-store.
 */
export const getMembershipStats = cache(async (token: string): Promise<SubTierCount[]> => {
    const raw = await apiFetch<RawSubTierStat[]>(API.memberships.stats, { token, cache: 'no-store' });

    return raw
        .map((r) => ({ subTierId: r.subTierId || '-', count: r._count?._all ?? 0 }))
        .sort((a, b) => (SUB_TIER_ORDER[a.subTierId] ?? 99) - (SUB_TIER_ORDER[b.subTierId] ?? 99));
});
```

- [ ] **Step 3: Verify types + lint**

Run: `npm run type-check && npx eslint src/lib/api/endpoints.ts src/lib/api/resources/memberships.ts`
Expected: no errors.

- [ ] **Step 4: Re-confirm live shape matches the normalizer**

Run (reconfirms the raw shape the normalizer parses):

```bash
BASE="https://api.smartliferewards.com.au"
TOKEN=$(curl -s -X POST "$BASE/api/v1/auth/login" -H 'Content-Type: application/json' \
  -d '{"email":"admin@smartliferewards.com.au","password":"ChangeMeImmediately!1"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["data"]["access_token"])')
curl -s "$BASE/api/v1/memberships/stats" -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

Expected: `data` = array of `{ "_count": { "_all": <n> }, "subTierId": "<id>" }`. Confirms `r._count._all` + `r.subTierId` field names used by the normalizer. (Current data: r4=1, visitor=7, b4=1.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/api/endpoints.ts src/lib/api/resources/memberships.ts
git commit -m "feat(api): add getMembershipStats resource + endpoint

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Presentational component — `SubTierStats`

**Files:**
- Create: `src/app/dashboard/(routes)/members/_components/sub-tier-stats.tsx`

**Interfaces:**
- Consumes: `SubTierCount` (Task 1), shadcn `Card` family from `@/components/ui/card`.
- Produces: `export const SubTierStats: FC<{ counts: SubTierCount[]; total: number }>` — server component (no `'use client'`).

- [ ] **Step 1: Create the component**

Create `src/app/dashboard/(routes)/members/_components/sub-tier-stats.tsx`:

```tsx
import type { FC } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SubTierCount } from '@/lib/api/resources/memberships';

// Sub-tier id → readable label. Token counts per CLAUDE.md tier table.
const SUB_TIER_LABEL: Record<string, string> = {
    visitor: 'Visitor',
    r1: 'RED · 1 tok',
    r4: 'RED · 4 tok',
    r7: 'RED · 7 tok',
    b1: 'BLUE · 1 tok',
    b4: 'BLUE · 4 tok',
    b7: 'BLUE · 7 tok',
    b10: 'BLUE · 10 tok'
};

const labelFor = (subTierId: string): string =>
    SUB_TIER_LABEL[subTierId] ?? (subTierId === '-' ? '-' : subTierId.toUpperCase());

const chipAccent = (subTierId: string): string => {
    if (subTierId.startsWith('r')) return 'border-slr-red-tier/40 text-slr-red-tier';
    if (subTierId.startsWith('b')) return 'border-slr-blue-tier/40 text-slr-blue-tier';

    return 'border-slr-navy-border text-slr-dim';
};

export const SubTierStats: FC<{ counts: SubTierCount[]; total: number }> = ({ counts, total }) => (
    <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-base'>Members by Sub-Tier</CardTitle>
            <span className='text-2xl font-bold tabular-nums'>{total.toLocaleString()}</span>
        </CardHeader>
        <CardContent>
            {counts.length === 0 ? (
                <p className='text-muted-foreground text-sm'>No members yet.</p>
            ) : (
                <div className='flex flex-wrap gap-2'>
                    {counts.map((c) => (
                        <span
                            key={c.subTierId}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${chipAccent(c.subTierId)}`}
                        >
                            <span className='uppercase'>{labelFor(c.subTierId)}</span>
                            <span className='font-semibold tabular-nums'>{c.count.toLocaleString()}</span>
                        </span>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
);
```

Notes: module-scope component + hoisted maps (`rerender-no-inline-components`, `js-index-maps`); ternary render, no `&&` (`rendering-conditional-render`).

- [ ] **Step 2: Verify types + lint**

Run: `npm run type-check && npx eslint "src/app/dashboard/(routes)/members/_components/sub-tier-stats.tsx"`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/dashboard/(routes)/members/_components/sub-tier-stats.tsx"
git commit -m "feat(members): add SubTierStats presentational component

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Wire the page — parallel fetch + render matrix + slim client

**Files:**
- Modify: `src/app/dashboard/(routes)/members/page.tsx` (full rewrite)
- Modify: `src/app/dashboard/(routes)/members/members-client.tsx` (remove container + `Heading`)

**Interfaces:**
- Consumes: `getMembershipStats` + `SubTierCount` (Task 1), `SubTierStats` (Task 2), existing `getAdminMembers`, `getAccessToken`, `handleApiAuthError`, `DashboardEmptyState`, `Heading`, `MembersClient`/`MemberRow`.
- Produces: no new exports; `MemberRow` export on `members-client.tsx` unchanged.

- [ ] **Step 1: Slim `members-client.tsx`**

The container + `Heading` move up to the page. Replace `src/app/dashboard/(routes)/members/members-client.tsx` with:

```tsx
'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { DataTable } from '@/components/data-table';

import { membersColumns } from './_components/columns';
import { deleteMemberAction } from './actions';
import { toast } from 'sonner';

export type MemberRow = {
    id: string;
    name: string;
    email: string;
    tier: string;
    state: string;
    status: string;
    registered_at: string;
};

export function MembersClient({ data }: { data: MemberRow[] }) {
    const router = useRouter();
    const [, startTransition] = useTransition();

    const handleEdit = (row: MemberRow) => {
        router.push(`/dashboard/members/${row.id}`);
    };

    const handleDelete = (row: MemberRow) => {
        startTransition(async () => {
            try {
                await deleteMemberAction(row.id);
                toast.success('Member deleted.');
                router.refresh();
            } catch {
                toast.error('Could not delete member.');
            }
        });
    };

    return (
        <div className='overflow-x-auto'>
            <DataTable
                searchKey='name'
                columns={membersColumns}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
```

- [ ] **Step 2: Rewrite `page.tsx`**

Replace `src/app/dashboard/(routes)/members/page.tsx` with:

```tsx
import DashboardEmptyState from '@/app/dashboard/_components/dashboard-empty-state';
import Heading from '@/components/ui/heading';
import { handleApiAuthError } from '@/lib/api/guard';
import { getAdminMembers } from '@/lib/api/resources/admin';
import { type SubTierCount, getMembershipStats } from '@/lib/api/resources/memberships';
import { getAccessToken } from '@/lib/api/server';

import { SubTierStats } from './_components/sub-tier-stats';
import { type MemberRow, MembersClient } from './members-client';
import { CircleAlert } from 'lucide-react';

export default async function MembersPage() {
    const token = await getAccessToken();

    // Independent fetches — parallel, and settle independently so a broken
    // members list (currently 400s) cannot blank the stats card.
    const [statsResult, membersResult] = await Promise.allSettled([
        token ? getMembershipStats(token) : Promise.resolve<SubTierCount[]>([]),
        token ? getAdminMembers(token) : Promise.resolve([])
    ]);

    if (statsResult.status === 'rejected') handleApiAuthError(statsResult.reason);
    if (membersResult.status === 'rejected') handleApiAuthError(membersResult.reason);

    const statsOk = statsResult.status === 'fulfilled';
    const listOk = membersResult.status === 'fulfilled';

    const counts: SubTierCount[] = statsOk ? statsResult.value : [];
    const total = counts.reduce((sum, c) => sum + c.count, 0);

    const rows: MemberRow[] = listOk
        ? membersResult.value.map((m) => ({
              id: m.user_id,
              name: m.full_name || '-',
              email: m.email || '-',
              tier: m.tier || '-',
              state: m.state || '-',
              status: m.status || '-',
              registered_at: m.created_at ? m.created_at.slice(0, 10) : '-'
          }))
        : [];

    if (!statsOk && !listOk) {
        return (
            <div className='p-4'>
                <DashboardEmptyState
                    icon={CircleAlert}
                    title='Could not load members'
                    description='The members area is unavailable right now. Please try again shortly.'
                />
            </div>
        );
    }

    return (
        <div className='mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6'>
            <Heading title='Members' description='Registered members' />

            {statsOk ? <SubTierStats counts={counts} total={total} /> : null}

            {listOk ? (
                <MembersClient data={rows} />
            ) : (
                <DashboardEmptyState
                    icon={CircleAlert}
                    title='Member list unavailable'
                    description='Sub-tier totals are shown above. The full member list is temporarily unavailable.'
                />
            )}
        </div>
    );
}
```

Notes: `Promise.allSettled` (`async-parallel` + independent failure); auth-error guard runs for both rejections before rendering; ternary render matrix (`rendering-conditional-render`).

- [ ] **Step 3: Verify types + lint**

Run: `npm run type-check && npx eslint "src/app/dashboard/(routes)/members/page.tsx" "src/app/dashboard/(routes)/members/members-client.tsx"`
Expected: no errors.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds; `/dashboard/members` compiles with no type/lint failure.

- [ ] **Step 5: Manual verification**

Run `npm run dev`, sign in as `admin@smartliferewards.com.au` / `ChangeMeImmediately!1`, open `/dashboard/members`.
Expected: "Members by Sub-Tier" card renders with total `9` and chips `Visitor 7`, `RED · 4 tok 1`, `BLUE · 4 tok 1` (current data); below it, the "Member list unavailable" inline empty state (because `/admin/members` still 400s). No full-page EmptyState.

- [ ] **Step 6: Commit**

```bash
git add "src/app/dashboard/(routes)/members/page.tsx" "src/app/dashboard/(routes)/members/members-client.tsx"
git commit -m "feat(members): render sub-tier stats card above members list

Fetch stats + list in parallel via Promise.allSettled so the known-broken
members list (400) no longer blanks the whole page. Heading + container move
from members-client up to the page.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Endpoint + normalized resource fn → Task 1. ✅
- `SubTierStats` server component, labels, tier-color chips, present-only, empty case → Task 2. ✅
- Page `Promise.allSettled` render matrix + slim client → Task 3. ✅
- Verification (type-check/eslint/curl/build/manual) → Task 1 Step 3-4, Task 3 Step 3-5. ✅
- Decisions (present-only, card, allSettled, placement) → all realized in code. ✅

**Placeholder scan:** No TBD/TODO; every code step shows full content; commands have expected output. ✅

**Type consistency:** `SubTierCount { subTierId, count }` defined Task 1, consumed identically in Tasks 2 & 3. `getMembershipStats(token) => Promise<SubTierCount[]>` signature matches page usage. `SubTierStats` prop shape `{ counts, total }` matches page call site. `MemberRow` fields match the existing `AdminMemberListItem` map. ✅
