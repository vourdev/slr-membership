# Member Account Restructure — Design

**Date:** 2026-07-18
**Status:** Approved (design), pending implementation plan
**Origin:** Client revision (4 items) on the member account area.
**Sprint:** Ronde 2 deliverable; leaves clearly-marked slots for Ronde 3 (Stripe).

---

## 1. Problem / Client Revision

The client asked for four changes to the member-facing account area:

1. **Tier naming** — the UI shows internal codes (`R7`, `B4`). Codes should stay backend-internal; the UI should show the marketing name (Standard / Plus / Premium / Elite).
2. **Split Profile & Billing** — `/member/profile` currently mixes user info with membership/billing. Split them: Profile = pure user info (name, dob, address, email, pay-id email, phone) + security + **edit**.
3. **Membership (billing) page** — a dedicated page to manage tier (up/down/cancel), show benefits, invoice history, and payment method. The billing parts integrate with Stripe.
4. **BENY placement** — move BENY off the Discounts page (where it sits below many merchant cards and forces scrolling) onto the Membership page, so it lives next to billing management.

## 2. Current State (verified live 2026-07-18)

- `/member/profile` — mixes `MembershipSection` (billing) + `SecuritySection` + `MembershipCard` + `SupportLinks`. This is the mixing to undo.
- `/account` — an **orphan** route: a billing hub (billing status, invoice history via `GET /billing/invoices`, Manage Billing via `POST /stripe/portal`, Visitor→paid upgrade via `POST /stripe/checkout`) that lives **outside** the member sidebar shell and is **not in the member nav**.
- `/member/discounts` — the `BenySection` sits at the bottom, under the discount catalogue.
- Tier codes leak in ~10 member files. `SUB_TIERS[code].label` returns the **code** (`R4`), and there is **no marketing name in the constant** — it only comes from the API (`marketing_name`).

## 3. Decisions

- **(A) Scope:** build the restructure now (Sprint 2). Stripe-dependent controls that don't exist yet are shown **disabled + "coming soon (Ronde 3)"**, not hidden.
- **(A) Route/nav:** consolidate under `/member/*`. Billing becomes `/member/membership` inside the member shell; `/account` redirects there.
- **(A) Tier display format:** `SLR Red · Plus` (tier group + marketing name) — keeps the Red/Blue identity that matters for the draw pool, avoids the Standard/Plus/Premium collision between tiers. Badge stays tier-coloured.
- **(B) Missing fields:** build the full UI the client envisions; fields the backend lacks are filled with **dummy data + a clear placeholder label**, and reported to backend.
- **Address = `state`.** "Address" is not a new field — it reuses the existing `state`. State is **display-only** in the profile with a "request change (admin approval)" action, because state determines the draw pool and PRD forbids self-service state changes. (Same treatment as email.) So only `name` and `phone` are directly editable.

## 4. Design

### 4.1 Tier naming (cross-cutting, ~10 files)

- Add `marketingName` to `SUB_TIERS` in `src/constant/tiers.ts`:
  `R1/B1 → Standard`, `R4/B4 → Plus`, `R7/B7 → Premium`, `B10 → Elite`, `VISITOR → Visitor`.
- Add one helper `formatTierName(code): string` → `"SLR Red · Plus"` (single source of truth; visitor → `"Visitor"`).
- Replace every member-facing site that renders a raw code with the helper. Codes remain internal (session, API request bodies, `subTierId`).
- Tier badge keeps its group colour (red / blue / neutral).

### 4.2 Profile page — `/member/profile` (pure user info + edit + security)

Remove all billing/membership content. Sections:

**Personal info** (with an inline edit mode):

| Field | Source | Editable |
|---|---|---|
| Name | `full_name` | ✅ `PATCH /users/me { fullName }` |
| Phone | `phone` | ✅ `PATCH /users/me { phone }` |
| Email | `email` | 🔒 display only; "change needs admin approval" (no self-service endpoint) |
| Address (= State) | `state` | 🔒 display only; "request change (admin approval)" — state drives the draw pool, PRD forbids self-change |
| DOB | **dummy** | 📝 placeholder — data exists in DB, backend must expose it |
| Pay-ID email | **dummy** | 📝 placeholder — new field, backend must add |

