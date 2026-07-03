# SLR API Integration — Guide & Progress

Handoff doc for wiring the SLR web app to the Express backend. **Read this before adding an integration.**

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
2. Add `resources/<domain>.ts`: declare a **DTO interface for the response** (mirror the OpenAPI schema — build interfaces for EVERY response), then a function wrapped in `React.cache`:
   - Public: `export const getX = cache(() => apiFetch<X>(API.x.y, { revalidate: 3600 }))`
   - Authed: `export const getX = cache((token: string) => apiFetch<X>(API.x.y, { token, cache: 'no-store' }))`
3. Consume in a **Server Component**: `const token = await getAccessToken();` then call inside `try/catch`.
4. Catch: `catch (error) { handleApiAuthError(error); failed = true; }` — 401 force-logs-out; else falls through.
5. No data / failed → render `<EmptyState icon title description />` (`@/components/common/empty-state`).
6. Marketing pages MAY keep a static fallback (e.g. tiers); data pages show `EmptyState`.
7. **Never render `draw_pass`** — only `entry_status`. Missing display fields → `-` or omit.
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

**Ratio: 13 / 75 endpoints integrated (called from the app).**

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
| `GET /api/v1/admin/members` | `dashboard/(routes)/registrations` | live table |
| `GET /api/v1/admin/dashboard` | `dashboard/page.tsx` | ops metrics |
| `GET /api/v1/discounts/` | `member/discounts/page.tsx` | card reduced to API fields |
| `GET /api/v1/entries/` | `member/entry-history/page.tsx` | user entry history + empty states |
| `GET /api/v1/notifications/` | `member/layout.tsx` | member bell panel |

**Mapped in `endpoints.ts`, not called:** `POST /auth/refresh`, `POST /auth/logout`, `GET /memberships/me`.

### Known gaps / deferred
- **Token refresh not implemented** — access token expires → 401 → forced logout. Wire `POST /auth/refresh` into NextAuth `jwt` callback (refresh_token in session) to auto-rotate.
- **Discounts API** lacks `value_label` / promo `code` / `terms` (list + detail).
- **Dummy leftovers:** `data/discounts.ts` (`getDiscounts`, `DISCOUNTS`) orphaned; `data/member-dashboard.ts` mock; member dashboard "Featured Discounts", giveaways, entry-history, referral, billing, spin, ebooks still mock.
- `getCurrentMember()` (discounts gate) reads dummy — should use session tier.
- **Paid registration deferred** — register wizard only wires the Visitor path (register → OTP → sign-in). RED/BLUE still flow into the mock spin/checkout screens; `requires_payment`/`spin_available` flags + Stripe checkout land in the next task.
- **No auto-login after OTP** — `verify-otp` returns a session token but it's discarded; the user is sent to `/sign-in`. Wire it into NextAuth (OTP mode) later if auto-login is wanted.

### Suggested next
`memberships/me` + `giveaways/` (member dashboard) · `ebooks/` (reader) · `auth/refresh` (stop forced logouts) · admin member detail/status/tier.

---

## Full Swagger inventory

Legend: ✅ integrated (called) · 🟡 mapped, not called · ❌ not integrated

| St | Method | Path | Tag | Summary |
|---|---|---|---|---|
| ❌ | GET | `/healthz` | - |  |
| ❌ | GET | `/metrics` | - |  |
| ❌ | GET | `/api/v1/admin/beny/pending` | admin | List pending BENY subscriptions |
| ❌ | POST | `/api/v1/admin/beny/{id}/activate` | admin | Activate a pending BENY subscription |
| ❌ | POST | `/api/v1/admin/csv/generate` | admin | Generate 3 CSV files (visitor, red, blue) for draw entries |
| ❌ | GET | `/api/v1/admin/csv/history` | admin | Get CSV generation log history |
| ✅ | GET | `/api/v1/admin/dashboard` | admin | Admin dashboard overview and metrics |
| ❌ | POST | `/api/v1/admin/members/{userId}/adjust-draw-pass` | admin | Adjust active cycle draw passes |
| ❌ | PUT | `/api/v1/admin/members/{userId}/status` | admin | Update member status (ACTIVE, SUSPENDED, DEACTIVATED) |
| ❌ | PUT | `/api/v1/admin/members/{userId}/tier` | admin | Update member tier config |
| ❌ | GET | `/api/v1/admin/members/{userId}` | admin | Get detailed member profile and history |
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
| ❌ | GET | `/api/v1/beny/status` | beny | Get current user BENY status |
| ❌ | DELETE | `/api/v1/beny/subscribe` | beny | Cancel BENY subscription |
| ❌ | POST | `/api/v1/beny/subscribe` | beny | Subscribe to BENY add-on |
| ❌ | GET | `/api/v1/billing/invoices` | billing | Get billing invoice list |
| ❌ | POST | `/api/v1/billing/pay-manual` | billing | Pay manual for grace period invoice |
| ❌ | GET | `/api/v1/billing/status` | billing | Get current billing status |
| ✅ | GET | `/api/v1/discounts/` | discounts | List partner discounts (RED/BLUE only) |
| ❌ | POST | `/api/v1/discounts/` | discounts | Admin: create discount |
| ❌ | DELETE | `/api/v1/discounts/{id}` | discounts | Admin: delete discount |
| ❌ | GET | `/api/v1/discounts/{id}` | discounts | Get discount details |
| ❌ | PATCH | `/api/v1/discounts/{id}` | discounts | Admin: update discount |
| ❌ | GET | `/api/v1/ebooks/` | ebooks | List published ebooks with is_locked properties |
| ❌ | POST | `/api/v1/ebooks/` | ebooks | Admin: create ebook |
| ❌ | DELETE | `/api/v1/ebooks/{id}/chapters/{chapterId}` | ebooks | Admin: delete chapter |
| ❌ | PATCH | `/api/v1/ebooks/{id}/chapters/{chapterId}` | ebooks | Admin: update chapter |
| ❌ | POST | `/api/v1/ebooks/{id}/chapters` | ebooks | Admin: create chapter |
| ❌ | DELETE | `/api/v1/ebooks/{id}` | ebooks | Admin: delete ebook |
| ❌ | GET | `/api/v1/ebooks/{id}` | ebooks | Get ebook content and chapters if unlocked |
| ❌ | PATCH | `/api/v1/ebooks/{id}` | ebooks | Admin: update ebook |
| ✅ | GET | `/api/v1/entries/` | entries | Get my entry history grouped by billing cycles |
| ❌ | GET | `/api/v1/giveaways/` | giveaways | List active giveaways based on member tier |
| ❌ | GET | `/api/v1/giveaways/winners` | giveaways | List past giveaway winners |
| ❌ | GET | `/api/v1/giveaways/{id}` | giveaways | Get detailed giveaway information |
| ❌ | GET | `/api/v1/health/livez` | health | Liveness probe |
| ❌ | GET | `/api/v1/health/readyz` | health | Readiness probe (DB + Redis) |
| ❌ | POST | `/api/v1/memberships/change-tier` | membership | Admin: change user's tier/state |
| 🟡 | GET | `/api/v1/memberships/me` | membership | My membership |
| ❌ | GET | `/api/v1/memberships/stats` | membership | Membership counts grouped by tier+state |
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
| ❌ | PATCH | `/api/v1/users/{id}` | users | Admin: update user |

_Generated 2026-07-03. Regenerate the table from `…/docsx-2s3crt3-199/json` when the API changes._
