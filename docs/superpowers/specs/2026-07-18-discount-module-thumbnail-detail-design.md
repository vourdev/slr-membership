# Discount Module — Thumbnail, Website, Maps + Detail Modal — Design

**Date:** 2026-07-18
**Status:** Approved (design), pending implementation plan
**Origin:** Client revision — the discount module gained new columns (thumbnail, website, maps) and a richer detail view. Backend already updated the API.
**Scope decision:** API fields only. Screenshot extras (email, phone, social, multi-category chips, multi-location "Locations" tab) are OUT — the API has no fields for them.

---

## 1. Problem / Client Revision

The discount module changed. Admin now manages these columns per discount:
merchant name, thumbnail, isFeatured, short description (offer info), long description (merchant bio + how to claim), category, copy code, website URL, maps URL.

The client supplied an LMCT+-style detail modal as a visual reference (partner logo, offer title, copy-code card, category, long description, website/maps links). We build the same shape using only the fields our API actually supports.

## 2. API State (verified live 2026-07-18)

The backend already shipped the new fields — **no backend work required**.

- `GET /api/v1/discounts/` and `GET /api/v1/discounts/{id}` now return (snake_case):
  `discount_id, title, partner_name, description, category, is_featured, code, terms, thumbnail_url, website_url, maps_url`
  (the last three are new; currently `null` for all seeded rows).
- `POST /api/v1/discounts/` and `PATCH /api/v1/discounts/{id}` accept (camelCase):
  `title` (req, ≤200), `partnerName` (req, ≤150), `category` (req, ≤100), `description`, `code`, `terms`, `isFeatured`, `isActive`, `thumbnailUrl`, `websiteUrl`, `mapsUrl`. PATCH is a partial merge.
- **`POST /api/v1/discounts/presigned-url` exists** — a dedicated presigned-upload endpoint for discount thumbnails, identical in shape to `POST /api/v1/ebooks/presigned-url` (`{ filename, contentType }` → `{ upload_url, download_url, object_key }`). Upload flow matches `docs/Panduan Lengkap Integrasi API Ebook.md` exactly (presign → raw `PUT` with matching `Content-Type`, no FormData → store `download_url`).

### Field semantics (locked from live data, no backend confirmation needed)

| Field | Meaning | Live example |
|---|---|---|
| `title` | Offer headline | `"10% off at Metro Café"` |
| `description` | **Short** desc (offer info) | `"Show your member card for 10% off any meal."` |
| `terms` | **Long** desc (merchant bio + how to claim / conditions) | `"Valid for dine-in only. Cannot be combined…"` |
| `code` | Copy code | `"METRO10"` |
| `thumbnail_url` / `website_url` / `maps_url` | New | all `null` today |

## 3. Not Supported by the API (out of scope, do not build)

Email, phone, social links (IG/FB), a **multi**-category chip array (`category` is a single string), and a multi-location "Locations" tab (`maps_url` is a single link). If the client later wants these, it's a backend addition (new columns / a locations table) — a separate feature.

## 4. Design

### 4.1 API layer (`src/lib/api/resources/discounts.ts`, `endpoints.ts`)

- Extend `Discount` (read): add `thumbnail_url: string | null`, `website_url: string | null`, `maps_url: string | null`.
- Extend `DiscountAdmin` (camelCase read): add `thumbnailUrl`, `websiteUrl`, `mapsUrl` (`string | null`).
- Extend `CreateDiscountPayload` (write): add `code?`, `terms?` (currently missing), `thumbnailUrl?`, `websiteUrl?`, `mapsUrl?`. `UpdateDiscountPayload` stays `Partial<CreateDiscountPayload>`.
- Add `discounts.presignedUrl: '/api/v1/discounts/presigned-url'` to `endpoints.ts`.

### 4.2 Shared upload utility (extract + generalize)

Both ebooks and discounts now upload via presigned URLs. Promote the ebook helpers to shared, parameterized by scope:

