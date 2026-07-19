# Discount Card v3 (Banner Layout) — Design

**Date:** 2026-07-18
**Area:** Member dashboard — discount card (`src/app/member/discounts/_components/discount-card.tsx`)
**Status:** Approved (design)

## Problem

The v2 card renders the logo small and contained inside the card padding, and puts the offer text
(`discount.title`) inside a gold-bordered pill that reads as a badge, not a title. The client wants:
(1) the image as a full-bleed **banner** at the top of the card, (2) the image **much bigger**, and
(3) the title as **plain text**, not inside a border.

## Decisions

- **Banner:** the image becomes a full-width, edge-to-edge banner at the card top.
  - Fit: **`object-cover`** (fills the banner, cropping overflow) — matches the reference, which uses
    logo+brand-background tiles.
  - Fill: **`bg-slr-navy-card`** (dark navy) behind/around the image and for the no-logo fallback.
  - Height: `h-36`.
- **Title:** `discount.title` becomes plain prominent text (`text-base font-semibold text-white`,
  `line-clamp-2`) — the gold-bordered pill is removed.
- **Everything else** (partner name, short description, small category tag, gold Claim Deal button →
  detail dialog, grid, DTO, dialog, explorer) unchanged in behavior.
- Accepted tradeoff: `object-cover` assumes admins upload proper brand tiles; a bare transparent
  logo may crop/scale oddly — fixed by the uploaded image, not the card.

## Design

### Component: `DiscountCard` (rewrite) — `src/app/member/discounts/_components/discount-card.tsx`

Props unchanged: `{ discount: Discount; onSelect: (d: Discount) => void }`.

Card shell: `bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex w-full
flex-col overflow-hidden rounded-2xl border transition-colors`. **No root padding** —
`overflow-hidden` clips the banner to the rounded corners.

1. **Banner** — `relative h-36 w-full bg-slr-navy-card`:
   - `thumbnail_url` present → `next/image` `fill` + `object-cover`, `unoptimized`.
   - `thumbnail_url` null → centered partner initial (`(partner_name || title || '?').charAt(0)`),
     `text-slr-gold-label text-4xl font-bold`.
2. **Content** — `flex flex-col gap-2 p-4`:
   - **Title** — `discount.title || '-'`, `text-base font-semibold text-white line-clamp-2`.
   - **Partner name** — `discount.partner_name || '-'`, `text-sm text-slr-muted truncate`.
   - **Short description** — rendered only when `discount.description` is non-empty:
     `text-xs text-slr-dim line-clamp-2`.
   - **Category** — `Tag` icon + `discount.category || '-'`, `text-slr-dim text-xs`.
   - **Claim Deal** — full-width gold button (`goldButtonStyle`) → `onSelect(discount)`.

## Edge cases

- **No logo** → dark navy banner + large gold initial.
- **Null/empty `description`** → description line not rendered.
- **Empty `title` / `partner_name` / `category`** → `"-"`.
- **Long title / description** → `line-clamp-2` keeps card heights aligned.

## Testing / verification

- `npm run type-check` + `npx eslint` + `npx prettier --check` on the file.
- `npm run build`.
- Manual `/member/discounts`: image is a full-width banner filling the card top (bigger); title is
  plain text (no pill/border); no-logo partners show a dark banner + gold initial; description shows
  when present; category small; Claim Deal opens the dialog; grid/search/filter unchanged.

## Out of scope

- No grid, DTO, dialog, explorer, or admin-form changes.
- No per-brand banner color field.
