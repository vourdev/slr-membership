# SLR API — Backend Issues (frontend handoff)

Endpoints that return errors or behave against the PRD, found while integrating the member/admin frontend. Each entry lists the route with its **Smart Life Rewards API** summary title, the login account used, and a real example request + response.

- **Base URL:** `https://api.smartliferewards.com.au/api/v1`
- **Swagger:** `https://api.smartliferewards.com.au/docsx-2s3crt3-199`
- **Captured:** 2026-07-08 · **Re-verified:** 2026-07-09
- **Envelope:** every response is `{ success, message, data, meta }`.

## Authentication

All authed calls below use a Bearer token from `/auth/login`.

**`POST /api/v1/auth/login` — Login with email + password**
```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "<account>", "password": "ChangeMeImmediately!1" }
```
```json
→ 200 { "success": true, "message": "Logged in successfully.",
        "data": { "access_token": "<jwt>", "refresh_token": "…" } }
```
Then send `Authorization: Bearer <access_token>` on each request.

**Dev accounts** (all share password `ChangeMeImmediately!1`):

| Account | Role | Tier |
|---|---|---|
| `admin@smartliferewards.com.au` | admin | visitor |
| `red@smartliferewards.com.au` | member | r4 (RED) |
| `blue@smartliferewards.com.au` | member | b4 (BLUE) |
| `visitor@smartliferewards.com.au` | member | visitor |

---

## ✅ `GET /api/v1/giveaways/` — RESOLVED (was a 500 blocker)

Previously 500 `INTERNAL_ERROR` for every tier; **now returns 200** (fixed 2026-07-09). The frontend DTO + mappers were refit to the verified shape and the giveaway UI (dashboard upcoming + `/member/giveaways` list/detail) renders live.

Verified list shape: `{ giveaway_id, name, tier, type, prize, opens_at, closes_at, draws_at, is_entered, entry_status }`. Detail (`/{id}`) = the same meta + `winners[]`.

**Remaining giveaway gaps** (minor, not blocking):
- `GET /giveaways/{id}` is **incomplete vs the Notion API Contract v1.0** — the contract specifies detail returns "hadiah, **aturan (rules), TPAL cert note, entry history, past winners**", but the live response only returns meta + `winners[]`. FE fills rules/TPAL from static copy (CLAUDE.md §1) and merges `entry_status` from the list item. Implement the contract fields to make them real/editable.
- No **per-giveaway entry/pool counts** in either the list or detail payload — FE shows the member's cycle token count as "entries" and hides the community "in pool" figure. Add counts if you want them shown.

The list DTO (`GET /giveaways`) **matches the contract exactly** — no issue there.

---

## ✅ Admin tier-gate — RESOLVED (2026-07-09)

`GET /discounts/`, `GET /discounts/{id}`, and `GET /ebooks/{id}` previously returned **403 FORBIDDEN** for admin (they were tier-gated to RED/BLUE members). **All now return 200 for admin:**
- `GET /api/v1/discounts/` (admin) → **200**, lists discounts
- `GET /api/v1/discounts/{id}` (admin, real id) → **200**
- `GET /api/v1/ebooks/{id}` (admin) → **200 with `chapters`** — admin can preview content

FE benefit: the admin discounts page now populates its table (no more 403 error card), and admin edit forms can prefill from a real GET (discount + ebook).

**✅ Resolved — member discount DTO:** `GET /discounts/` and `GET /discounts/{id}` now return `code` + `terms` (verified: `code: "TRAVEL15"`, real `terms`). The member card auto-swapped its placeholders → the copy-code chip shows the **real promo code** and the real terms. **No `value_label` needed** — `title` already carries the offer text ("15% off weekend getaways"), so the FE dropped that redundant field. Nothing outstanding here.

---

## 🟡 Behavior question

