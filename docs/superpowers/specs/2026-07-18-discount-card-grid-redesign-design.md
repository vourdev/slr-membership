# Discount Card Grid Redesign — Design

**Date:** 2026-07-18
**Area:** Member dashboard — discount module (`src/app/member/discounts`)
**Status:** Approved (design)

## Problem

The member discount grid currently renders compact dark cards (small logo top-left, partner
name, offer title, category tag) where the whole card is a button opening a detail dialog. The
client wants the richer card layout from a reference screenshot: a prominent brand logo panel, the
offer in a bordered pill, the partner name, and an explicit "Claim Deal" button — rendered in the
SLR dark theme rather than the reference's light theme.

## Reference layout (adapted)

Each card, top → bottom: large logo panel → offer pill → partner name → full-width "Claim Deal"
button, in a responsive multi-column grid (4-up on wide screens).

## Decisions

- **Logo panel:** a uniform **white** rounded panel inside the dark card. We store only one
  `thumbnail_url` per partner and no brand-color field; a white panel is closest to the reference
  and keeps logos (designed for light backgrounds) legible. No per-brand color field is added.
- **"Claim Deal" action:** opens the existing `DiscountDetailDialog` (code reveal + terms +
  website/maps). No behavior change to the dialog.
- **Card elements kept:** the **category tag** stays. The **featured badge is dropped** from the
  card (the reference has no badge; `is_featured` still drives ordering upstream if any, unchanged).
- **Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` (current caps at 3).
- **No DTO / API / backend changes.** `Discount` shape is untouched.

## Design

### Component: `DiscountCard` (rewrite) — `src/app/member/discounts/_components/discount-card.tsx`

Change the root from a `<button>` to a `<div>`. Rationale: the reference makes "Claim Deal" the
action; keeping the whole card a button AND nesting a button inside is invalid/ inaccessible. The
only interactive element becomes the CTA.

Props unchanged: `{ discount: Discount; onSelect: (d: Discount) => void }`.

Structure (top → bottom):

1. **Logo panel** — full-width `bg-white` rounded panel, fixed height (`h-28`), logo via
   `next/image` `fill` + `object-contain p-4`, `unoptimized` (CMS host, matches current). When
   `thumbnail_url` is null, show the partner initial (`(partner_name || title || '?').charAt(0)`)
   in dark text centered on the white panel.
2. **Offer pill** — `discount.title` centered inside a rounded pill with a gold-tint border
   (`border border-slr-gold-label/40 bg-gold-tint text-white`), small text, `line-clamp-2` so long
   offers don't blow out card height. Falls back to `"-"` when title is empty.
3. **Partner name** — `discount.partner_name || '-'`, bold white, left-aligned, `truncate`.
4. **Category tag** — `Tag` icon + `discount.category || '-'`, muted, small.
5. **Claim Deal button** — full-width `<button type='button'>` styled with `goldButtonStyle` from
   `@/lib/styles`, uppercase bold, `onClick={() => onSelect(discount)}`. Label: "Claim Deal".

Card container: `bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex
w-full flex-col gap-3 rounded-2xl border p-4 transition-colors`.

### Component: `DiscountsExplorer` (minor) — `src/app/member/discounts/_components/discounts-explorer.tsx`

Only the grid className changes:
`grid gap-4 sm:grid-cols-2 lg:grid-cols-3` → `grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.

Everything else (search, category pills, `filtered` memo, dialog wiring) is unchanged. `onSelect`
remains the stable `setSelected` reference.

## react-best-practices at implementation

- `DiscountCard` stays a top-level component — no inline component definitions (`rerender-no-inline-components`).
- List keyed by `discount.discount_id` (unchanged).
- `onSelect` passed as the stable `setSelected`; the per-item arrow only binds the required
  argument — no extra memoization needed for a list of this size (`rerender-simple-expression-in-memo`:
  don't over-memoize).
- `next/image` with an explicitly sized container.

## Edge cases

- **Missing `thumbnail_url`** → initial-letter fallback on the white panel (dark text).
- **Empty `title` / `partner_name` / `category`** → `"-"` default (project rule: never blank).
- **Long offer text** → `line-clamp-2` in the pill keeps card heights aligned in the grid.
- **Logo aspect ratios vary** → `object-contain` + padding centers any logo without distortion.

## Testing / verification

- `npm run type-check` + `npx eslint` on both changed files.
- `npm run build`.
- Manual: view `/member/discounts` — cards render in the new layout with white logo panels, offer
  pills, gold Claim Deal buttons; clicking Claim Deal opens the detail dialog; 4-up on wide,
  responsive down to 1 column; missing-logo partners show the initial fallback; category filter +
  search still work.

## Out of scope

- No per-brand panel color field (would need backend DTO + admin form).
- No changes to `DiscountDetailDialog`, the BENY section, search, or category filtering.
- No admin-side discount form changes.
