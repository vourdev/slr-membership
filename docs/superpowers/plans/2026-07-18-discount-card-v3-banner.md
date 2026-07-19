# Discount Card v3 (Banner) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans / subagent-driven-development. Checkbox steps.

**Goal:** Full-bleed banner image (object-cover, dark navy fill, bigger) at the card top; title as plain text (no pill).

**Architecture:** Rewrite the presentational `DiscountCard` only. No grid/DTO/dialog/explorer changes.

**Tech Stack:** Next.js 16, React 19, TS, Tailwind v4, next/image, lucide-react, `goldButtonStyle`.

## Global Constraints

- Banner: full-width `h-36`, `bg-slr-navy-card`, image `object-cover`; no-logo → centered gold initial.
- Card shell has NO padding + `overflow-hidden` to clip the banner to rounded corners; content wrapped in `p-4`.
- Title `discount.title` = plain text (`text-base font-semibold text-white line-clamp-2`), no border/pill.
- Description shown only when non-empty; `"-"` for empty title/partner/category.
- Props unchanged: `{ discount: Discount; onSelect: (d: Discount) => void }`.
- Prettier 4-space/single-quote/120/no-trailing-comma; run `npm run format`.
- No unit runner. Gate: type-check + eslint + prettier --check + build + manual.

---

## Task 1: Banner-layout discount card

**Files:** Modify `src/app/member/discounts/_components/discount-card.tsx`

- [ ] **Step 1: Replace file contents**

```tsx
'use client';

import Image from 'next/image';

import type { Discount } from '@/lib/api/resources/discounts';
import { goldButtonStyle } from '@/lib/styles';

import { Tag } from 'lucide-react';

export function DiscountCard({ discount, onSelect }: { discount: Discount; onSelect: (d: Discount) => void }) {
    const initial = (discount.partner_name || discount.title || '?').charAt(0).toUpperCase();

    return (
        <div className='bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex w-full flex-col overflow-hidden rounded-2xl border transition-colors'>
            <div className='bg-slr-navy-card relative flex h-36 w-full items-center justify-center'>
                {discount.thumbnail_url ? (
                    <Image src={discount.thumbnail_url} alt='' fill unoptimized className='object-cover' />
                ) : (
                    <span className='text-slr-gold-label text-4xl font-bold'>{initial}</span>
                )}
            </div>

            <div className='flex flex-col gap-2 p-4'>
                <h3 className='line-clamp-2 text-base font-semibold text-white'>{discount.title || '-'}</h3>
                <p className='text-slr-muted truncate text-sm'>{discount.partner_name || '-'}</p>

                {discount.description ? (
                    <p className='text-slr-dim line-clamp-2 text-xs'>{discount.description}</p>
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
        </div>
    );
}
```

- [ ] **Step 2:** `npm run format` → `npx prettier --check` on the file (formatted).
- [ ] **Step 3:** `npm run type-check && npx eslint <file>` (pass).
- [ ] **Step 4:** `npm run build` (succeeds).
- [ ] **Step 5:** Manual `/member/discounts` — banner fills card top, bigger; title plain; no-logo → dark banner + gold initial; description when present; Claim Deal opens dialog.
- [ ] **Step 6: Commit** `git add <file> && git commit -m "feat(discounts): full-bleed banner + plain title on discount card"`