### `DELETE /api/v1/beny/subscribe` — Cancel BENY subscription
Cancels an **active** subscription (verified **200** on an active member → `{ beny_status: "cancelled" }`). But a member in `pending_activation` gets **404**, so they can't cancel a request that hasn't been activated yet (the frontend hides the cancel button for pending as a workaround).

**Account:** `red@smartliferewards.com.au`
```json
active member    → 200 { "success": true, "data": { "beny_status": "cancelled" } }
pending member   → 404 { "success": false, "code": "NOT_FOUND",
                         "message": "No active BENY subscription found." }
```
**Ask:** should a `pending_activation` subscription be cancelable?

---

## ⚠️ Business-logic gaps (return 200, but off-spec per PRD)

### `POST /api/v1/beny/subscribe` — Subscribe to BENY add-on
**⏭️ Scheduled for the next sprint (Stripe billing).** Creates `pending_activation` **immediately, with no Stripe charge and no checkout URL** in the response. PRD §1 requires the flow to redirect to Stripe Checkout ($4/mo) **before** the pending record is created. The frontend calls it directly for now and marks the gap with a removable `BACKEND BLOCK` comment — remove it once the backend returns a checkout session.

**Account:** `visitor@smartliferewards.com.au` (any RED/BLUE/visitor)
```http
POST /api/v1/beny/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{ "name": "V Test", "email": "visitor@smartliferewards.com.au", "phone": "0400000000" }
```
```json
→ 200
{
  "success": true,
  "message": "BENY subscription created. Activation will be processed by admin.",
  "data": { "beny_status": "pending_activation" }
}
```
Notes: field is `name` (not `full_name`); response carries no record id. **Ask:** return a Stripe Checkout session so the $4/mo can be collected before pending.

### `POST /api/v1/memberships/change-tier` — Admin: change user's tier/sub-tier
Accepts `{ userId, subTierId }` and silently **ignores a `state` field** — but that's by design. ✅ **RESOLVED:** the draw-pool halves use two endpoints — `POST /memberships/change-tier` changes **tier/sub-tier**, and **`PATCH /users/{id}`** with `{ "state": "NSW" }` changes the **geographic state** (verified: 200 "User updated.", state persists, restored). FE **wired**: a Draw-pool state dropdown on the member-detail admin actions (`PATCH /users/{id}`).

---

## ✅ Correct behavior (not bugs — documented so they aren't re-reported)

### `GET /api/v1/giveaways/{id}` — Get detailed giveaway information
Returns a correct 404 for an unknown id — the endpoint works and the list now yields valid ids. (Its payload is still **incomplete vs the contract** — meta + `winners[]` only; see the giveaways section above.)

**Account:** `red@smartliferewards.com.au`
```json
GET /api/v1/giveaways/00000000-0000-0000-0000-000000000000
→ 404 { "success": false, "message": "Giveaway not found.", "code": "NOT_FOUND" }
```

### `GET /api/v1/ebooks/{id}` — Get ebook content and chapters if unlocked
Correct tier gate: a below-tier member or visitor gets 403 (the seed ebook is BLUE-only, so `red@` and `visitor@` both 403). The member reader renders an upgrade gate.

**Account:** `visitor@smartliferewards.com.au`
```json
→ 403 { "code": "FORBIDDEN", "message": "Upgrade membership to unlock this ebook.",
        "requestId": "019f410e-fcea-761d-b237-14d4845771d0" }
```

---

## Resolved since the last integration pass

### `GET /api/v1/admin/members` — List all members with filters and pagination
Previously returned 400 `BAD_REQUEST` for every param combination. **Now returns 200** with the member list — no frontend change needed; the members table + sub-tier stats no longer degrade.

**Account:** `admin@smartliferewards.com.au`
```json
→ 200 { "success": true, "message": "OK",
        "data": [ { "user_id": "…", "full_name": "…", "email": "…", "state": "SA",
                    "status": "active", "tier": "Premium", "billing_status": "active", … } ],
        "meta": { "page": 1, "per_page": 20, "total": 6, "total_pages": 1 } }
```

