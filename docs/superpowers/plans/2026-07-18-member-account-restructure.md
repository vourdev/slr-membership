# Member Account Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the member account area — show tier marketing names instead of codes, split Profile (user info + edit) from a new Membership/billing page, and relocate BENY onto the Membership page.

**Architecture:** Frontend-only (Next.js App Router, Server Components + server actions). Reuses existing billing resources and the existing `BenySection`. Stripe-dependent controls that aren't wired yet render disabled with a "coming soon (Ronde 3)" note. No new backend endpoints are required; gaps are documented for backend.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui, React Hook Form + Zod, Axios-based `apiFetch`, Sonner toasts.

## Global Constraints

- **Verification model (this repo has no unit-test runner):** every task ends with `npm run type-check` + `npx eslint <touched files>`, plus a live `curl` against `https://api.smartliferewards.com.au/api/v1` with a real token where an endpoint is involved, plus a `grep` check where a leak must be gone. Dev login: any seed account, password `ChangeMeImmediately!1`.
- **Never render `draw_pass`** as a number — only `entry_status`.
- **Tier codes (`R4`, `B4`, …) must never appear in member-facing UI** — only marketing names via `formatTierName`. Codes stay internal (session, API bodies, `subTierId`).
- **Money is integer cents (AUD)** → divide by 100 for display (`formatAud`).
- **Prettier:** 4-space indent, single quotes, semicolons, width 120, trailing comma `none`. Run `npm run format` if needed; `--fix` can leave an unindented `return` after a blank line — fix manually.
- **401 handling:** server components catch → `handleApiAuthError(error)`; server actions → call `handleApiAuthError(error)` before returning an error.
- **Dark theme member surfaces** use `.slr-member` + SLR tokens (`bg-slr-navy-card`, `text-slr-muted`, etc.). Match existing member pages.
- **Tier marketing names (verbatim):** `R1/B1 → Standard`, `R4/B4 → Plus`, `R7/B7 → Premium`, `B10 → Elite`, `VISITOR → Visitor`. Display format: `SLR Red · Plus` / `SLR Blue · Premium` / `Visitor`.

---

## File Structure

**Task 1 — Tier marketing names**
- Modify: `src/constant/tiers.ts` (add `marketingName` to `SubTierMeta` + every entry)
- Modify: `src/lib/member.ts` (add `formatTierName`)
- Modify: `src/components/common/tier-badge.tsx` (label uses marketing name, not code)
- Modify: leak sites surfaced by grep (member pages showing a raw code)

**Task 2 — `dob` in the member DTO**
- Modify: `src/lib/api/resources/auth.ts` (`MeResult.dob`)
- Modify: `src/lib/session-member.ts` + `src/data/profile.ts` (carry `dob` through)
- Modify: `src/types/member.ts` (`MemberProfile.dob`, `MemberProfile.pay_id_email`)

**Task 3 — Profile page (info + edit + security)**
- Create: `src/app/member/profile/actions.ts` (`updateProfileAction`)
- Create: `src/app/member/profile/_components/personal-info-section.tsx` (display + edit form)
- Modify: `src/app/member/profile/page.tsx` (drop billing; compose personal-info + security + support)

**Task 4 — Membership page**
- Create: `src/app/member/membership/page.tsx` (billing hub in member shell)
- Create: `src/app/member/membership/_components/tier-card.tsx`
- Create: `src/app/member/membership/_components/manage-tier.tsx`
- Move (git mv): `src/app/account/_components/manage-billing-button.tsx` + `upgrade-tier-buttons.tsx` → `src/app/member/membership/_components/`
- Move (git mv): `src/app/account/actions.ts` → `src/app/member/membership/actions.ts`
- Reuse: `src/app/member/discounts/_components/beny-section.tsx` (import as-is)

**Task 5 — Discounts cleanup, nav, redirect**
- Modify: `src/app/member/discounts/page.tsx` (remove BENY)
- Modify: `src/app/member/_components/member-nav.ts` (add Membership)
- Replace: `src/app/account/page.tsx` → redirect to `/member/membership`

---

## Task 1: Tier marketing names

**Files:**
- Modify: `src/constant/tiers.ts`
- Modify: `src/lib/member.ts`
- Modify: `src/components/common/tier-badge.tsx`
- Modify: leak sites (grep-driven)

**Interfaces:**
- Produces: `SUB_TIERS[code].marketingName: string`; `formatTierName(code: SubTierCode): string` → e.g. `"SLR Red · Plus"`, `"Visitor"`.

- [ ] **Step 1: Add `marketingName` to the tier constant**

In `src/constant/tiers.ts`, add the field to the interface and every entry:

