# Discount Card Grid Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the member discount grid to the reference card layout (large white logo panel → offer pill → partner name → category → full-width gold "Claim Deal" button) in the SLR dark theme.

**Architecture:** Rewrite the presentational `DiscountCard` component and widen the grid in `DiscountsExplorer`. No DTO, API, dialog, search, or filter changes. `DiscountCard`'s root changes from a `<button>` to a `<div>` so the only interactive element is the "Claim Deal" button (avoids nested/invalid interactive elements).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, `next/image`, lucide-react, `goldButtonStyle` from `@/lib/styles`.

## Global Constraints

- Dark theme only. Reuse SLR tokens: `bg-card-dark-navy`, `border-slr-navy-border`, `text-slr-muted`, `text-slr-dim`, `bg-gold-tint`, `text-slr-gold-label`. Gold CTA uses `goldButtonStyle` from `@/lib/styles` — never re-inline the gold gradient.
- Empty/missing display field → `"-"`, never blank/`undefined`.
- The logo panel is a uniform **white** panel (`bg-white`); logo `object-contain` with padding. No per-brand color field.
- `next/image` with an explicitly sized container + `unoptimized` (CMS host; matches current usage).
- Props for `DiscountCard` stay exactly `{ discount: Discount; onSelect: (d: Discount) => void }`.
- "Claim Deal" opens the existing detail dialog via `onSelect(discount)` — no dialog changes.
- Keep the category tag; drop the featured badge from the card.
- Prettier: 4-space indent, single quotes, JSX single quotes, semicolons, width 120, trailing comma `none`. Tailwind classes auto-sorted by prettier-plugin-tailwindcss — run `npm run format` on changed files.
- No unit-test runner exists in this project. Verification gate: `npm run type-check` + `npx eslint <files>` + `npx prettier --check <files>` + `npm run build`, plus the manual check. Do NOT scaffold a test framework.

---

## File Structure

- `src/app/member/discounts/_components/discount-card.tsx` — **rewrite.** New card layout.
- `src/app/member/discounts/_components/discounts-explorer.tsx` — **modify one line.** Widen grid to `xl:grid-cols-4`.

---

## Task 1: New discount card layout + wider grid

**Files:**
- Rewrite: `src/app/member/discounts/_components/discount-card.tsx`
- Modify: `src/app/member/discounts/_components/discounts-explorer.tsx` (grid className only)

**Interfaces:**
- Consumes: `Discount` from `@/lib/api/resources/discounts` (fields used: `partner_name`, `title`, `category`, `thumbnail_url`, `discount_id`); `goldButtonStyle` from `@/lib/styles`.
- Produces: `DiscountCard({ discount, onSelect }: { discount: Discount; onSelect: (d: Discount) => void })` — signature unchanged, so `DiscountsExplorer`'s existing usage keeps working.

- [ ] **Step 1: Rewrite `discount-card.tsx`**

Replace the entire contents of `src/app/member/discounts/_components/discount-card.tsx` with:

```tsx
'use client';

import Image from 'next/image';

import { goldButtonStyle } from '@/lib/styles';
import type { Discount } from '@/lib/api/resources/discounts';

import { Tag } from 'lucide-react';

export function DiscountCard({ discount, onSelect }: { discount: Discount; onSelect: (d: Discount) => void }) {
    const initial = (discount.partner_name || discount.title || '?').charAt(0).toUpperCase();

    return (
        <div className='bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex w-full flex-col gap-3 rounded-2xl border p-4 transition-colors'>
            <div className='relative flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-white'>
                {discount.thumbnail_url ? (
                    <Image src={discount.thumbnail_url} alt='' fill unoptimized className='object-contain p-4' />
                ) : (
                    <span className='text-3xl font-bold text-slr-navy-deep'>{initial}</span>
                )}
            </div>

            <div className='border-slr-gold-label/40 bg-gold-tint rounded-lg border px-3 py-2 text-center'>
                <p className='line-clamp-2 text-sm text-white'>{discount.title || '-'}</p>
            </div>

            <p className='truncate font-semibold text-white'>{discount.partner_name || '-'}</p>

            <span className='text-slr-dim inline-flex w-fit items-center gap-1 text-xs'>
                <Tag className='size-3' /> {discount.category || '-'}
            </span>

            <button
                type='button'
                onClick={() => onSelect(discount)}
                className='mt-1 h-11 w-full rounded-xl text-sm font-bold uppercase'
                style={goldButtonStyle}>
                Claim Deal
            </button>
        </div>
    );
}
```

Notes:
- Root is now a `<div>` (was `<button>`); the only interactive element is the "Claim Deal" `<button>`.
- The `Star` import and the featured badge are removed (dropped per spec). `Tag` stays for the category.
- `line-clamp-2` keeps long offer titles from unbalancing card heights (Tailwind v4 ships `line-clamp-*`).
- `text-slr-navy-deep` gives the fallback initial dark contrast on the white panel.

- [ ] **Step 2: Widen the grid in `discounts-explorer.tsx`**

In `src/app/member/discounts/_components/discounts-explorer.tsx`, change the results grid className:

Find:
```tsx
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
```
Replace with:
```tsx
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
```

Leave everything else in the file unchanged (search, category pills, `filtered` memo, `DiscountDetailDialog` wiring, the `onSelect={setSelected}` prop).

- [ ] **Step 3: Format the changed files**

Run: `npm run format` (or `npx prettier --write` on the two files) so Tailwind classes are sorted and print-width is satisfied.

Run: `npx prettier --check "src/app/member/discounts/_components/discount-card.tsx" "src/app/member/discounts/_components/discounts-explorer.tsx"`
Expected: `All files formatted correctly`.

- [ ] **Step 4: Verify types + lint**

Run: `npm run type-check && npx eslint "src/app/member/discounts/_components/discount-card.tsx" "src/app/member/discounts/_components/discounts-explorer.tsx"`
Expected: PASS, no errors.

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: build succeeds; `/member/discounts` compiles with no type/lint errors.

- [ ] **Step 6: Manual smoke test (note if unable to run a browser)**

Run `npm run dev`, open `/member/discounts` as a RED/BLUE member:
- Cards show a white logo panel, a gold-bordered offer pill (offer text), bold partner name, category tag, and a full-width gold "Claim Deal" button.
- Clicking "Claim Deal" opens the existing detail dialog (code/terms/links).
- Grid is 4-up on wide screens, collapsing to 3 / 2 / 1 as the viewport narrows.
- A partner with no `thumbnail_url` shows its initial letter (dark) on the white panel.
- Search and category filter still work.

If no browser is available, note this as unverified in the report.

- [ ] **Step 7: Commit**

```bash
git add "src/app/member/discounts/_components/discount-card.tsx" "src/app/member/discounts/_components/discounts-explorer.tsx"
git commit -m "feat(discounts): reference-style member discount card grid"
```

---

## Self-review notes

- Spec coverage: white logo panel (Step 1), offer pill (Step 1), partner name (Step 1), category tag kept / featured badge dropped (Step 1), Claim Deal → dialog via `onSelect` (Step 1), grid `xl:grid-cols-4` (Step 2), all edge cases (`-` defaults, `line-clamp-2`, initial fallback) covered in Step 1.
- Props signature unchanged → `DiscountsExplorer` needs no wiring change beyond the grid class.
- No DTO / dialog / API changes, matching the spec's out-of-scope list.