---

## ✅ `POST /api/v1/ebooks/presigned-url` — RESOLVED 2026-07-17 (was a 403 `SignatureDoesNotMatch` blocker)

**Re-verified 2026-07-17:** the presigned PUT now returns **200**, and a follow-up `GET download_url` returns **200** — the image is stored and publicly readable. The signing host was corrected on the backend; `X-Amz-SignedHeaders=host` still, but the signature now validates on `object.smartliferewards.com.au`.

Ebook **cover + chapter image upload works end-to-end**, per `docs/Panduan Lengkap Integrasi API Ebook.md` (Step A presign → Step B raw `PUT` with matching `Content-Type`, no FormData → Step C/D store `download_url`). No frontend change was needed — `uploadEbookAsset` already matched the guide.

<details>
<summary>Original report (2026-07-16) — kept for history</summary>

**Captured:** 2026-07-16 · **Account:** `superadmin@smartliferewards.com.au`

The API endpoint itself is **fine** — it returns 200 with a valid envelope:
```json
→ 200 { "success": true, "message": "Presigned upload URL generated.",
        "data": {
          "upload_url": "https://object.smartliferewards.com.au/public/ebooks/2026-07-16/<uuid>.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio_admin%2F20260716%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=…&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=…",
          "download_url": "https://object.smartliferewards.com.au/public/ebooks/2026-07-16/<uuid>.png",
          "object_key": "ebooks/2026-07-16/<uuid>.png" } }
```

**The bug is in the presign signature.** PUT-ing the file to `upload_url` (MinIO, fronted by Cloudflare) returns:
```xml
→ 403 <Error><Code>SignatureDoesNotMatch</Code>
  <Message>The request signature we calculated does not match the signature you provided.</Message>
  <BucketName>public</BucketName> …</Error>
```
Reproduced with a **bare `curl -X PUT --data-binary @file`** — no auth header, no extra headers, both **with and without** `Content-Type`. So it is **not** the frontend and **not** a Content-Type/CORS problem.