- Move `src/app/dashboard/(routes)/ebooks/_components/upload-asset.ts` → `src/lib/api/upload-asset.ts`.
  - Rename `uploadEbookAsset(file)` → `uploadAsset(file, scope: 'ebooks' | 'discounts')`; pick the presigned endpoint by scope (`API.ebooks.presignedUrl` vs `API.discounts.presignedUrl`). Everything else (unique filename, raw `PUT`, matching `Content-Type`, console logging) is unchanged.
  - Add a thin re-export or update the ebook call sites to `uploadAsset(file, 'ebooks')`.
- Move `ImageUploadField` → `src/components/common/image-upload-field.tsx`; add a required `scope: 'ebooks' | 'discounts'` prop, passed through to `uploadAsset`. Update the ebook form + chapter dialog imports.

### 4.3 Member catalogue card (`discount-card.tsx`)

Convert from flat (shows everything inline) to a **compact summary card**:
- Thumbnail (`thumbnail_url`; fallback = merchant-initial tile when null).
- Merchant name + offer `title`.
- **Featured** badge when `is_featured`.
- One category chip.
- The whole card is a button → opens the detail modal (4.4). Copy-code moves into the modal.
- `discounts-explorer.tsx` owns the selected-discount state and renders one modal instance.

### 4.4 Member detail modal (`discount-detail-dialog.tsx`, new)

A single-modal, two-column layout (one column on mobile), **no tabs** (only one maps link):
- **Left:** large thumbnail, merchant name, offer `title`, a **code + copy** card (Sonner toast on copy), short `description`.
- **Right:** category chip, long description (`terms`), and link rows **🌐 Website** (`website_url`) + **📍 Maps** (`maps_url`) with a chevron, opening in a new tab (`target="_blank" rel="noopener noreferrer"`). A link row is hidden when its field is `null`.
- Built on the existing shadcn `Dialog` (member dark theme). Empty display fields default to `-`; links omitted rather than shown empty.

### 4.5 Admin CRUD (`dashboard/(routes)/discounts/discounts-client.tsx`)

Extend the existing create/edit dialog + server actions:
- **Thumbnail:** `ImageUploadField scope='discounts'` (presigned upload).
- **Website URL**, **Maps URL:** URL text inputs (optional; may be blank).
- **Short description** (`description`): short textarea. **Long description** (`terms`): long textarea (merchant bio + how to claim).
- Existing fields unchanged: `title`, `partnerName` (req), `category` (req), `code`, `isFeatured`, `isActive`.
- Server actions send the new camelCase fields; PATCH partial-merge preserves unsent fields.

## 5. Units & Boundaries

- `uploadAsset(file, scope)` + `ImageUploadField` (shared) — one upload path for all admin image fields; no per-domain duplication.
- `DiscountCard` (summary) → emits `onSelect(discount)`; `DiscountsExplorer` holds selection + renders `DiscountDetailDialog`.
- `DiscountDetailDialog` — pure presentation of one `Discount`; depends only on the DTO + clipboard.
- Admin dialog reuses the shared `ImageUploadField`; its form schema (Zod) gains the new optional fields.

## 6. Verification

- `GET /discounts/` DTO round-trips the 3 new fields (live curl).
- Admin create with a thumbnail: presign → PUT (expect 200, per the resolved ebook signing-host fix) → create with `thumbnailUrl` = `download_url` → GET shows it. Restore/delete the test row.
- Member card renders thumbnail + featured badge; clicking opens the modal; copy-code toasts; null website/maps rows are hidden.
- `npm run type-check` + `npx eslint` on all touched files. No raw tier code / no `draw_pass` (N/A here). Ebook upload still works after the shared-helper move (regression check: ebook cover + chapter image).

## 7. Backend Gaps

None for the agreed scope — the API already supports every field. Out-of-scope items (email, phone, social, multi-category, multi-location) are noted in §3 for a possible future request; not filed as gaps.
