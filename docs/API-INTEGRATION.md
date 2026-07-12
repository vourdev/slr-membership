# SLR API Integration — Guide & Progress

Handoff doc for wiring the SLR web app to the Express backend. **Read this before adding an integration.**

> **Backend error handoff:** endpoints returning errors / off-spec behavior (with example requests + responses) are collected in [BACKEND-ISSUES.md](BACKEND-ISSUES.md).

- **API base:** `https://api.smartliferewards.com.au` · prefix `/api/v1`
- **Swagger UI:** `https://api.smartliferewards.com.au/docsx-2s3crt3-199` · **OpenAPI JSON:** `…/docsx-2s3crt3-199/json`
- **Auth:** Bearer JWT (`Authorization: Bearer <access_token>`) or `slr_at` cookie
- **Response envelope (every endpoint):** `{ success, message, data, meta }` — always unwrap to `data`
- **Money:** integer cents (AUD) → divide by 100 for display
- **Env:** `NEXT_PUBLIC_API_BASE`, `AUTH_SECRET`, `NEXT_PUBLIC_ALLOW_DEV_LOGIN`

---

## The API ecosystem (`src/lib/api/`)

| File | Purpose |
|---|---|
| `types.ts` | `ApiEnvelope<T>`, `ApiError` |
| `endpoints.ts` | `API_BASE_URL` + `API` path map (one namespace per domain) |
| `http.ts` | `apiFetch<T>(path, { method, body, token, cache, revalidate, tags })` — unwraps envelope, throws `ApiError`. Server + client. |
| `server.ts` | `getAccessToken()` — session token (`server-only`) |
| `guard.ts` | `handleApiAuthError(error)` — on `401` → `redirect('/api/auth/logout')` (force logout) |
| `resources/*.ts` | Typed **DTO interfaces** + resource functions per domain (`auth`, `memberships`, `admin`, `discounts`) |

Auth: `auth.ts` (NextAuth Credentials) → `POST /auth/login` → `GET /auth/me` (name/email/state) → session carries `accessToken, refreshToken, role, tier, sub_tier, state`. Role gating in `auth.config.ts`: `admin`/`super_admin` → `/dashboard` only; `member` → `/member` + `/ebooks` only.

---

## RULES — adding an integration (follow exactly)

1. Add the path to `API` in `endpoints.ts` (domain namespace).
2. **Hit the live endpoint FIRST** (curl with a real token / throwaway account) and read the actual response body — then declare the **DTO interface off that real response**, not just the OpenAPI schema (schema can drift). Build interfaces for EVERY response. Mirror the real shape so the data is trivial to render on the frontend. Then a function wrapped in `React.cache`:
   - Public: `export const getX = cache(() => apiFetch<X>(API.x.y, { revalidate: 3600 }))`
   - Authed: `export const getX = cache((token: string) => apiFetch<X>(API.x.y, { token, cache: 'no-store' }))`
3. Consume in a **Server Component**: `const token = await getAccessToken();` then call inside `try/catch`.
4. Catch: `catch (error) { handleApiAuthError(error); failed = true; }` — 401 force-logs-out; else falls through.
5. No data / failed → render `<EmptyState icon title description />` (`@/components/common/empty-state`).
6. Marketing pages MAY keep a static fallback (e.g. tiers); data pages show `EmptyState`.
7. **Never render `draw_pass`** — only `entry_status`. **Empty/missing display field → default value, never blank/`undefined`/`null`/`NaN`:** string → `"-"`, number → `0` (money still `/100` after defaulting). Omit the field only when a `-` would be meaningless.
8. Perf: one fetch per page (no waterfalls; `Promise.all` for independent), no barrel imports, no inline components, ternary conditionals.
9. Theme: admin `.slr-admin` (gold primary), member `.slr-member`; both dark. Reuse SLR tokens.
10. Verify: `npm run type-check` + `npx eslint <files>` + curl with a real token.

