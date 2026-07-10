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

**Still open — member discount DTO is thin:** `GET /discounts/` and `GET /discounts/{id}` return `{ discount_id, title, partner_name, description, category, is_featured }` — no `code` / `terms` / `value_label` (those live only on the admin create/PATCH camelCase response). Expose them on the member endpoints so the discount card can show promo codes + terms. **FE is ready:** the member `Discount` DTO has optional `value_label`/`code`/`terms` and the card renders placeholders (`Member offer`, `SLR-XXXXXX`, generic terms) that **auto-swap to the real values** the moment the API returns them — no FE change needed then.

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
Creates `pending_activation` **immediately, with no Stripe charge and no checkout URL** in the response. PRD §1 requires the flow to redirect to Stripe Checkout ($4/mo) **before** the pending record is created. The frontend calls it directly for now and marks the gap with a removable `BACKEND BLOCK` comment.

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
Accepts `{ userId, subTierId }` and silently **ignores a `state` field**. There's no endpoint that moves a member's draw-pool `state`, so admins can't reassign the `state + tier` pool. **Ask:** add state support here or a dedicated endpoint.

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