**Root cause:** `X-Amz-SignedHeaders=host` — only the `host` header is signed, yet it still mismatches on the correct public host. The presigner is signing against a **different endpoint host than the one the URL is served on** (typical MinIO-behind-proxy setup: the S3 client signs with the internal MinIO address, then the public host `object.smartliferewards.com.au` is what's presented → signature invalid).

**Backend fix:** make the S3/MinIO client presign against the **public** endpoint. For MinIO set `MINIO_SERVER_URL=https://object.smartliferewards.com.au` (and `MINIO_BROWSER_REDIRECT_URL` if used), or configure the SDK's `endpoint`/`publicEndpoint`/`forcePathStyle` so the signed host equals the public host. Also confirm the signed **region** (`ap-southeast-2`) matches the server. After the fix a plain PUT to `upload_url` must return **200**.

**Frontend status:** upload flow is fully wired (`uploadEbookAsset` → presign → PUT → store `download_url`) and correct; it will work unchanged once the presigned URL validates. Until then, cover/chapter image upload fails at the PUT step with a `Upload failed (403)` toast + console error.

</details>

---

## ⚠️ Entry calculation engine — misleading seed data; engine itself **never exercised**

**Captured:** 2026-07-17 · **Resolved as seed data 2026-07-17 (confirmed by backend)** · **Sprint 2, item 4**

> **Verdict:** the wrong token counts below are **seed-script artifacts, NOT an allocator bug**. Confirmed by backend and independently proven (see "How we know" below). **However**, that also means the allocator has **never run** in this environment — item 4 is **unverified**, not verified-working. Two asks remain: (1) re-seed to match config, (2) exercise the allocator once via a real test payment.

`GET /memberships/tiers` (the config) is **correct** and matches PRD v3.2 exactly. The seeded cycles disagree with it for **both paid tiers**:

| Account | `subTierId` | Config `token` (`/memberships/tiers`) | Engine `current_cycle.total_token` (`/entries/`) | |
|---|---|---|---|---|
| `visitor@` | visitor | 1 | 1 | ✅ |
| `red@` | **r4** | **4** | **7** | ❌ +3 |
| `blue@` | **b4** | **4** | **15** | ❌ +11 |

Everything *else* about the cycle is right — `draw_pass = 4` ✅, cycle length 28 days (`2026-07-02` → `2026-07-30`) ✅, `entry_status: active` ✅. **Only `total_token` is wrong.**

**Ruled out:**
- **Not a spin/bonus grant** — `memberships/me.pendingBonusNextCycle = 0`.
- **Not accumulation across cycles** — `GET /admin/members/{id}` returns **exactly 1 cycle** for `red@`, already holding `total_token: 7` (so it was written wrong at cycle creation, not added to over time).

**Leads:**
- `red@` is on **r4** but received **7** — which is precisely **r7's** configured token value. Looks like the allocator resolved the wrong sub-tier row at cycle creation.
- `blue@` on **b4** received **15**, which matches **no** sub-tier (b4=4, b7=7, b10=10).

### `change-tier` round-trip test (run 2026-07-17, `red@` restored)

Switched `red@` **r4 → r1** (config token = 1), re-read `/entries/`, then restored **→ r4**:

| Step | `subTierId` | `current_cycle.total_token` |
|---|---|---|
| baseline | r4 | 7 |
| after → **r1** | r1 | **7** (unchanged) |
| restored → **r4** | r4 | 7 |

**Conclusions:**
- ❌ **Additive-mutation theory is disproven** — the value never moved (would have been 8). Earlier tier-switch testing did **not** cause `blue@`'s 15.
- ✅ **`change-tier` does not touch the live cycle's tokens** — consistent with the PRD (paid→paid applies at next renewal, no proration; token/draw_pass reset on **successful renewal**). Not a bug.
- ⇒ Both wrong values were therefore **written at cycle creation**.

### How we know it's the seed script (confirmed by backend 2026-07-17)

| Evidence | Finding |
|---|---|
| `GET /billing/status` | `stripe_subscription_id: "sub_seeded_red_123"` / `"sub_seeded_blue_123"` — literal placeholders |
| `POST /stripe/portal` | `400 No such customer: 'cus_seeded_red_123'` — no real Stripe customer exists |
| `GET /billing/invoices` | **0 invoices** on both accounts — no payment ever occurred |
| UUIDv7 timestamps | `red@` user created `05:20:14.585Z`, its cycle `05:20:22.145Z` → **7.56s apart**, and `cycle_id`'s embedded time == `start_at` exactly. A checkout cannot complete that fast — this is a script inserting rows sequentially. |

⇒ The **allocator/webhook never ran** for these accounts. The 7 and 15 are hardcoded seed values.

### Consequence: the entry engine is UNVERIFIED

No cycle in this environment has ever been created by a real payment webhook (0 invoices across all seed accounts). So we have **no evidence either way** about whether the allocator reads `token` from the member's sub-tier config and resets (rather than increments) on renewal. Sprint 2 item 4 cannot be signed off on current data.

**Asks:**
1. **Re-seed `red@` / `blue@` so their cycles read 4 / 4** (match the sub-tier config). Current seed values misrepresent the product in demos/QA and — more importantly — would **mask a real allocator bug** if one exists, since wrong numbers already look "normal".
2. **Exercise the allocator once**: complete a **Stripe test checkout** (card `4242 4242 4242 4242`) → webhook creates a real cycle → assert `current_cycle.total_token` == the sub-tier's configured `token` (r4 ⇒ **4**). Until this runs once, item 4 is untested.
3. Confirm renewal **resets** `token` + `draw_pass` from config rather than incrementing (PRD: entries never accumulate across cycles).

**Verified-correct engine behaviour so far** (all consistent with PRD): cycle length exactly **28 days** (`2026-07-02` → `2026-07-30`); `draw_pass = 4` on paid tiers; visitor `draw_pass` infinite; `entry_status: active`; **no cycle allocated before payment** (a fresh unpaid r4 registration has 0 cycles); and `change-tier` does **not** mutate the live cycle's tokens (paid→paid applies at next renewal, no proration).

**Frontend status:** no FE change pending. `/member` + `/member/entry-history` source the draw-cycle surface from `entries/current_cycle` (`total_token`, `entry_status`, renewal) and never render `draw_pass`. FE deliberately does **not** fall back to `subTier.token` — `entries/` is what feeds the TPAL CSV, so showing the config value would hide discrepancies like this instead of surfacing them.

**Frontend status:** no FE change pending. `/member` + `/member/entry-history` already source the draw-cycle surface from `entries/current_cycle` (`total_token`, `entry_status`, renewal) and never render `draw_pass`. FE deliberately does **not** fall back to `subTier.token` — `entries/` is what feeds the TPAL CSV, so displaying the config value would hide this bug and mismatch the real draw. Members currently see the inflated number.

---

## 🐞 Paid registration can't reach Stripe Checkout — `register` says no OTP, but `login` demands it

**Captured:** 2026-07-17 · **Blocks:** the paid (RED/BLUE) registration checkout in `sign-up`

`POST /api/v1/stripe/checkout` **requires auth** (OpenAPI: no per-op `security` → inherits global `bearerAuth`), and the backend's own `docs/fe_stripe_guide.md` registration flow calls it right after "Review Order". But a freshly-registered paid user **cannot obtain a token**:

**1) Register a paid account → says OTP is NOT required:**
```json
POST /api/v1/auth/register
{ "full_name":"FE Test", "email":"<throwaway>", "password":"…", "state":"VIC",
  "phone":"0400000000", "dob":"1990-01-01", "tier":"red", "sub_tier":"r4" }

→ 201 { "success": true, "message": "Registration successful.",
        "data": { "user_id":"019f6e1b-…", "requires_otp": false,
                  "requires_payment": true, "spin_available": true } }
```

