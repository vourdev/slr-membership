# Discount Card v2 — Design

**Date:** 2026-07-18
**Area:** Member dashboard — discount card (`src/app/member/discounts/_components/discount-card.tsx`)
**Status:** Approved (design)

## Problem

The just-shipped discount card puts every logo on a white panel. The client wants the logo shown
directly on the dark card (no white background) when a logo exists, a dark fallback box only when
there is no logo, and a short description added to the card. Category tag stays small as before.

## Decisions

- **Logo with `thumbnail_url`:** rendered `object-contain` centered directly on the dark card — **no
  background box** (no white, no panel).
- **No `thumbnail_url`:** a dark `bg-slr-navy-card` rounded box with `border-slr-navy-border` holds
  the partner initial in `text-slr-gold-label`.
- **Short description:** add `discount.description` (`text-slr-muted text-xs`, `line-clamp-2`),
  placed under the partner name. **Omitted entirely when `description` is null/empty** — a `-`
  description carries no meaning.
- **Category tag:** unchanged (small `Tag` icon + `discount.category`).
- **Everything else** (offer pill, partner name, Claim Deal button → detail dialog, grid, DTO,
  dialog, explorer search/filter) is unchanged.
- Accepted tradeoff: dark-on-transparent logos may be low-contrast on the dark card with no panel.

## Design

### Component: `DiscountCard` (edit) — `src/app/member/discounts/_components/discount-card.tsx`

Props unchanged: `{ discount: Discount; onSelect: (d: Discount) => void }`.

Structure (top → bottom):

1. **Logo area** — a fixed-height (`h-28`) flex-centered container.
   - `thumbnail_url` present → `next/image` `fill` + `object-contain p-2`, `unoptimized`, on a
     transparent container (no bg, no border).
   - `thumbnail_url` null → `bg-slr-navy-card border-slr-navy-border` rounded box, partner initial
     (`(partner_name || title || '?').charAt(0).toUpperCase()`) in `text-slr-gold-label`, large bold.
2. **Offer pill** — `discount.title || '-'`, gold-tint bordered pill, `line-clamp-2` (unchanged).
3. **Partner name** — `discount.partner_name || '-'`, bold white, `truncate`.
4. **Short description** — rendered only when `discount.description` is a non-empty string:
   `<p className='text-slr-muted line-clamp-2 text-xs'>{discount.description}</p>`.
5. **Category tag** — `Tag` icon + `discount.category || '-'`, `text-slr-dim text-xs` (unchanged).
6. **Claim Deal** — full-width gold button (`goldButtonStyle`) → `onSelect(discount)` (unchanged).

Card shell unchanged: `bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex
w-full flex-col gap-3 rounded-2xl border p-4 transition-colors`.

## Edge cases

- **No logo** → dark navy fallback box + gold initial (design point 1).
- **Null/empty `description`** → the description line is not rendered (no `-`).
- **Empty `title` / `partner_name` / `category`** → `"-"` default (project rule).
- **Long description / offer** → `line-clamp-2` on both keeps card heights aligned.

## Testing / verification

- `npm run type-check` + `npx eslint` + `npx prettier --check` on the file.
- `npm run build`.
- Manual `/member/discounts`: logos show with no white panel; a no-logo partner shows a dark box +
  gold initial; partners with a description show it under the name (others don't); category stays
  small; Claim Deal opens the dialog; grid + search + filter unchanged.

## Out of scope

- No grid, DTO, dialog, explorer, or admin-form changes.
- No per-brand panel color.