- Edit uses React Hook Form + Zod, a server action wrapping `PATCH /users/me` — only `fullName` and `phone` are sent. State/email/dob/pay-id are display or placeholder.
- Email and State each show a "request change (admin approval)" affordance. There is **no member-facing endpoint** for either request today (admin changes state via `PATCH /users/{id}`), so the button routes to the existing support/contact flow until a request endpoint exists — see backend gaps.
- Placeholder fields render with a visible "Placeholder — pending backend" badge so they never look like real data, and are disabled in edit mode.

**Security section:** keep the existing `SecuritySection` (password reset flow). **Support links:** keep.

### 4.3 Membership page — `/member/membership` (new, inside member shell)

Move `/account`'s content into this route and add the new sections. Order:

1. **Active tier card** — `formatTierName` + price + billing status + renewal date. *(exists)*
2. **Membership benefits** — static per-tier benefit list (from config/PRD design-pricing benefits).
3. **Manage tier (up / down / cancel):**
   - Visitor→paid: Stripe upgrade buttons *(live — `POST /stripe/checkout`)*.
   - Paid→paid change & cancel: **disabled buttons + "coming soon (Ronde 3)"**.
4. **Invoice history** — `GET /billing/invoices`. *(exists)*
5. **Payment method** — "Manage Billing" → `POST /stripe/portal`. *(exists)*
6. **BENY** — see 4.4.

### 4.4 BENY relocation

- Remove `BenySection` from `/member/discounts`; `/member/discounts` becomes a pure discount catalogue.
- Mount the **same** `BenySection` component on `/member/membership` (status / subscribe / cancel logic unchanged — reuse, do not rewrite).

### 4.5 Nav & routes

- Member nav gains **Membership** (card icon), placed before **Profile**:
  `Dashboard · Prizes · Giveaways · Discounts · E-Books · Referral · Entry History · Membership · Profile`.
- `/account` → permanent redirect to `/member/membership`.

## 5. Units & Boundaries

- `formatTierName` / `SUB_TIERS.marketingName` — pure, no I/O; consumed everywhere a tier is shown.
- `updateProfileAction` (server action) — wraps `PATCH /users/me`; input validated by Zod; 401 → `handleApiAuthError`.
- `ProfileForm` (client) — personal-info display + edit; depends only on the action + the member DTO.
- `BenySection` — unchanged; relocated. Its actions already exist (`beny-actions.ts`).
- Membership page = a Server Component composing existing billing resources (`getBillingStatus`, `getBillingInvoices`, `getMyMembership`) + the relocated `BenySection`. One fetch pass via `Promise.allSettled` (per API-INTEGRATION rules).

## 6. Out of Scope (deferred to Ronde 3)

- Real paid→paid upgrade/downgrade (`POST /memberships/upgrade`) and cancel (`POST /subscriptions/me/cancel`) — shown disabled now.
- Any new Stripe billing surface beyond what already works (portal + Visitor→paid checkout + invoices).

## 7. Backend Gaps to Report (from this client revision)

1. **Expose `dob`** on `GET /auth/me` (or `/users/me`). Already collected at register + stored; just not returned. *(small)*
2. **Add `pay_id_email`** — new column + read/write on `/users/me`. Confirm purpose with client (likely prize payout via PayID). *(medium)*
3. **Member-facing change requests for `email` and `state`.** Both are admin-approval-only (state drives the draw pool). There is no member endpoint to *request* a change — admin edits state via `PATCH /users/{id}`. Either add a request endpoint, or confirm these go through the support/contact flow. Note the contradiction to resolve: `PATCH /users/me` currently accepts `state`, which shouldn't be self-service per PRD.
4. Paid→paid upgrade + cancel endpoints must be wired in Ronde 3 to activate the disabled controls.

**Dropped from the original list:** "Address" is no longer a backend gap — it reuses `state` (client decision 2026-07-18).

## 8. Verification

- `formatTierName` unit-covered for every sub-tier + visitor.
- Profile edit: live round-trip against `PATCH /users/me` (change name/phone, read back, restore) with a seed/test account. State/email remain display-only.
- Membership page: renders live billing for `red@`; disabled controls show the Ronde-3 note; BENY section behaves as on the old location.
- `/account` redirect resolves to `/member/membership`.
- `npm run type-check` + `npx eslint` on all touched files. No raw tier code visible anywhere in the member UI (grep check).