**2) Log in with those exact credentials → 401, demands OTP:**
```json
POST /api/v1/auth/login
{ "email":"<same>", "password":"<same>" }

→ 401 { "success": false, "code": "UNAUTHORIZED",
        "message": "Email verification is pending. Please verify your OTP to activate your account." }
```

**The contradiction:** `requires_otp: false` (and PRD/CLAUDE.md §1: *"OTP email verification is Visitor-only; paid tiers verify via Stripe (no OTP)"*) vs. login refusing to issue a token until OTP is verified. `register` also returns **no token**, so there is no other way to authenticate the new user → **`/stripe/checkout` is unreachable during registration**.

**Pick one and we'll wire it:**
1. **Let paid accounts log in unverified** (they verify via Stripe payment, per PRD) — makes `requires_otp:false` truthful; FE then does register → login → checkout.
2. **Return a session token (or the checkout URL) straight from `register`** when `requires_payment: true` — FE redirects immediately.
3. **Confirm paid signups really do need OTP** — then fix `register` to return `requires_otp: true`, and FE routes paid users through OTP first (contradicts the PRD, so needs a product decision).

**Frontend status:** the paid registration path is **still mocked** (`step-checkout.tsx` fakes the redirect); the wizard only creates accounts on the Visitor path. `POST /stripe/checkout` itself is **verified working** for an already-authenticated member (returns a real `{url, sessionId}`), and is now wired live on **`/account`** for Visitor→RED/BLUE upgrades.

> **Test data:** a throwaway paid account (`fe-test-<timestamp>@example.com`, VIC, r4) was created in production during this check and is stuck unverified — safe to purge.