### Add-a-module template
```ts
// resources/giveaways.ts
export interface Giveaway { giveaway_id: string; title: string; /* … mirror schema … */ }
export const getGiveaways = cache((token: string) =>
    apiFetch<Giveaway[]>(API.giveaways.list, { token, cache: 'no-store' }));
```

---

## Dev login (sample accounts — password `ChangeMeImmediately!1`)

| Email | Role | Tier | Lands |
|---|---|---|---|
| superadmin@smartliferewards.com.au | super_admin | visitor | /dashboard |
| admin@smartliferewards.com.au | admin | visitor | /dashboard |
| visitor@smartliferewards.com.au | member | visitor | /member |
| red@smartliferewards.com.au | member | r4 | /member |
| blue@smartliferewards.com.au | member | b4 | /member |

Dev bypass: `NEXT_PUBLIC_ALLOW_DEV_LOGIN=true` → login `SLRadmin` / `SLRadmin`.

---

## Progress — integrated

**Ratio: 34 / 75 endpoints integrated (called from the app).**

| Endpoint | Where | Notes |
|---|---|---|
| `POST /api/v1/auth/login` | `auth.ts` | NextAuth credentials |
| `GET /api/v1/auth/me` | `auth.ts` | name/email/state/tier |
| `POST /api/v1/auth/register` | `sign-up/.../register-form.tsx` | Visitor-only (paid deferred to Stripe task); returns `{user_id, requires_otp, requires_payment, spin_available}`. Dedup guard skips re-register on Back→forward |
| `POST /api/v1/auth/verify-otp` | `sign-up/.../step-otp.tsx` | Visitor OTP; 401 on bad/expired code (caught locally, no forced logout). Returned session discarded → user signs in after |
| `POST /api/v1/auth/resend-otp` | `sign-up/.../step-otp.tsx` | 30s client cooldown |
| `POST /api/v1/auth/forgot-password` | `forgot-password/page.tsx` | Reset request |
| `POST /api/v1/auth/reset-password` | `reset-password/.../reset-password-form.tsx` | Body `{reset_token, new_password}`; `reset_token` ≥20 chars server-validated. Reads `?token=` from email link |
| `GET /api/v1/memberships/tiers` | `membership/page.tsx` | live prices + EmptyState (public) |
| `GET /api/v1/admin/members` | `dashboard/(routes)/members` | live table. ✅ **now 200** (previously 400 `BAD_REQUEST` — backend fixed 2026-07-08); returns the member list + `meta` pagination. FE row-map hardened (`-` defaults) |
| `GET /api/v1/admin/dashboard` | `dashboard/page.tsx` | ops metrics. `members_by_tier` can repeat a label (r4+b4 = "Plus") → rows aggregated by label so keys stay unique |
| `GET /api/v1/giveaways/winners` | `dashboard/(routes)/winners` | admin Winners table; read-only, `-` defaults, EmptyState when none |
| `GET /api/v1/discounts/` | `member/discounts/page.tsx` | card reduced to API fields |
| `POST /api/v1/discounts/` | `dashboard/(routes)/discounts` | admin create (server action, camelCase body); returns `{id, partnerName, isFeatured, isActive, …}` |
| `DELETE /api/v1/discounts/{id}` | `dashboard/(routes)/discounts` | admin delete (server action) |
| `PATCH /api/v1/discounts/{id}` | `dashboard/(routes)/discounts` | admin edit (server action; partial merge — verified omitting `description` keeps it). Reuses the create dialog; added the missing `action` column so Edit + Delete now render |
| `GET /api/v1/admin/members/{userId}` | `dashboard/(routes)/members/[userId]` | member detail (profile/membership/subscription/cycles/wins); renders `entry_status`, never `draw_pass` |
| `PUT /api/v1/admin/members/{userId}/status` | `dashboard/(routes)/members/[userId]` | admin status update (server action). Body `{status:'ACTIVE'\|'SUSPENDED'\|'DEACTIVATED'}` (uppercase enum); returns `{user_id, status}` (lowercase). Live round-trip verified |
| `POST /api/v1/memberships/change-tier` | `dashboard/(routes)/members/[userId]` | admin tier/sub-tier update (server action, on behalf of member). Body `{userId, subTierId}` where `subTierId ∈ visitor,r1,r4,r7,b1,b4,b7,b10`; returns full membership record + nested `subTier`. Bad id → `NOT_FOUND`. Does **not** change `state` by design — use `PATCH /users/{id}` `{state}` for that (verified). Chosen over `PUT /tier` (base-tier-only) for finer control. Live cross-tier switch verified + restored |
| `GET /api/v1/memberships/stats` | `dashboard/(routes)/members` | member counts per **sub-tier**, rendered as a `SubTierStats` card above the list. ⚠️ **shape drift**: OpenAPI said "grouped by tier+state" but live returns Prisma-raw `[{ _count:{_all}, subTierId }]` grouped by **sub-tier only** (no state). Normalized → `{subTierId, count}`, present-only, canonical sort. Fetched via `Promise.allSettled` alongside `admin/members` so the list's 400 no longer blanks the card |
| `GET/POST/PATCH/DELETE /api/v1/ebooks/` | `dashboard/(routes)/ebooks` | full admin CRUD (list + create/edit/delete, server actions, camelCase body, errors surfaced) |
| `GET /api/v1/ebooks/` | `member/ebooks/page.tsx` | member library grid; server-computed `is_locked` per tier → lock badge + upgrade CTA on locked cards |
| `GET /api/v1/ebooks/{id}` | `member/ebooks/[id]` | **long-form reader (halaman baca)** — chapters → shared `<EbookReader>`. 403 (tier-locked) → in-page upgrade gate |
| `GET /api/v1/entries/` | `member/entry-history/page.tsx` · `member/page.tsx` | entry history + **member dashboard cycle card** (current_cycle → entry_status, total_token, renewal countdown) |
| `GET /api/v1/notifications/` | `member/layout.tsx` | member bell panel |
| `GET /api/v1/beny/status` | `member/discounts/page.tsx` | member BENY add-on status → `BenySection`. Enum: inactive/pending_activation/active/canceled |
| `POST /api/v1/beny/subscribe` | `member/discounts` (beny-actions) | subscribe (body `{name,email,phone}`). ⚠️ **Stripe block** — see below |
| `DELETE /api/v1/beny/subscribe` | `member/discounts` (beny-actions) | cancel. Only cancels an **active** sub — returns NOT_FOUND on `pending_activation` |
| `GET /api/v1/memberships/me` | `member/page.tsx` | dashboard summary card. Live shape == `MembershipRecord` (subTierId, billingStatus UPPERCASE, activatedAt, subTier). ⚠️ carries **no `state`** (session), no next-payment, no BENY |
| `GET /api/v1/giveaways/` | `member/page.tsx` · `member/giveaways` | upcoming + list board. ✅ **now 200** (was 500; fixed 2026-07-09). DTO verified: `{giveaway_id,name,tier,type,prize,opens_at,closes_at,draws_at,is_entered,entry_status}`. Entries-per-giveaway = member cycle tokens (API has no per-giveaway count) |
| `GET /api/v1/giveaways/{id}` | `member/giveaways/[id]` | detail (meta + `winners[]`). ⚠️ omits entry status → merged from the list item; rules/TPAL copy static (API/PRD don't supply it) |

**Mapped in `endpoints.ts`, not called:** `POST /auth/refresh`, `POST /auth/logout`.

### Known gaps / deferred
- **Token refresh not implemented** — access token expires → 401 → forced logout. Wire `POST /auth/refresh` into NextAuth `jwt` callback (refresh_token in session) to auto-rotate.
- **Discounts member DTO** (`GET /discounts/` + `/{id}`) — ✅ `code` + `terms` now returned (member card shows the real copy-code + terms). `value_label` intentionally dropped — `title` already carries the offer text, so no separate field is needed.
- ✅ **SP3 done** — admin discount **edit** (`PATCH /discounts/{id}`, partial merge) wired into `dashboard/(routes)/discounts` (reuses the create dialog; added the missing `action` column, which also revives the previously-unreachable **delete**). **Update 2026-07-09:** `GET /discounts/` + `/{id}` now return **200 for admin** (403 lifted) → the dashboard table **populates from the live list**, and edit prefill now uses a real **`getDiscount(id)`** for backend-listed rows (authoritative title/partner/category/description). `isActive` isn't exposed by list/GET, so it's sent only when known (session record) or the admin toggles it — PATCH's merge preserves the real value otherwise.
- ✅ **SP4 done (partial by design — Stripe-blocked)** — member BENY add-on flow: live `GET /beny/status` drives `BenySection`; `POST /beny/subscribe` (subscribe) + `DELETE /beny/subscribe` (cancel) wired via `member/discounts/beny-actions.ts`. `data/discounts.ts` trimmed to `BENY_CATEGORIES` (dead mock removed).
  - **🐞 BACKEND: BENY subscribe skips Stripe** — PRD §1 requires subscribe to redirect to Stripe Checkout ($4/mo) BEFORE creating the pending record. Live `POST /beny/subscribe` creates `pending_activation` **immediately, no charge, no checkout URL**. Integrated as-is; a `⚠️ BACKEND BLOCK — remove once Stripe is wired` comment marks both [beny-actions.ts](<src/app/member/discounts/beny-actions.ts>) (add the redirect here) and [beny-section.tsx](<src/app/member/discounts/_components/beny-section.tsx>) (the "redirected to secure checkout" copy). **Delete these comments once the backend returns a checkout session.**
  - **🐞 BACKEND: `DELETE /beny/subscribe` NOT_FOUND on pending** — cancel only works on an `active` sub; a `pending_activation` member can't cancel. FE hides the cancel button for pending. Confirm whether pending should be cancelable.
  - Field name is `name` (not `full_name`). Subscribe returns only `{ beny_status }` (no record id).
  - Test side effect: `red@` dev account is now `pending_activation` (subscribe worked, DELETE can't clear pending) — admin activation or a backend reset needed to restore it to `inactive`.
- **Dummy leftovers:** member **referral, billing, spin, prizes** still mock. `data/discounts.ts` trimmed to `BENY_CATEGORIES` (static marketing; `getBenyStatus`/`getDiscounts`/`DISCOUNTS` mock removed); `data/member-dashboard.ts` reduced to a session-backed `getCurrentMember`; `data/giveaways.ts` **deleted**.
- ✅ **SP1 done** — member dashboard (`/member`) + giveaways list/detail now live off `memberships/me` + `entries/` + `discounts/` + `giveaways/`. Draw-cycle surface (entry_status, tokens, renewal) sourced from `entries/` current_cycle (never `draw_pass`).
- ✅ **SP2 done** — member e-books: list (`member/ebooks`) off `GET /ebooks/` with per-tier lock badge/upgrade CTA, and the long-form reader (`member/ebooks/[id]`) off `GET /ebooks/{id}` → shared `<EbookReader>` (extracted from the public `(home)/ebooks` page; both now share it). Locked (403) → in-page upgrade gate. Chapter body split on blank lines; CMS cover images render `unoptimized` (host allowlist unknown — add to `next.config` `images.remotePatterns` if optimization wanted). `GET /ebooks/{id}` chapters CRUD (admin) still deferred.
- `getCurrentMember()` now reads the session (name/sub_tier/state) with safe defaults — no longer dummy.
- **Paid registration deferred** — register wizard only wires the Visitor path (register → OTP → sign-in). RED/BLUE still flow into the mock spin/checkout screens; `requires_payment`/`spin_available` flags + Stripe checkout land in the next task.
- **No auto-login after OTP** — `verify-otp` returns a session token but it's discarded; the user is sent to `/sign-in`. Wire it into NextAuth (OTP mode) later if auto-login is wanted.
- ✅ **RESOLVED: `GET /admin/members`** now returns 200 with the member list + `meta` pagination (was 400 `BAD_REQUEST`; backend fixed 2026-07-08). Members page + sub-tier stats no longer degrade. See [BACKEND-ISSUES.md](BACKEND-ISSUES.md).
- **Dashboard theme** — `.slr-admin` now uses the member navy palette (`#131619` base) so the dashboard matches the member area; dashboard keeps its own sidebar/shell.
- ✅ **RESOLVED 2026-07-09: admin tier-gate lifted** — `GET /discounts/`, `GET /discounts/{id}`, and `GET /ebooks/{id}` now return **200 for admin** (were all 403). The dashboard Discounts table populates from the live list; admin can GET a discount/ebook to prefill edits (FE follow-up to switch off session records). Remaining: member discount DTO now returns `code` + `terms` (✅); `value_label` dropped (redundant with `title`). Field-name mismatch stands (list snake_case, mutation camelCase). Ebooks: `PATCH` resets unsent numeric fields → FE sends the full object; chapters CRUD still deferred.

- ✅ **RESOLVED: admin state change** — the draw-pool `state` half is changed via **`PATCH /api/v1/users/{id}`** with `{ "state": "NSW" }` (verified 2026-07-10: 200 "User updated.", persists). `change-tier` handles tier/sub-tier; `PATCH /users/{id}` handles state. FE follow-up: add a state field to the member-detail admin actions off `PATCH /users/{id}` (not yet wired).

- ✅ **RESOLVED: `GET /giveaways/`** now returns 200 (was 500; fixed 2026-07-09). DTOs + mappers in `resources/giveaways.ts` refit to the verified shape; dashboard upcoming + `/member/giveaways` list/detail render live. **Remaining giveaway gaps** (not blockers): payload has **no per-giveaway entry/pool counts** (FE shows the member's cycle tokens as entries; "in pool" hidden), and **no rules/description/TPAL copy** on `/{id}` (FE uses static copy from CLAUDE.md §1 — move to payload/CMS when available). Detail also omits `entry_status`, so the FE merges it from the list item.
- **`memberships/me` shape gaps** — no `state` (session-sourced), no next-payment (derived `activatedAt + 28d` / `entries.current_cycle.end_at`), no BENY (row hidden until SP4). Also `entries.current_cycle.total_token` = 7 for the seed R4 vs PRD R4 = 4 tokens → confirm canonical token allocation.

### Suggested next
`memberships/me` + `giveaways/` (member dashboard) · `ebooks/` (reader) · `auth/refresh` (stop forced logouts) · admin member detail/status/tier.

---

## Full Swagger inventory

Legend: ✅ integrated (called) · 🟡 mapped, not called · ❌ not integrated

| St | Method | Path | Tag | Summary |
|---|---|---|---|---|
| ❌ | GET | `/healthz` | - |  |
| ❌ | GET | `/metrics` | - |  |
| ✅ | GET | `/api/v1/admin/beny/pending` | admin | List pending BENY subscriptions |
| ✅ | POST | `/api/v1/admin/beny/{id}/activate` | admin | Activate a pending BENY subscription |
| ❌ | POST | `/api/v1/admin/csv/generate` | admin | Generate 3 CSV files (visitor, red, blue) for draw entries |
| ❌ | GET | `/api/v1/admin/csv/history` | admin | Get CSV generation log history |
| ✅ | GET | `/api/v1/admin/dashboard` | admin | Admin dashboard overview and metrics |
| ❌ | POST | `/api/v1/admin/members/{userId}/adjust-draw-pass` | admin | Adjust active cycle draw passes |
| ✅ | PUT | `/api/v1/admin/members/{userId}/status` | admin | Update member status (ACTIVE, SUSPENDED, DEACTIVATED) |
| ❌ | PUT | `/api/v1/admin/members/{userId}/tier` | admin | Update member tier config (base tier only; ignores state/sub_tier — **superseded by `/memberships/change-tier`** for admin tier control) |
| ✅ | GET | `/api/v1/admin/members/{userId}` | admin | Get detailed member profile and history |
| ✅ | GET | `/api/v1/admin/members` | admin | List all members with filters and pagination |
| ❌ | GET | `/api/v1/audit/` | audit | Admin: query audit log (filter + cursor or page) |
| ✅ | POST | `/api/v1/auth/forgot-password` | auth | Request password reset email |
| ✅ | POST | `/api/v1/auth/login` | auth | Login with email + password |
| 🟡 | POST | `/api/v1/auth/logout` | auth | Logout (revokes current session) |
| ✅ | GET | `/api/v1/auth/me` | auth | Current user profile |
| 🟡 | POST | `/api/v1/auth/refresh` | auth | Rotate refresh token, get a new access token |
| ✅ | POST | `/api/v1/auth/register` | auth | Register a new user |
| ✅ | POST | `/api/v1/auth/resend-otp` | auth | Resend OTP code |
| ✅ | POST | `/api/v1/auth/reset-password` | auth | Confirm password reset with token |
| ✅ | POST | `/api/v1/auth/verify-otp` | auth | Verify OTP code |
| ✅ | GET | `/api/v1/beny/status` | beny | Get current user BENY status → `member/discounts` BenySection |
| ✅ | DELETE | `/api/v1/beny/subscribe` | beny | Cancel BENY subscription (active only; NOT_FOUND on pending) |
| ✅ | POST | `/api/v1/beny/subscribe` | beny | Subscribe to BENY add-on (⚠️ no Stripe charge — see blockers) |
| ❌ | GET | `/api/v1/billing/invoices` | billing | Get billing invoice list |
| ❌ | POST | `/api/v1/billing/pay-manual` | billing | Pay manual for grace period invoice |
| ❌ | GET | `/api/v1/billing/status` | billing | Get current billing status |
| ✅ | GET | `/api/v1/discounts/` | discounts | List partner discounts (RED/BLUE + **admin now 200**, was 403) |
| ✅ | POST | `/api/v1/discounts/` | discounts | Admin: create discount |
| ✅ | DELETE | `/api/v1/discounts/{id}` | discounts | Admin: delete discount |
| 🟡 | GET | `/api/v1/discounts/{id}` | discounts | Get discount details (`getDiscount` mapped; not called — member DTO thin. **admin now 200**, was 403) |
| ✅ | PATCH | `/api/v1/discounts/{id}` | discounts | Admin: update discount → `dashboard/(routes)/discounts` edit (partial merge) |
| ✅ | GET | `/api/v1/ebooks/` | ebooks | List published ebooks with is_locked properties |
| ✅ | POST | `/api/v1/ebooks/` | ebooks | Admin: create ebook |
| ❌ | DELETE | `/api/v1/ebooks/{id}/chapters/{chapterId}` | ebooks | Admin: delete chapter |
| ❌ | PATCH | `/api/v1/ebooks/{id}/chapters/{chapterId}` | ebooks | Admin: update chapter |
| ❌ | POST | `/api/v1/ebooks/{id}/chapters` | ebooks | Admin: create chapter |
| ✅ | DELETE | `/api/v1/ebooks/{id}` | ebooks | Admin: delete ebook |
| ✅ | GET | `/api/v1/ebooks/{id}` | ebooks | Get ebook content and chapters if unlocked → `member/ebooks/[id]` reader. Below-tier member → 403 gate; **admin now 200** (was 403; fixed 2026-07-09) |
| ✅ | PATCH | `/api/v1/ebooks/{id}` | ebooks | Admin: update ebook |
| ✅ | GET | `/api/v1/entries/` | entries | Get my entry history grouped by billing cycles |
| ✅ | GET | `/api/v1/giveaways/` | giveaways | List active giveaways based on member tier (✅ 200; DTO verified 2026-07-09) |
| ✅ | GET | `/api/v1/giveaways/winners` | giveaways | List past giveaway winners |
| ✅ | GET | `/api/v1/giveaways/{id}` | giveaways | Get detailed giveaway information (meta + winners; entry status merged from list) |
| ❌ | GET | `/api/v1/health/livez` | health | Liveness probe |
| ❌ | GET | `/api/v1/health/readyz` | health | Readiness probe (DB + Redis) |
| ✅ | POST | `/api/v1/memberships/change-tier` | membership | Admin: change user's tier/sub-tier (state NOT changed) |
| ✅ | GET | `/api/v1/memberships/me` | membership | My membership → `member/page.tsx` summary (shape == `MembershipRecord`; no state/next-payment/BENY) |
| ✅ | GET | `/api/v1/memberships/stats` | membership | Member counts grouped by **sub-tier** (NOT tier+state — OpenAPI drift) → `dashboard/(routes)/members` |
| ✅ | GET | `/api/v1/memberships/tiers` | membership | Active membership tiers |
| ❌ | DELETE | `/api/v1/memberships/upgrade` | membership | Cancel scheduled pending upgrade/downgrade |
| ❌ | POST | `/api/v1/memberships/upgrade` | membership | Upgrade or downgrade membership tier (Paid -> Paid scheduling) |
| ✅ | GET | `/api/v1/notifications/` | notifications | Get my in-app notifications |
| ❌ | GET | `/api/v1/notifications/admin/logs` | notifications | Admin: list sent notification delivery logs |
| ❌ | POST | `/api/v1/notifications/admin/send` | notifications | Admin: send manual email notification |
| ✅ | PUT | `/api/v1/notifications/{id}/read` | notifications | Mark notification as read |
| ❌ | GET | `/api/v1/payments/` | payments | Admin: list payments |
| ❌ | GET | `/api/v1/payments/me` | payments | My payments/invoice list |
| ❌ | GET | `/api/v1/payments/{id}` | payments | Admin: payment detail |
| ❌ | GET | `/api/v1/referral/` | referral | Get referral details and reward history |
| ❌ | POST | `/api/v1/referral/validate` | referral | Validate referral code before submission |
| ❌ | POST | `/api/v1/spin/execute` | spin | Spin the wheel (one-time or pre-renewal) |
| ❌ | GET | `/api/v1/spin/status` | spin | Check spin wheel status and availability |
| ❌ | POST | `/api/v1/stripe/checkout` | stripe | Create Stripe Checkout session for a tier |
| ❌ | POST | `/api/v1/stripe/portal` | stripe | Create Stripe Billing Portal session |
| ❌ | POST | `/api/v1/webhooks/stripe/` | stripe | Stripe webhook (signature-verified, raw body) |
| ❌ | GET | `/api/v1/subscriptions/` | subscriptions | Admin: list subscriptions |
| ❌ | POST | `/api/v1/subscriptions/me/cancel` | subscriptions | Cancel my subscription at period end |
| ❌ | GET | `/api/v1/subscriptions/me` | subscriptions | My subscriptions |
| ❌ | GET | `/api/v1/subscriptions/{id}` | subscriptions | Admin: subscription detail |
| ❌ | GET | `/api/v1/users/` | users | Admin: list users (filter/sort/search/cursor) |
| ❌ | PATCH | `/api/v1/users/me` | users | Update my profile |
| ❌ | GET | `/api/v1/users/{id}` | users | Read one user (self or admin) |
| ❌ | PATCH | `/api/v1/users/{id}` | users | Admin: update user — **use for member `state` change** (`{state}`, verified); FE not yet wired |

_Generated 2026-07-03. Regenerate the table from `…/docsx-2s3crt3-199/json` when the API changes._
