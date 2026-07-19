# Discount Card v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Show discount logos directly on the dark card (no white panel), use a dark fallback box only when there is no logo, and add a short description to the card.

**Architecture:** Edit only the presentational `DiscountCard`. No grid, DTO, dialog, or explorer changes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, `next/image`, lucide-react, `goldButtonStyle`.

## Global Constraints

- Dark theme tokens only: `bg-card-dark-navy`, `bg-slr-navy-card`, `border-slr-navy-border`, `text-slr-muted`, `text-slr-dim`, `text-slr-gold-label`, `bg-gold-tint`. Gold CTA uses `goldButtonStyle` from `@/lib/styles`.
- Logo WITH `thumbnail_url` → no background box (transparent). Logo WITHOUT → dark `bg-slr-navy-card` box + gold initial.
- Short description rendered only when `discount.description` is a non-empty string (no `-` placeholder).
- Empty `title` / `partner_name` / `category` → `"-"`.
- Props unchanged: `{ discount: Discount; onSelect: (d: Discount) => void }`.
- Prettier: 4-space indent, single quotes, JSX single quotes, semicolons, width 120, trailing comma `none`, Tailwind classes sorted — run `npm run format`.
- No unit-test runner. Gate: `npm run type-check` + `npx eslint` + `npx prettier --check` + `npm run build` + manual.

---

## Task 1: Discount card v2

**Files:**
- Modify: `src/app/member/discounts/_components/discount-card.tsx`

**Interfaces:**
- Consumes: `Discount` (fields `partner_name`, `title`, `description`, `category`, `thumbnail_url`), `goldButtonStyle`.
- Produces: `DiscountCard` — signature unchanged.

- [ ] **Step 1: Replace `discount-card.tsx` contents**

```tsx
'use client';

import Image from 'next/image';

import type { Discount } from '@/lib/api/resources/discounts';
import { goldButtonStyle } from '@/lib/styles';

import { Tag } from 'lucide-react';

export function DiscountCard({ discount, onSelect }: { discount: Discount; onSelect: (d: Discount) => void }) {
    const initial = (discount.partner_name || discount.title || '?').charAt(0).toUpperCase();

    return (
        <div className='bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex w-full flex-col gap-3 rounded-2xl border p-4 transition-colors'>
            {discount.thumbnail_url ? (
                <div className='relative flex h-28 w-full items-center justify-center'>
                    <Image src={discount.thumbnail_url} alt='' fill unoptimized className='object-contain p-2' />
                </div>
            ) : (
                <div className='bg-slr-navy-card border-slr-navy-border flex h-28 w-full items-center justify-center rounded-xl border'>
                    <span className='text-slr-gold-label text-3xl font-bold'>{initial}</span>
                </div>
            )}

            <div className='border-slr-gold-label/40 bg-gold-tint rounded-lg border px-3 py-2 text-center'>
                <p className='line-clamp-2 text-sm text-white'>{discount.title || '-'}</p>
            </div>

            <p className='truncate font-semibold text-white'>{discount.partner_name || '-'}</p>

            {discount.description ? (
                <p className='text-slr-muted line-clamp-2 text-xs'>{discount.description}</p>
            ) : null}

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

Changes vs current: white logo panel replaced by a transparent container (has-logo) / dark navy box + gold initial (no-logo); a short-description `<p>` added under the partner name (rendered only when present). Offer pill, category, and Claim Deal button unchanged.

- [ ] **Step 2: Format**

Run: `npm run format`
Then: `npx prettier --check "src/app/member/discounts/_components/discount-card.tsx"` → `All files formatted correctly`.

- [ ] **Step 3: Type-check + lint**

Run: `npm run type-check && npx eslint "src/app/member/discounts/_components/discount-card.tsx"`
Expected: PASS.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Manual smoke test (note if no browser)**

`/member/discounts`: logos render with no white panel; a no-logo partner shows a dark navy box + gold initial; partners with a description show it under the name (others omit it); category small; Claim Deal opens the dialog.

- [ ] **Step 6: Commit**

```bash
git add "src/app/member/discounts/_components/discount-card.tsx"
git commit -m "feat(discounts): logo on dark card + short description on discount card"
```