```ts
export interface SubTierMeta {
    code: SubTierCode;
    group: TierGroup;
    label: string; // short code shown on the badge, e.g. 'R4'
    marketingName: string; // customer-facing name, e.g. 'Plus' (never the code)
    tokens: number;
    price_cents: number;
}

export const SUB_TIERS: Record<SubTierCode, SubTierMeta> = {
    VISITOR: { code: 'VISITOR', group: 'visitor', label: 'Visitor', marketingName: 'Visitor', tokens: 1, price_cents: 0 },
    R1: { code: 'R1', group: 'red', label: 'R1', marketingName: 'Standard', tokens: 1, price_cents: 1000 },
    R4: { code: 'R4', group: 'red', label: 'R4', marketingName: 'Plus', tokens: 4, price_cents: 2000 },
    R7: { code: 'R7', group: 'red', label: 'R7', marketingName: 'Premium', tokens: 7, price_cents: 3000 },
    B1: { code: 'B1', group: 'blue', label: 'B1', marketingName: 'Standard', tokens: 1, price_cents: 2600 },
    B4: { code: 'B4', group: 'blue', label: 'B4', marketingName: 'Plus', tokens: 4, price_cents: 3900 },
    B7: { code: 'B7', group: 'blue', label: 'B7', marketingName: 'Premium', tokens: 7, price_cents: 5200 },
    B10: { code: 'B10', group: 'blue', label: 'B10', marketingName: 'Elite', tokens: 10, price_cents: 6500 }
};
```

- [ ] **Step 2: Add `formatTierName` helper**

In `src/lib/member.ts`, append (imports `SUB_TIERS` + `TIER_VISUALS` already available via `getSubTierMeta`; add imports if missing):

```ts
/** Customer-facing tier name — "SLR Red · Plus", "SLR Blue · Elite", "Visitor". Never shows the code. */
export function formatTierName(code: SubTierCode): string {
    const meta = SUB_TIERS[code];
    if (meta.group === 'visitor') return 'Visitor';

    return `SLR ${TIER_VISUALS[meta.group].poolLabel} · ${meta.marketingName}`;
}
```

Ensure the file imports `SUB_TIERS` and `TIER_VISUALS` from `@/constant/tiers` (it already imports from there for `getSubTierMeta`/`formatDrawPool` — extend that import).

- [ ] **Step 3: Verify the helper with a throwaway node check**

