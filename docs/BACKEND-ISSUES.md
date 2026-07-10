# SLR API — Backend Issues (frontend handoff)

Endpoints that return errors or behave against the PRD, found while integrating the member/admin frontend. Each entry lists the route with its **Smart Life Rewards API** summary title, the login account used, and a real example request + response.

- **Base URL:** `https://api.smartliferewards.com.au/api/v1`
- **Swagger:** `https://api.smartliferewards.com.au/docsx-2s3crt3-199`
- **Captured:** 2026-07-08
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

## 🟠 Admin blocked by member-only tier gate

These are tier-gated to RED/BLUE members, so **admin/super_admin get 403** and can't use the admin tooling. Ask: exempt admin/super_admin from the tier gate, or add admin-list / admin-read variants.

### `GET /api/v1/discounts/` — List partner discounts (RED/BLUE only)
Admin dashboard can't list existing discounts (create/edit/delete by id still work, but no rows show).

**Account:** `admin@smartliferewards.com.au`
```http
GET /api/v1/discounts/
Authorization: Bearer <admin@ token>
```
```json
→ 403
{
  "success": false,
  "message": "Upgrade membership to unlock this benefit.",
  "code": "FORBIDDEN",
  "requestId": "019f410c-617b-71c8-b8d6-c41f454a9f01"
}
```

### `GET /api/v1/discounts/{id}` — Get discount details
Same gate → admin can't fetch a single discount to prefill the edit form.

**Account:** `admin@smartliferewards.com.au`
```http
GET /api/v1/discounts/019f2145-6f0d-7018-89d8-a00bc182246d
Authorization: Bearer <admin@ token>
```
```json
→ 403
{
  "success": false,
  "message": "Upgrade membership to unlock this benefit.",
  "code": "FORBIDDEN",
  "requestId": "019f410c-62e6-71d1-9e53-cd3e22bf891c"
}
```
Also note: the member response for this route is thin (`{ discount_id, title, partner_name, description, category, is_featured }`) — it omits `code` / `terms` / `value_label`, which exist only on the admin create/PATCH response. The member endpoints should expose those.

### `GET /api/v1/ebooks/{id}` — Get ebook content and chapters if unlocked
Admin can't preview ebook content.

**Account:** `admin@smartliferewards.com.au`
```http
GET /api/v1/ebooks/019f2145-7c8d-7354-b8d0-63fd3213e56f
Authorization: Bearer <admin@ token>
```
```json
→ 403
{
  "success": false,
  "message": "Upgrade membership to unlock this ebook.",
  "code": "FORBIDDEN",
  "requestId": "019f410d-2758-7563-8f1b-1339f4dbcf3b"
}
```

---

## 🟡 Behavior question

### `DELETE /api/v1/beny/subscribe` — Cancel BENY subscription
Only cancels an **active** subscription. A member in `pending_activation` gets 404, so they can't cancel a request that hasn't been activated yet (the frontend hides the cancel button for pending as a workaround).

**Account:** `red@smartliferewards.com.au` (currently `pending_activation`)
```http
DELETE /api/v1/beny/subscribe
Authorization: Bearer <red@ token>
```
```json
→ 404
{
  "success": false,
  "message": "No active BENY subscription found.",
  "code": "NOT_FOUND",
  "requestId": "019f410d-2c88-772a-a2bc-b82f766f33a8"
}
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
Returns a correct 404 for an unknown id — the endpoint itself works; it's only unusable right now because the list (above) 500s and yields no valid id.

**Account:** `red@smartliferewards.com.au`
```http
GET /api/v1/giveaways/00000000-0000-0000-0000-000000000000
Authorization: Bearer <red@ token>
```
```json
→ 404 { "success": false, "message": "Giveaway not found.", "code": "NOT_FOUND",
        "requestId": "019f410c-5cc7-727a-938b-ef8ee367f81f" }
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