Run:
```bash
cd /Users/zero/Projects/slr-membership && npx tsx -e "
import { formatTierName } from './src/lib/member';
const cases: [any,string][] = [['R4','SLR Red · Plus'],['B10','SLR Blue · Elite'],['B7','SLR Blue · Premium'],['VISITOR','Visitor']];
for (const [c,exp] of cases) { const got=formatTierName(c); if (got!==exp) throw new Error(\`\${c}: \${got} != \${exp}\`); }
console.log('formatTierName OK');
"
```
Expected: `formatTierName OK`. (If `tsx` isn't available, use `npx ts-node` or skip to type-check — the assertions are covered by Step 6 grep + manual view.)

- [ ] **Step 4: Route `TierBadge` through the marketing name**

In `src/components/common/tier-badge.tsx`, change the label line so paid tiers show the marketing name, not `meta.label`:

```ts
const label =
    meta.group === 'visitor'
        ? 'Visitor'
        : showGroup
          ? `${visual.label} · ${meta.marketingName}`
          : meta.marketingName;
```

(`visual.label` is the group in caps, e.g. `RED`; with `marketingName` the badge reads `RED · PLUS` — still uppercased by the existing `uppercase` class, no code shown.)

- [ ] **Step 5: Swap the remaining leak sites**

Find member-facing spots that render a raw code (not `subTierId` used in logic):

```bash
grep -rn "\.label\b\|subTierLabel\|sub_tier}\|meta.label" src/app/member src/app/account src/components/common | grep -iv "subTierId\|aria\|//"
```

For each spot that prints a tier to the user, replace with `formatTierName(<code>)` (import from `@/lib/member`). Known spots to check: `src/app/member/_components/dashboard/membership-summary-card.tsx`, `src/app/member/_components/dashboard/greeting.tsx`, `src/app/member/_components/member-header.tsx`, `src/app/member/_components/member-sidebar.tsx`. Leave `TierBadge` usages alone (already fixed in Step 4).

- [ ] **Step 6: Verify no code leaks + types + lint**

```bash
npm run type-check
npx eslint src/constant/tiers.ts src/lib/member.ts src/components/common/tier-badge.tsx
# No bare tier code rendered in member JSX text (allow subTierId props / logic):
grep -rn ">[^<]*\b[RB][0-9]\{1,2\}\b" src/app/member src/components/common | grep -v "subTierId" || echo "no raw code in member JSX"
```
Expected: type-check + eslint clean; grep prints `no raw code in member JSX` (or only false positives you can confirm are logic, not display).

- [ ] **Step 7: Commit**

```bash
git add src/constant/tiers.ts src/lib/member.ts src/components/common/tier-badge.tsx src/app/member src/app/account
git commit -m "feat(member): show tier marketing names (Standard/Plus/Premium/Elite) instead of codes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: `dob` in the member DTO

**Files:**
- Modify: `src/lib/api/resources/auth.ts`
- Modify: `src/lib/session-member.ts`
- Modify: `src/types/member.ts`
- Modify: `src/data/profile.ts`

**Interfaces:**
- Consumes: `GET /auth/me` now returns `dob: string | null` (ISO, e.g. `"1990-01-01T00:00:00.000Z"`; `null` for accounts without one).
- Produces: `MeResult.dob: string | null`; `MemberProfile.dob: string | null`; `MemberProfile.pay_id_email: string | null`; `getSessionIdentity()` result carries `dob`.

- [ ] **Step 1: Confirm the live shape**

```bash
BASE=https://api.smartliferewards.com.au
T=$(curl -s -X POST "$BASE/api/v1/auth/login" -H 'Content-Type: application/json' -d '{"email":"red@smartliferewards.com.au","password":"ChangeMeImmediately!1"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['access_token'])")
curl -s "$BASE/api/v1/auth/me" -H "Authorization: Bearer $T" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('dob' in d, repr(d.get('dob')))"
```
Expected: `True None` (seed has null but the field exists). A real account returns an ISO string.

- [ ] **Step 2: Add `dob` to `MeResult`**

In `src/lib/api/resources/auth.ts`, add to the `MeResult` interface (near `state`):

```ts
    state: string;
    dob: string | null;
```

- [ ] **Step 3: Carry `dob` + `pay_id_email` through the profile types**

In `src/types/member.ts`, add to `MemberProfile`:

```ts
    dob: string | null;
    pay_id_email: string | null;
```

- [ ] **Step 4: Surface `dob` from the session identity**

In `src/lib/session-member.ts`, add `dob` to whatever `getSessionIdentity()` returns (mirror how `state`/`email` are read from the session/token). If the session does not carry `dob`, `getMemberProfile` will fetch it — see Step 5. Prefer fetching in the profile data source to avoid bloating the session.

- [ ] **Step 5: Read real `dob` + placeholder `pay_id_email` in `getMemberProfile`**

In `src/data/profile.ts`, fetch `/auth/me` for the live `dob` and add the placeholder field. Add to the `PROFILE` mock: `dob: null, pay_id_email: 'payid@example.com'`. Then:

```ts
import { getMe } from '@/lib/api/resources/auth';
import { getAccessToken } from '@/lib/api/server';

export async function getMemberProfile(): Promise<MemberProfile> {
    const id = await getSessionIdentity();
    const token = await getAccessToken();
    let dob: string | null = null;
    if (token) {
        try {
            dob = (await getMe(token)).dob;
        } catch {
            dob = null; // profile still renders; dob shows "-"
        }
    }

    return {
        ...PROFILE,
        name: id.name ?? PROFILE.name,
        email: id.email ?? PROFILE.email,
        sub_tier: id.sub_tier ?? PROFILE.sub_tier,
        state: id.state ?? PROFILE.state,
        dob
    };
}
```

- [ ] **Step 6: Verify types + lint**

```bash
npm run type-check
npx eslint src/lib/api/resources/auth.ts src/types/member.ts src/data/profile.ts src/lib/session-member.ts
```
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add src/lib/api/resources/auth.ts src/types/member.ts src/data/profile.ts src/lib/session-member.ts
git commit -m "feat(member): carry dob (live /auth/me) + pay_id_email placeholder through profile DTO

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Profile page — info + edit + security

**Files:**
- Create: `src/app/member/profile/actions.ts`
- Create: `src/app/member/profile/_components/personal-info-section.tsx`
- Modify: `src/app/member/profile/page.tsx`

**Interfaces:**
- Consumes: `getMemberProfile()` (Task 2) → `MemberProfile` with `dob`, `pay_id_email`; `PATCH /api/v1/users/me` accepts `{ fullName?, phone?, state? }`.
- Produces: `updateProfileAction(input: { fullName: string; phone: string }): Promise<{ ok: true } | { ok: false; message: string }>`.

- [ ] **Step 1: Write the server action**

Create `src/app/member/profile/actions.ts`:

```ts
'use server';

import { revalidatePath } from 'next/cache';

import { API } from '@/lib/api/endpoints';
import { handleApiAuthError } from '@/lib/api/guard';
import { apiFetch } from '@/lib/api/http';
import { getAccessToken } from '@/lib/api/server';
import { ApiError } from '@/lib/api/types';

// Only name + phone are self-editable. Email and state are admin-approval-only
// (state drives the draw pool), so they are never sent here.
export async function updateProfileAction(input: {
    fullName: string;
    phone: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        await apiFetch(API.users.me, { method: 'PATCH', token, body: { fullName: input.fullName, phone: input.phone } });
        revalidatePath('/member/profile');

        return { ok: true };
    } catch (error) {
        handleApiAuthError(error);

        return { ok: false, message: error instanceof ApiError ? error.message : 'Could not update your profile.' };
    }
}
```

- [ ] **Step 2: Add the `users` endpoint namespace**

Confirm `API.users.me` exists; if not, add to `src/lib/api/endpoints.ts`:

```ts
    users: {
        me: '/api/v1/users/me',
        detail: (id: string) => `/api/v1/users/${id}`
    },
```

Run: `grep -n "users:" src/lib/api/endpoints.ts` — if present, skip; else add the block inside the `API` object.

- [ ] **Step 3: Build the personal-info section (display + edit)**

Create `src/app/member/profile/_components/personal-info-section.tsx`:

```tsx
'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatShortDate } from '@/lib/member';
import type { MemberProfile } from '@/types/member';

import { updateProfileAction } from '../actions';
import { Lock, Pencil } from 'lucide-react';
import { toast } from 'sonner';

// Placeholder = backend has no field/self-edit yet (see docs/BACKEND-ISSUES.md).
function Placeholder() {
    return (
        <span className='ml-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-amber-400 uppercase'>
            Placeholder
        </span>
    );
}

interface PersonalInfoSectionProps {
    profile: MemberProfile;
}

export function PersonalInfoSection({ profile }: PersonalInfoSectionProps) {
    const [editing, setEditing] = useState(false);
    const [pending, startTransition] = useTransition();
    const [fullName, setFullName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone ?? '');

    const save = () => {
        startTransition(async () => {
            const res = await updateProfileAction({ fullName, phone });
            if (res.ok) {
                toast.success('Profile updated.');
                setEditing(false);
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <section className='bg-slr-navy-card border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <div className='mb-4 flex items-center justify-between'>
                <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>Personal Info</h2>
                {editing ? null : (
                    <Button variant='outline' size='sm' onClick={() => setEditing(true)}>
                        <Pencil className='size-3.5' /> Edit
                    </Button>
                )}
            </div>

            <dl className='divide-y divide-white/5 text-sm'>
                <Row label='Name'>
                    {editing ? (
                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={pending} />
                    ) : (
                        <span className='text-white'>{profile.name || '-'}</span>
                    )}
                </Row>
                <Row label='Phone'>
                    {editing ? (
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={pending} />
                    ) : (
                        <span className='text-white'>{profile.phone || '-'}</span>
                    )}
                </Row>
                <Row label='Email'>
                    <span className='text-white/90'>{profile.email || '-'}</span>
                    <span className='text-slr-dim ml-2 inline-flex items-center gap-1 text-xs'>
                        <Lock className='size-3' /> admin approval
                    </span>
                </Row>
                <Row label='Address (State)'>
                    <span className='text-white/90'>{profile.state || '-'}</span>
                    <span className='text-slr-dim ml-2 inline-flex items-center gap-1 text-xs'>
                        <Lock className='size-3' /> admin approval
                    </span>
                </Row>
                <Row label='Date of Birth'>
                    <span className='text-white/90'>{profile.dob ? formatShortDate(profile.dob) : '-'}</span>
                </Row>
                <Row label='Pay-ID Email'>
                    <span className='text-white/60'>{profile.pay_id_email || '-'}</span>
                    <Placeholder />
                </Row>
            </dl>

            {editing ? (
                <div className='mt-4 flex justify-end gap-2'>
                    <Button variant='outline' onClick={() => setEditing(false)} disabled={pending}>
                        Cancel
                    </Button>
                    <Button onClick={save} disabled={pending}>
                        {pending ? 'Saving…' : 'Save changes'}
                    </Button>
                </div>
            ) : null}

            <p className='text-slr-dim mt-4 text-xs'>
                Email and state changes require admin approval — contact support to request one.
            </p>
        </section>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className='flex flex-wrap items-center justify-between gap-2 py-3'>
            <dt className='text-slr-muted'>{label}</dt>
            <dd className='flex min-w-[55%] items-center justify-end text-right'>{children}</dd>
        </div>
    );
}
```

- [ ] **Step 4: Rewrite the profile page (drop billing)**

Replace `src/app/member/profile/page.tsx` body so it composes header + personal-info + security + support only — no `MembershipSection`, no `MembershipCardDialog`:

```tsx
import type { Metadata } from 'next';

import { TierBadge } from '@/components/common/tier-badge';
import { getMemberProfile } from '@/data/profile';
import { formatShortDate } from '@/lib/member';

import { PersonalInfoSection } from './_components/personal-info-section';
import { SecuritySection } from './_components/security-section';
import { SupportLinks } from './_components/support-links';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Profile · SLR Member'
};

function initials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default async function ProfilePage() {
    const profile = await getMemberProfile();

    return (
        <div className='mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-6 md:px-6 md:py-8'>
            <header className='flex flex-col items-center gap-3 text-center'>
                <div className='bg-slr-navy-card border-slr-navy-border flex size-20 shrink-0 items-center justify-center rounded-full border text-2xl font-semibold text-white'>
                    {initials(profile.name)}
                </div>
                <div>
                    <h1 className='font-bebas-neue text-3xl leading-none tracking-wide uppercase'>{profile.name}</h1>
                    <div className='mt-2 flex flex-wrap items-center justify-center gap-2'>
                        <TierBadge subTier={profile.sub_tier} size='sm' />
                        <span className='text-slr-dim inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/3 px-2 py-0.5 text-xs font-medium'>
                            <MapPin className='size-3' /> {profile.state}
                        </span>
                    </div>
                    <p className='text-slr-dim mt-1.5 text-xs'>
                        {profile.email} · Member since {formatShortDate(profile.joined_at)}
                    </p>
                </div>
            </header>

            <PersonalInfoSection profile={profile} />

            <div className='grid gap-6 lg:grid-cols-2'>
                <SecuritySection />
                <SupportLinks />
            </div>
        </div>
    );
}
```

- [ ] **Step 5: Verify types + lint + live edit round-trip**

```bash
npm run type-check
npx eslint src/app/member/profile/actions.ts src/app/member/profile/_components/personal-info-section.tsx src/app/member/profile/page.tsx
# live PATCH round-trip on a seed account (change phone, read back, restore):
BASE=https://api.smartliferewards.com.au
T=$(curl -s -X POST "$BASE/api/v1/auth/login" -H 'Content-Type: application/json' -d '{"email":"red@smartliferewards.com.au","password":"ChangeMeImmediately!1"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['access_token'])")
curl -s -X PATCH "$BASE/api/v1/users/me" -H "Authorization: Bearer $T" -H 'Content-Type: application/json' -d '{"fullName":"SLR Red Paid Member","phone":"+61400000004"}' -w "\nHTTP %{http_code}\n"
```
Expected: type-check + eslint clean; PATCH returns HTTP 200.

- [ ] **Step 6: Commit**

```bash
git add src/app/member/profile
git commit -m "feat(member): profile page is now user info + edit + security (billing removed)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Membership page (`/member/membership`)

**Files:**
- Create: `src/app/member/membership/page.tsx`
- Create: `src/app/member/membership/_components/tier-card.tsx`
- Create: `src/app/member/membership/_components/manage-tier.tsx`
- Move: `src/app/account/actions.ts` → `src/app/member/membership/actions.ts` (git mv)
- Move: `src/app/account/_components/manage-billing-button.tsx` + `upgrade-tier-buttons.tsx` → `src/app/member/membership/_components/` (git mv)
- Reuse: `src/app/member/discounts/_components/beny-section.tsx`

**Interfaces:**
- Consumes: `getBillingStatus`, `getBillingInvoices` (`src/lib/api/resources/billing`), `getMyMembership` (`src/lib/api/resources/memberships`), `getBenyStatus` (`src/lib/api/resources/beny`), `getCurrentMember` (`src/data/member-dashboard`), `formatTierName`, `formatAud`, `formatShortDate`. `openBillingPortal` + `startTierCheckout` from the moved `actions.ts`.
- Produces: route `/member/membership` and the `<ManageTier>` component.

- [ ] **Step 1: Move the billing action + buttons into the membership route**

```bash
mkdir -p src/app/member/membership/_components
git mv src/app/account/actions.ts src/app/member/membership/actions.ts
git mv src/app/account/_components/manage-billing-button.tsx src/app/member/membership/_components/manage-billing-button.tsx
git mv src/app/account/_components/upgrade-tier-buttons.tsx src/app/member/membership/_components/upgrade-tier-buttons.tsx
```

Update the relative import in both moved buttons: they import `from '../actions'` — that path still resolves after the move (both are one level under the route). Confirm: `grep -n "from '../actions'" src/app/member/membership/_components/*.tsx`.

- [ ] **Step 2: Build the tier card**

Create `src/app/member/membership/_components/tier-card.tsx`:

```tsx
import { TierBadge } from '@/components/common/tier-badge';
import { formatAud, formatShortDate, formatTierName } from '@/lib/member';
import type { BillingStatus, SubTierCode } from '@/types/member';

const BILLING_TEXT: Record<string, string> = {
    active: 'text-emerald-400',
    grace: 'text-amber-400',
    past_due: 'text-amber-400',
    inactive: 'text-red-400',
    canceled: 'text-red-400'
};

// Static benefits shown for paid tiers (PRD §2.2 "Benefit Umum RED & BLUE").
const BENEFITS = [
    '9 Draws Weekly/Monthly',
    'Monthly bonus prize',
    'Community discounts',
    'Access to E-books (Finance & Wellbeing)',
    'Upgrade or cancel anytime'
];

interface TierCardProps {
    subTier: SubTierCode;
    priceCents: number;
    billingStatus: BillingStatus | string;
    nextRenewal?: string | null;
}

export function TierCard({ subTier, priceCents, billingStatus, nextRenewal }: TierCardProps) {
    return (
        <section className='bg-slr-navy-card border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
                <div>
                    <p className='text-slr-gold-label text-xs font-semibold tracking-widest uppercase'>Current plan</p>
                    <h2 className='font-bebas-neue mt-1 text-2xl tracking-wide text-white uppercase md:text-3xl'>
                        {formatTierName(subTier)}
                    </h2>
                    <p className='text-slr-muted mt-1 text-sm'>
                        <span className='text-gradient-gold font-semibold'>{formatAud(priceCents)}</span> / 28-day cycle ·{' '}
                        <span className={BILLING_TEXT[String(billingStatus)] ?? 'text-slr-muted'}>
                            {String(billingStatus).replace('_', ' ')}
                        </span>
                    </p>
                    {nextRenewal ? (
                        <p className='text-slr-dim mt-1 text-xs'>Next renewal {formatShortDate(nextRenewal)}</p>
                    ) : null}
                </div>
                <TierBadge subTier={subTier} />
            </div>

            <ul className='mt-4 grid gap-2 border-t border-white/5 pt-4 text-sm text-white/90 sm:grid-cols-2'>
                {BENEFITS.map((b) => (
                    <li key={b} className='flex items-center gap-2'>
                        <span className='text-slr-gold-label'>✓</span> {b}
                    </li>
                ))}
            </ul>
        </section>
    );
}
```


- [ ] **Step 3: Build the manage-tier controls**

Create `src/app/member/membership/_components/manage-tier.tsx`:

```tsx
import { UpgradeTierButtons } from './upgrade-tier-buttons';

interface ManageTierProps {
    isVisitor: boolean;
}

// Visitor → Stripe checkout (live). Paid → paid change / cancel is Ronde 3;
// shown disabled until POST /memberships/upgrade + cancel are wired.
export function ManageTier({ isVisitor }: ManageTierProps) {
    return (
        <section className='bg-slr-navy-card border-slr-navy-border rounded-2xl border p-5 md:p-6'>
            <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase md:text-2xl'>Manage Membership</h2>

            {isVisitor ? (
                <div className='mt-4'>
                    <p className='text-slr-muted mb-3 text-sm'>
                        Upgrade to unlock member draws, partner discounts and e-books. You’ll be taken to Stripe’s secure
                        checkout — no charge until you confirm.
                    </p>
                    <UpgradeTierButtons />
                </div>
            ) : (
                <div className='mt-4 space-y-3'>
                    <div className='flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/3 p-4'>
                        <span className='text-sm text-white/90'>Change plan (upgrade / downgrade)</span>
                        <span className='text-slr-dim rounded-md border border-white/10 px-2 py-1 text-xs'>
                            Coming soon
                        </span>
                    </div>
                    <div className='flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/3 p-4'>
                        <span className='text-sm text-white/90'>Cancel membership</span>
                        <span className='text-slr-dim rounded-md border border-white/10 px-2 py-1 text-xs'>
                            Coming soon
                        </span>
                    </div>
                    <p className='text-slr-dim text-xs'>
                        Plan changes and cancellation open in a later release. Use Manage Billing to update your card.
                    </p>
                </div>
            )}
        </section>
    );
}
```

- [ ] **Step 4: Build the membership page**

Create `src/app/member/membership/page.tsx`. Mirror the current `/account` page's fetch + render, plus tier card, manage-tier, and BENY. Use `getCurrentMember` for tier/visitor detection:

```tsx
import type { Metadata } from 'next';

import EmptyState from '@/components/common/empty-state';
import { BenySection } from '@/app/member/discounts/_components/beny-section';
import { getCurrentMember } from '@/data/member-dashboard';
import { handleApiAuthError } from '@/lib/api/guard';
import { type BenyStatusValue, getBenyStatus } from '@/lib/api/resources/beny';
import { type BillingInvoice, type BillingStatus, getBillingInvoices, getBillingStatus } from '@/lib/api/resources/billing';
import { type MembershipRecord, getMyMembership } from '@/lib/api/resources/memberships';
import { getAccessToken } from '@/lib/api/server';
import { formatAud, formatShortDate, subTierCodeOf, tierGroupOf } from '@/lib/member';
import { SUB_TIERS } from '@/constant/tiers';

import { ManageBillingButton } from './_components/manage-billing-button';
import { ManageTier } from './_components/manage-tier';
import { TierCard } from './_components/tier-card';
import { CreditCard, ReceiptText } from 'lucide-react';

export const metadata: Metadata = { title: 'Membership · SLR Member', robots: { index: false } };

const INVOICE_TYPE: Record<string, string> = { initial: 'Initial', renewal: 'Renewal', manual_grace: 'Grace payment' };

export default async function MembershipPage() {
    const member = await getCurrentMember();
    const subTier = subTierCodeOf(member.sub_tier);
    const isVisitor = tierGroupOf(subTier) === 'visitor';
    const token = await getAccessToken();

    let billing: BillingStatus | null = null;
    let invoices: BillingInvoice[] = [];
    let membership: MembershipRecord | null = null;
    let benyStatus: BenyStatusValue = 'inactive';

    if (token) {
        const [b, i, m, y] = await Promise.allSettled([
            getBillingStatus(token),
            getBillingInvoices(token),
            getMyMembership(token),
            getBenyStatus(token)
        ]);
        if (b.status === 'fulfilled') billing = b.value;
        else handleApiAuthError(b.reason);
        if (i.status === 'fulfilled') invoices = i.value;
        else handleApiAuthError(i.reason);
        if (m.status === 'fulfilled') membership = m.value;
        else handleApiAuthError(m.reason);
        if (y.status === 'fulfilled') benyStatus = y.value.beny_status ?? 'inactive';
        else handleApiAuthError(y.reason);
    }

    const priceCents = membership?.subTier.priceCents ?? SUB_TIERS[subTier].price_cents;

    return (
        <div className='mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-6 md:px-6 md:py-8'>
            <h1 className='font-bebas-neue text-3xl tracking-wide text-white uppercase sm:text-4xl'>Membership</h1>

            <TierCard
                subTier={subTier}
                priceCents={priceCents}
                billingStatus={billing?.billing_status ?? membership?.billingStatus ?? 'active'}
                nextRenewal={billing?.next_renewal_at ?? null}
            />

            <ManageTier isVisitor={isVisitor} />

            {/* Payment method */}
            <section className='bg-slr-navy-card border-slr-navy-border rounded-2xl border p-5 md:p-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                        <CreditCard className='text-slr-gold-label size-5' />
                        <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase'>Payment Method</h2>
                    </div>
                    <ManageBillingButton />
                </div>
                <p className='text-slr-dim mt-2 text-xs'>Update your card or cancel via Stripe’s secure billing portal.</p>
            </section>

            {/* BENY */}
            {isVisitor ? null : <BenySection status={benyStatus} />}

            {/* Payment history */}
            <section className='bg-slr-navy-card border-slr-navy-border rounded-2xl border p-5 md:p-6'>
                <div className='mb-4 flex items-center gap-2'>
                    <ReceiptText className='text-slr-gold-label size-5' />
                    <h2 className='font-bebas-neue text-xl tracking-wide text-white uppercase'>Payment History</h2>
                </div>
                {invoices.length === 0 ? (
                    <p className='text-slr-dim text-sm'>No payments yet.</p>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead>
                                <tr className='text-slr-dim border-b border-white/5 text-left text-xs uppercase'>
                                    <th className='py-2 pr-4 font-medium'>Date</th>
                                    <th className='py-2 pr-4 font-medium'>Type</th>
                                    <th className='py-2 pr-4 font-medium'>Amount</th>
                                    <th className='py-2 font-medium'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-white/5'>
                                {invoices.map((inv) => (
                                    <tr key={inv.invoice_id} className='text-white/90'>
                                        <td className='py-2.5 pr-4'>{inv.paid_at ? formatShortDate(inv.paid_at) : '-'}</td>
                                        <td className='py-2.5 pr-4'>{INVOICE_TYPE[inv.type] ?? inv.type}</td>
                                        <td className='py-2.5 pr-4 tabular-nums'>{formatAud(inv.amount_cents ?? 0)}</td>
                                        <td className='py-2.5'>
                                            <span className='font-semibold text-emerald-400'>Paid</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {!billing && !membership ? (
                <EmptyState icon={CreditCard} title='Billing Unavailable' description='Please sign in and try again.' />
            ) : null}
        </div>
    );
}
```

> Implementer notes: (1) Verify `BillingInvoice`, `BillingStatus`, `MembershipRecord` field names against the resource files before relying on them — copy exact property names. (2) `BenySection` is a client component taking `status: BenyStatusValue` — confirm its prop name. (3) If importing `BenySection` via the long path trips the linter's import order, match the project's import grouping.

- [ ] **Step 5: Verify types + lint + live render data**

```bash
npm run type-check
npx eslint src/app/member/membership
BASE=https://api.smartliferewards.com.au
T=$(curl -s -X POST "$BASE/api/v1/auth/login" -H 'Content-Type: application/json' -d '{"email":"red@smartliferewards.com.au","password":"ChangeMeImmediately!1"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['access_token'])")
for ep in billing/status billing/invoices memberships/me beny/status; do printf "%s -> " "$ep"; curl -s "$BASE/api/v1/$ep" -H "Authorization: Bearer $T" -o /dev/null -w "%{http_code}\n"; done
```
Expected: type-check + eslint clean; all four endpoints 200.

- [ ] **Step 6: Commit**

```bash
git add src/app/member/membership src/app/account
git commit -m "feat(member): dedicated /member/membership page (billing + tier + benefits + BENY)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Discounts cleanup, nav, redirect

**Files:**
- Modify: `src/app/member/discounts/page.tsx`
- Modify: `src/app/member/_components/member-nav.ts`
- Replace: `src/app/account/page.tsx`

**Interfaces:**
- Consumes: `/member/membership` (Task 4).
- Produces: `/account` → redirect; member nav gains **Membership**.

- [ ] **Step 1: Remove BENY from the discounts page**

In `src/app/member/discounts/page.tsx`: delete the `<BenySection … />` render, the `getBenyStatus` fetch, and the `BenyStatusValue` import/usage. Keep the discounts catalogue + Visitor gate untouched. The `Promise.allSettled` that fetched `[getDiscounts, getBenyStatus]` becomes a single `getDiscounts` fetch (in `try/catch` per the integration rules).

- [ ] **Step 2: Verify discounts still renders + no BENY left**

```bash
npm run type-check
npx eslint src/app/member/discounts/page.tsx
grep -n "Beny\|beny" src/app/member/discounts/page.tsx || echo "no beny in discounts page"
```
Expected: clean; grep prints `no beny in discounts page`.

- [ ] **Step 3: Add Membership to the member nav**

In `src/app/member/_components/member-nav.ts`, add the import `CreditCard` to the lucide import block, and insert before the Profile item:

```ts
    { title: 'Membership', href: '/member/membership', icon: CreditCard },
    { title: 'Profile', href: '/member/profile', icon: UserCircle }
```

- [ ] **Step 4: Replace `/account` with a redirect**

Replace the entire contents of `src/app/member/../../account/page.tsx` (`src/app/account/page.tsx`) with:

```tsx
import { redirect } from 'next/navigation';

export default function AccountPage() {
    redirect('/member/membership');
}
```

- [ ] **Step 5: Verify types + lint + redirect + nav**

```bash
npm run type-check
npx eslint src/app/account/page.tsx src/app/member/_components/member-nav.ts
grep -n "Membership" src/app/member/_components/member-nav.ts
```
Expected: clean; nav grep shows the Membership item.

- [ ] **Step 6: Commit**

```bash
git add src/app/member/discounts/page.tsx src/app/member/_components/member-nav.ts src/app/account/page.tsx
git commit -m "feat(member): remove BENY from discounts, add Membership nav, redirect /account

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Cleanup — remove orphaned billing components + doc the backend gaps

**Files:**
- Delete (if now unused): `src/app/member/profile/_components/membership-section.tsx`, `membership-card.tsx`, `membership-card-dialog.tsx`
- Modify: `docs/BACKEND-ISSUES.md`

- [ ] **Step 1: Confirm the old membership components are unreferenced**

```bash
for f in membership-section membership-card membership-card-dialog; do
  echo "== $f =="; grep -rn "$f" src/ | grep -v "profile/_components/$f.tsx"
done
```
Expected: no references outside their own files. If a component is still referenced, leave it; otherwise proceed.

- [ ] **Step 2: Delete the unreferenced components**

```bash
git rm src/app/member/profile/_components/membership-section.tsx src/app/member/profile/_components/membership-card.tsx src/app/member/profile/_components/membership-card-dialog.tsx
```

(Only the ones Step 1 proved unused. If `membership-card-dialog` is still wanted for the "digital membership card" feature, keep it and note so.)

- [ ] **Step 3: Record the backend gaps**

Append a section to `docs/BACKEND-ISSUES.md` listing the client-revision gaps: `pay_id_email` field (new column + `/users/me` read/write), member-facing email/state change-request endpoints (currently admin-only via `PATCH /users/{id}`), and the Ronde-3 paid→paid upgrade + cancel endpoints that will activate the disabled "Manage Membership" controls. Note `dob` and `address(=state)` are already resolved.

- [ ] **Step 4: Verify + commit**

```bash
npm run type-check
npx eslint src/app/member/profile
git add -A
git commit -m "chore(member): drop orphaned billing components; document account-restructure backend gaps

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** Tier naming → Task 1. Profile split + edit + dob/pay-id → Tasks 2–3. Membership page (tier/benefits/manage/invoices/payment/BENY) → Task 4. BENY relocation → Tasks 4 (add) + 5 (remove). Nav + `/account` redirect → Task 5. Backend gaps report → Task 6. All spec sections covered.
- **Type consistency:** `formatTierName(code)` defined in Task 1, consumed in Tasks 3–4. `updateProfileAction({fullName, phone})` defined + consumed in Task 3. `MeResult.dob` / `MemberProfile.dob` / `MemberProfile.pay_id_email` defined in Task 2, consumed in Task 3. Moved `openBillingPortal`/`startTierCheckout` keep their signatures (only file location changes).
- **Known verify-before-use points (flagged inline):** exact field names on `BillingInvoice`/`BillingStatus`/`MembershipRecord`, `BenySection`'s prop name, and whether `API.users.me` already exists — each has a grep/read step before use.
```
