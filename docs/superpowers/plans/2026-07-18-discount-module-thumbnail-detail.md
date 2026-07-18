# Discount Module — Thumbnail, Website, Maps + Detail Modal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add thumbnail/website/maps to discounts — member catalogue gets compact cards + a detail modal; admin CRUD gets thumbnail upload (shared presigned helper) + website/maps + short/long description.

**Architecture:** Frontend-only; the API already supports every field (verified live). Extend the discount DTOs, generalize the ebook presigned-upload helper so both ebooks and discounts share it (via an injected uploader function, not a scope enum), rebuild the member card into a summary + detail dialog, and extend the admin dialog.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn/ui (`Dialog`, `Form`, `Input`, `Textarea`, `Switch`), React Hook Form + Zod, Sonner, `next/image`.

## Global Constraints

- **Verification (no unit-test runner):** each task ends with `npm run type-check` + `npx eslint <touched files>`, plus a live `curl` where an endpoint is involved (admin login `admin@smartliferewards.com.au`, member `red@smartliferewards.com.au`, password `ChangeMeImmediately!1`; base `https://api.smartliferewards.com.au/api/v1`). Restore/delete any test row created.
- **Money not involved here.** `draw_pass` never rendered (N/A).
- **Upload flow = the ebook flow** (`docs/Panduan Lengkap Integrasi API Ebook.md`): presign `{filename, contentType}` → **raw `PUT`** to `upload_url` with matching `Content-Type` (NOT FormData) → store `download_url`. Unique filename per upload.
- **Empty/missing display field → `-`;** links (`website_url`/`maps_url`) are **omitted** when null, not shown empty.
- **No waterfalls:** the member discounts page already does one `getDiscounts` fetch; do not add a second. `DiscountsExplorer` holds modal state (no per-card fetch).
- **`rerender-no-inline-components`:** do not define components inside components. The detail dialog is its own file.
- **Prettier:** 4-space indent, single quotes, JSX single quotes, semicolons, width 120, trailing comma `none`. If `eslint --fix` leaves an unindented `return` after a blank line, fix manually.
- **Member surfaces** are dark theme (`bg-card-dark-navy`, `border-slr-navy-border`, `text-slr-muted`, `text-slr-dim`, `text-slr-gold-label`, `bg-gold-tint`). **Admin dialog** uses `dashboard-theme dark` on `DialogContent` (already present).
- **Field semantics (verbatim):** `title` = offer headline; `description` = SHORT desc; `terms` = LONG desc (merchant bio + how to claim); `code` = copy code.

---

## File Structure

**Task 1 — API layer**
- Modify: `src/lib/api/endpoints.ts` (add `discounts.presignedUrl`)
- Modify: `src/lib/api/resources/discounts.ts` (extend DTOs + `getDiscountPresignedUrl`)
- Modify: `src/app/dashboard/(routes)/discounts/actions.ts` (add `getDiscountPresignedUrlAction`)

**Task 2 — Shared upload helper + move ImageUploadField**
- Create: `src/lib/api/upload-asset.ts` (`uploadViaPresign`)
- Create: `src/components/common/image-upload-field.tsx` (moved; `onUpload` prop)
- Modify: `src/app/dashboard/(routes)/ebooks/_components/upload-asset.ts` (`uploadEbookAsset` → thin wrapper)
- Create: `src/app/dashboard/(routes)/discounts/upload-asset.ts` (`uploadDiscountAsset`)
- Modify: `src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx`, `chapter-dialog.tsx` (import moved field + `onUpload`)
- Delete: `src/app/dashboard/(routes)/ebooks/_components/image-upload-field.tsx` (moved)

**Task 3 — Member card + detail modal**
- Rewrite: `src/app/member/discounts/_components/discount-card.tsx` (compact summary)
- Create: `src/app/member/discounts/_components/discount-detail-dialog.tsx`
- Modify: `src/app/member/discounts/_components/discounts-explorer.tsx` (selection + modal)

**Task 4 — Admin CRUD**
- Modify: `src/app/dashboard/(routes)/discounts/discounts-client.tsx` (schema + form fields + payload + prefill)

---

## Task 1: API layer — DTOs, endpoint, presigned action

**Files:**
- Modify: `src/lib/api/endpoints.ts`
- Modify: `src/lib/api/resources/discounts.ts`
- Modify: `src/app/dashboard/(routes)/discounts/actions.ts`

**Interfaces produced (later tasks depend on these):**
- `Discount` gains `thumbnail_url`, `website_url`, `maps_url` (`string | null`).
- `DiscountAdmin` gains `thumbnailUrl`, `websiteUrl`, `mapsUrl` (`string | null`).
- `CreateDiscountPayload` gains `code?`, `terms?`, `thumbnailUrl?`, `websiteUrl?`, `mapsUrl?` (all `string`).
- `getDiscountPresignedUrl(token, { filename, contentType })` → `PresignedUrlResponse` (`{ upload_url, download_url, object_key }`).
- `getDiscountPresignedUrlAction(filename, contentType)` → `ActionResult<PresignedUrlResponse>`.

- [ ] **Step 1: Confirm the live shape**

```bash
BASE=https://api.smartliferewards.com.au
T=$(curl -s -X POST "$BASE/api/v1/auth/login" -H 'Content-Type: application/json' -d '{"email":"admin@smartliferewards.com.au","password":"ChangeMeImmediately!1"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['access_token'])")
curl -s "$BASE/api/v1/discounts/" -H "Authorization: Bearer $T" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print(list(d[0].keys()) if d else 'empty')"
```
Expected: keys include `thumbnail_url`, `website_url`, `maps_url`.

- [ ] **Step 2: Add the presigned endpoint**

In `src/lib/api/endpoints.ts`, inside the `discounts` object:

```ts
    discounts: {
        list: '/api/v1/discounts/',
        create: '/api/v1/discounts/',
        detail: (id: string) => `/api/v1/discounts/${id}`,
        update: (id: string) => `/api/v1/discounts/${id}`,
        remove: (id: string) => `/api/v1/discounts/${id}`,
        presignedUrl: '/api/v1/discounts/presigned-url'
    },
```

- [ ] **Step 3: Extend the DTOs + add the presigned resource**

In `src/lib/api/resources/discounts.ts`:

Add to `Discount`:
```ts
    thumbnail_url: string | null;
    website_url: string | null;
    maps_url: string | null;
```
Add to `DiscountAdmin`:
```ts
    thumbnailUrl: string | null;
    websiteUrl: string | null;
    mapsUrl: string | null;
```
Extend `CreateDiscountPayload` (note `code`/`terms` were previously missing):
```ts
export interface CreateDiscountPayload {
    title: string;
    partnerName: string;
    category: string;
    description?: string;
    code?: string;
    terms?: string;
    thumbnailUrl?: string;
    websiteUrl?: string;
    mapsUrl?: string;
    isFeatured?: boolean;
    isActive?: boolean;
}
```
Append the presigned resource (reuse the shape used by ebooks — define it locally to avoid cross-domain import):
```ts
export interface PresignedUrlResponse {
    upload_url: string;
    download_url: string;
    object_key: string;
}

export const getDiscountPresignedUrl = (token: string, body: { filename: string; contentType: string }) =>
    apiFetch<PresignedUrlResponse>(API.discounts.presignedUrl, { method: 'POST', token, body });
```

- [ ] **Step 4: Add the presigned server action**

In `src/app/dashboard/(routes)/discounts/actions.ts`, import `getDiscountPresignedUrl` + `PresignedUrlResponse` from the resource and append:

```ts
export async function getDiscountPresignedUrlAction(
    filename: string,
    contentType: string
): Promise<ActionResult<PresignedUrlResponse>> {
    const token = await getAccessToken();
    if (!token) return { ok: false, message: 'Not authenticated.' };

    try {
        const data = await getDiscountPresignedUrl(token, { filename, contentType });

        return { ok: true, data, message: 'Upload URL generated.' };
    } catch (error) {
        return toActionError(error);
    }
}
```

- [ ] **Step 5: Verify**

```bash
npm run type-check
npx eslint "src/lib/api/endpoints.ts" "src/lib/api/resources/discounts.ts" "src/app/dashboard/(routes)/discounts/actions.ts"
```
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/lib/api/endpoints.ts src/lib/api/resources/discounts.ts "src/app/dashboard/(routes)/discounts/actions.ts"
git commit -m "feat(discounts): DTO + presigned endpoint for thumbnail/website/maps

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Shared upload helper + move ImageUploadField

**Files:**
- Create: `src/lib/api/upload-asset.ts`
- Create: `src/components/common/image-upload-field.tsx`
- Modify: `src/app/dashboard/(routes)/ebooks/_components/upload-asset.ts`
- Create: `src/app/dashboard/(routes)/discounts/upload-asset.ts`
- Modify: `src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx`, `chapter-dialog.tsx`
- Delete: `src/app/dashboard/(routes)/ebooks/_components/image-upload-field.tsx`

**Interfaces produced:**
- `uploadViaPresign(file: File, getPresigned: (filename: string, contentType: string) => Promise<{ ok: true; data: { upload_url: string; download_url: string; object_key: string } } | { ok: false; message: string }>): Promise<string>`
- `ImageUploadField` (common) props: `{ value?: string; onChange: (url: string) => void; onUpload: (file: File) => Promise<string>; placeholder?: string; disabled?: boolean }`
- `uploadEbookAsset(file)` and `uploadDiscountAsset(file)` — thin wrappers over `uploadViaPresign`.

**Design note (refines the spec):** the spec said generalize via a `scope` enum. We instead inject the uploader function (`onUpload`) into `ImageUploadField` and keep the presign core in `uploadViaPresign(file, getPresigned)`. This decouples the shared field/lib from app routes (no `scope` switch, no lib→route import) and mirrors how `WysiwygEditor` already takes `onImageUpload`.

- [ ] **Step 1: Create the shared presign core**

Create `src/lib/api/upload-asset.ts` (extract the body of the current `uploadEbookAsset`, parameterized by the presign action):

```ts
'use client';

interface PresignOk {
    ok: true;
    data: { upload_url: string; download_url: string; object_key: string };
}
interface PresignErr {
    ok: false;
    message: string;
}

/**
 * Upload one image via a presigned URL and return its public download URL.
 * `getPresigned` is the domain's server action (ebook or discount). Each call
 * mints a unique object key so repeated uploads never collide.
 */
export async function uploadViaPresign(
    file: File,
    getPresigned: (filename: string, contentType: string) => Promise<PresignOk | PresignErr>
): Promise<string> {
    const dot = file.name.lastIndexOf('.');
    const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : '';
    const base =
        file.name
            .slice(0, dot >= 0 ? dot : undefined)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .slice(0, 40) || 'image';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`;

    const res = await getPresigned(uniqueName, file.type);
    if (!res.ok) {
        console.error('[upload] presigned URL request failed', res);
        throw new Error(res.message);
    }

    const upload = await fetch(res.data.upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
    });
    if (!upload.ok) {
        console.error('[upload] PUT to storage failed', { status: upload.status, key: res.data.object_key });
        throw new Error(`Upload failed (${upload.status})`);
    }

    return res.data.download_url;
}
```

- [ ] **Step 2: Rewrite the ebook wrapper**

Replace the body of `src/app/dashboard/(routes)/ebooks/_components/upload-asset.ts` with a thin wrapper (keep the same export name so ebook call sites keep working):

```ts
'use client';

import { uploadViaPresign } from '@/lib/api/upload-asset';

import { getEbookPresignedUrlAction } from '../actions';

/** Upload an ebook image (cover / chapter) and return its public URL. */
export function uploadEbookAsset(file: File): Promise<string> {
    return uploadViaPresign(file, getEbookPresignedUrlAction);
}
```

- [ ] **Step 3: Create the discount wrapper**

Create `src/app/dashboard/(routes)/discounts/upload-asset.ts`:

```ts
'use client';

import { uploadViaPresign } from '@/lib/api/upload-asset';

import { getDiscountPresignedUrlAction } from './actions';

/** Upload a discount thumbnail and return its public URL. */
export function uploadDiscountAsset(file: File): Promise<string> {
    return uploadViaPresign(file, getDiscountPresignedUrlAction);
}
```

- [ ] **Step 4: Move `ImageUploadField` to common + add `onUpload` prop**

Create `src/components/common/image-upload-field.tsx` by moving the existing component and replacing its hardcoded `uploadEbookAsset` import with an injected `onUpload` prop:

```tsx
'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ImageUp, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadFieldProps {
    value?: string;
    onChange: (url: string) => void;
    /** Uploads the picked file and resolves to its public URL. */
    onUpload: (file: File) => Promise<string>;
    placeholder?: string;
    disabled?: boolean;
}

export function ImageUploadField({ value, onChange, onUpload, placeholder = 'https://…', disabled }: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (inputRef.current) inputRef.current.value = '';
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('File must be an image.');

            return;
        }

        setIsUploading(true);
        const toastId = toast.loading('Uploading image…');
        try {
            const url = await onUpload(file);
            onChange(url);
            toast.success('Image uploaded.', { id: toastId });
        } catch (error) {
            console.error('[image-upload-field] upload failed', error);
            toast.error(error instanceof Error ? error.message : 'Upload failed.', { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='space-y-2'>
            <div className='flex items-center gap-2'>
                <Input
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled || isUploading}
                />
                <input type='file' ref={inputRef} onChange={handleFileChange} accept='image/*' className='hidden' />
                <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    disabled={disabled || isUploading}
                    onClick={() => inputRef.current?.click()}
                    title='Upload image'>
                    {isUploading ? <Loader2 className='h-4 w-4 animate-spin' /> : <ImageUp className='h-4 w-4' />}
                </Button>
            </div>

            {value ? (
                <div className='border-border relative w-fit overflow-hidden rounded-lg border'>
                    <Image src={value} alt='Preview' width={120} height={80} unoptimized className='h-20 w-auto object-cover' />
                    <button
                        type='button'
                        onClick={() => onChange('')}
                        disabled={disabled || isUploading}
                        className='bg-background/80 text-foreground absolute top-1 right-1 rounded-full p-0.5 transition-opacity hover:opacity-80 disabled:pointer-events-none'
                        title='Remove image'>
                        <X className='h-3.5 w-3.5' />
                    </button>
                </div>
            ) : null}
        </div>
    );
}
```

Then delete the old file:
```bash
git rm "src/app/dashboard/(routes)/ebooks/_components/image-upload-field.tsx"
```

- [ ] **Step 5: Update the ebook call sites**

In `src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx`:
- Change the import `import { ImageUploadField } from './image-upload-field';` → `import { ImageUploadField } from '@/components/common/image-upload-field';`
- The `<ImageUploadField value={field.value} onChange={field.onChange} />` (cover) now needs `onUpload`: add `onUpload={uploadEbookAsset}` (the `uploadEbookAsset` import already exists in this file).

In `src/app/dashboard/(routes)/ebooks/_components/chapter-dialog.tsx`:
- Change `import { ImageUploadField } from './image-upload-field';` → `import { ImageUploadField } from '@/components/common/image-upload-field';`
- The `<ImageUploadField … />` usage (the chapter feature-image field) gains `onUpload={uploadEbookAsset}` (import already present).

- [ ] **Step 6: Verify (incl. ebook regression)**

```bash
npm run type-check
npx eslint "src/lib/api/upload-asset.ts" "src/components/common/image-upload-field.tsx" "src/app/dashboard/(routes)/ebooks/_components/upload-asset.ts" "src/app/dashboard/(routes)/discounts/upload-asset.ts" "src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx" "src/app/dashboard/(routes)/ebooks/_components/chapter-dialog.tsx"
grep -rn "image-upload-field" "src/app/dashboard/(routes)/ebooks" && echo "!! stale ebook import remains" || echo "ebook imports updated"
```
Expected: type-check + eslint clean; grep shows no stale `./image-upload-field` import left in ebooks. (Ebook upload behavior is unchanged — same presign action, same PUT.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/api/upload-asset.ts src/components/common/image-upload-field.tsx "src/app/dashboard/(routes)/ebooks" "src/app/dashboard/(routes)/discounts/upload-asset.ts"
git commit -m "refactor(upload): shared uploadViaPresign + ImageUploadField (onUpload prop); add discount uploader

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Member — compact card + detail modal

**Files:**
- Rewrite: `src/app/member/discounts/_components/discount-card.tsx`
- Create: `src/app/member/discounts/_components/discount-detail-dialog.tsx`
- Modify: `src/app/member/discounts/_components/discounts-explorer.tsx`

**Interfaces:**
- Consumes: `Discount` with `thumbnail_url/website_url/maps_url` (Task 1).
- `DiscountCard` props: `{ discount: Discount; onSelect: (d: Discount) => void }`.
- `DiscountDetailDialog` props: `{ discount: Discount | null; onClose: () => void }`.

- [ ] **Step 1: Rewrite `discount-card.tsx` as a compact summary**

```tsx
'use client';

import Image from 'next/image';

import type { Discount } from '@/lib/api/resources/discounts';

import { Star, Tag } from 'lucide-react';

export function DiscountCard({ discount, onSelect }: { discount: Discount; onSelect: (d: Discount) => void }) {
    const initial = (discount.partner_name || discount.title || '?').charAt(0).toUpperCase();

    return (
        <button
            type='button'
            onClick={() => onSelect(discount)}
            className='bg-card-dark-navy border-slr-navy-border hover:border-slr-gold-label/40 flex w-full flex-col rounded-2xl border p-4 text-left transition-colors'>
            <div className='flex items-start justify-between gap-2'>
                <div className='bg-slr-navy-card border-slr-navy-border relative size-14 shrink-0 overflow-hidden rounded-lg border'>
                    {discount.thumbnail_url ? (
                        <Image src={discount.thumbnail_url} alt='' fill unoptimized className='object-cover' />
                    ) : (
                        <span className='text-slr-dim flex h-full w-full items-center justify-center text-lg font-semibold'>
                            {initial}
                        </span>
                    )}
                </div>
                {discount.is_featured ? (
                    <span
                        className='text-slr-gold-label inline-flex shrink-0 items-center gap-1 rounded-md border border-[#D4AF3759] px-2 py-0.5 text-xs font-semibold'
                        style={{ background: '#291F0A' }}>
                        <Star className='size-3' /> Featured
                    </span>
                ) : null}
            </div>

            <p className='mt-3 truncate font-semibold text-white'>{discount.partner_name || '-'}</p>
            <p className='text-slr-muted mt-0.5 text-sm'>{discount.title || '-'}</p>
            <span className='text-slr-dim mt-2 inline-flex w-fit items-center gap-1 text-xs'>
                <Tag className='size-3' /> {discount.category || '-'}
            </span>
        </button>
    );
}
```

- [ ] **Step 2: Create `discount-detail-dialog.tsx`**

```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { Discount } from '@/lib/api/resources/discounts';

import { Check, Copy, ExternalLink, MapPin, Star, Tag } from 'lucide-react';
import { toast } from 'sonner';

const PLACEHOLDER_CODE = 'SLR-XXXXXX';

export function DiscountDetailDialog({ discount, onClose }: { discount: Discount | null; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const code = discount?.code?.trim() || PLACEHOLDER_CODE;

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success('Code copied');
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Could not copy code');
        }
    };

    return (
        <Dialog open={discount !== null} onOpenChange={(open) => (open ? null : onClose())}>
            <DialogContent className='slr-member dark border-slr-navy-border bg-slr-navy-deep max-h-[90vh] overflow-y-auto sm:max-w-2xl'>
                {discount ? (
                    <div className='grid gap-6 md:grid-cols-2'>
                        {/* Left: identity + code */}
                        <div className='space-y-4'>
                            <div className='bg-slr-navy-card border-slr-navy-border relative aspect-video overflow-hidden rounded-xl border'>
                                {discount.thumbnail_url ? (
                                    <Image src={discount.thumbnail_url} alt='' fill unoptimized className='object-contain p-3' />
                                ) : (
                                    <span className='text-slr-dim flex h-full w-full items-center justify-center text-3xl font-bold'>
                                        {(discount.partner_name || '?').charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className='text-slr-dim text-xs'>Partner</p>
                                <DialogTitle className='text-lg font-semibold text-white'>
                                    {discount.partner_name || '-'}
                                </DialogTitle>
                                <p className='text-gradient-gold mt-1 text-xl font-bold'>{discount.title || '-'}</p>
                            </div>

                            <button
                                type='button'
                                onClick={copyCode}
                                className='border-slr-navy-border flex w-full items-center justify-between gap-2 rounded-lg border border-dashed bg-black/20 px-3 py-2.5 transition-colors hover:border-[#D4AF3759]'>
                                <span className='font-mono text-sm tracking-wider text-white/90'>{code}</span>
                                {copied ? (
                                    <Check className='size-4 shrink-0 text-emerald-400' />
                                ) : (
                                    <Copy className='text-slr-dim size-4 shrink-0' />
                                )}
                            </button>
                            {discount.description ? (
                                <p className='text-slr-muted text-sm leading-relaxed'>{discount.description}</p>
                            ) : null}
                        </div>

                        {/* Right: category, long desc, links */}
                        <div className='space-y-4'>
                            <div className='flex flex-wrap items-center gap-2'>
                                <span className='text-slr-dim inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/3 px-2.5 py-1 text-xs'>
                                    <Tag className='size-3' /> {discount.category || '-'}
                                </span>
                                {discount.is_featured ? (
                                    <span className='text-slr-gold-label inline-flex items-center gap-1 text-xs font-semibold'>
                                        <Star className='size-3' /> Featured
                                    </span>
                                ) : null}
                            </div>

                            {discount.terms ? (
                                <p className='text-slr-muted text-sm leading-relaxed whitespace-pre-line'>{discount.terms}</p>
                            ) : null}

                            <div className='divide-y divide-white/5 border-t border-white/5'>
                                {discount.website_url ? (
                                    <LinkRow href={discount.website_url} icon={ExternalLink} label='Website' />
                                ) : null}
                                {discount.maps_url ? (
                                    <LinkRow href={discount.maps_url} icon={MapPin} label='View on map' />
                                ) : null}
                            </div>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

function LinkRow({ href, icon: Icon, label }: { href: string; icon: typeof MapPin; label: string }) {
    return (
        <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='text-slr-muted hover:text-white flex items-center justify-between gap-2 py-3 text-sm transition-colors'>
            <span className='inline-flex items-center gap-2'>
                <Icon className='text-slr-gold-label size-4' /> {label}
            </span>
            <ExternalLink className='text-slr-dim size-3.5' />
        </a>
    );
}
```

> Note: `DialogContent` from shadcn requires an accessible title. `DialogTitle` is used inside; if the linter/a11y check complains about title placement, wrap the header text in `DialogHeader` — but a `DialogTitle` present anywhere in the content satisfies Radix.

- [ ] **Step 3: Wire selection + modal into the explorer**

In `src/app/member/discounts/_components/discounts-explorer.tsx`:
- Add `import { DiscountDetailDialog } from './discount-detail-dialog';` and `useState` for the selected discount:
```tsx
const [selected, setSelected] = useState<Discount | null>(null);
```
- Change the card render to pass `onSelect`:
```tsx
{filtered.map((d) => (
    <DiscountCard key={d.discount_id} discount={d} onSelect={setSelected} />
))}
```
- Render one dialog after the grid (inside the returned root `div`):
```tsx
<DiscountDetailDialog discount={selected} onClose={() => setSelected(null)} />
```

- [ ] **Step 4: Verify**

```bash
npm run type-check
npx eslint src/app/member/discounts/_components/discount-card.tsx src/app/member/discounts/_components/discount-detail-dialog.tsx src/app/member/discounts/_components/discounts-explorer.tsx
```
Expected: clean. (Member render check is manual: a card opens the modal; copy toasts; null website/maps rows are hidden.)

- [ ] **Step 5: Commit**

```bash
git add src/app/member/discounts/_components
git commit -m "feat(discounts): compact member cards + detail modal (thumbnail, website, maps)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Admin CRUD — thumbnail upload + website + maps + desc/terms

**Files:**
- Modify: `src/app/dashboard/(routes)/discounts/discounts-client.tsx`

**Interfaces:**
- Consumes: `ImageUploadField` (common, Task 2), `uploadDiscountAsset` (Task 2), extended `CreateDiscountPayload`/`getDiscountAction` (Task 1).

- [ ] **Step 1: Extend the form schema + defaults**

In `src/app/dashboard/(routes)/discounts/discounts-client.tsx`, add to `formSchema`:
```ts
    code: z.string().optional(),
    terms: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    websiteUrl: z.string().optional(),
    mapsUrl: z.string().optional(),
```
Update every `form.reset({...})` / `useForm defaultValues` object to include: `code: '', terms: '', thumbnailUrl: '', websiteUrl: '', mapsUrl: ''` (there are three reset sites: `useForm`, `openCreate`, `openEdit` — and the `openEdit` async prefill from `getDiscountAction`). In the `openEdit` prefill, also map the new fields from the fetched record: `code: res.data.code ?? ''`, `terms: res.data.terms ?? ''`, `thumbnailUrl: res.data.thumbnail_url ?? ''`, `websiteUrl: res.data.website_url ?? ''`, `mapsUrl: res.data.maps_url ?? ''`. (These now exist on `Discount` per Task 1.)

- [ ] **Step 2: Send the new fields in create + update payloads**

In `onSubmit`, add the new fields to both payloads. Create path (`createDiscountAction(values)`) already passes the whole `values`; ensure the extended `CreateDiscountPayload` accepts them (Task 1 did). For the update path, add to the `payload` object:
```ts
    code: values.code ?? '',
    terms: values.terms ?? '',
    thumbnailUrl: values.thumbnailUrl ?? '',
    websiteUrl: values.websiteUrl ?? '',
    mapsUrl: values.mapsUrl ?? '',
```
(Since `values` from the form now include these keys, if the create action is typed to `CreateDiscountPayload` it will pass through; verify `createDiscountAction(values)` typechecks with the extra keys — the payload type allows them.)

- [ ] **Step 3: Add the fields to the dialog form**

Add imports at the top:
```ts
import { ImageUploadField } from '@/components/common/image-upload-field';
import { uploadDiscountAsset } from './upload-asset';
```
Rename the existing "Description" field label to **"Short description"** (`description`). Then, in the form (after category / near description), add:
- **Thumbnail** field:
```tsx
<FormField
    control={form.control}
    name='thumbnailUrl'
    render={({ field }) => (
        <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <FormControl>
                <ImageUploadField value={field.value} onChange={field.onChange} onUpload={uploadDiscountAsset} />
            </FormControl>
            <FormMessage />
        </FormItem>
    )}
/>
```
- **Code** field (`code`, `<Input placeholder='SLR-XXXX' />`).
- **Long description** field (`terms`, `<Textarea rows={5} placeholder='Merchant info + how to claim' />`), labelled "Long description (merchant + how to claim)".
- **Website URL** (`websiteUrl`, `<Input placeholder='https://…' />`) and **Maps URL** (`mapsUrl`, `<Input placeholder='https://maps.google.com/…' />`).

Each mirrors the existing `FormField` markup pattern in the file. Keep `isFeatured`/`isActive` switches as-is.

- [ ] **Step 4: Verify (types, lint, live round-trip with a thumbnail)**

```bash
npm run type-check
npx eslint "src/app/dashboard/(routes)/discounts/discounts-client.tsx"
# live: create a discount with thumbnailUrl/websiteUrl/mapsUrl, read back, delete
BASE=https://api.smartliferewards.com.au
T=$(curl -s -X POST "$BASE/api/v1/auth/login" -H 'Content-Type: application/json' -d '{"email":"admin@smartliferewards.com.au","password":"ChangeMeImmediately!1"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['access_token'])")
ID=$(curl -s -X POST "$BASE/api/v1/discounts/" -H "Authorization: Bearer $T" -H 'Content-Type: application/json' -d '{"title":"FE test","partnerName":"FE Test Co","category":"Test","code":"FETEST","terms":"long desc","thumbnailUrl":"https://example.com/x.png","websiteUrl":"https://example.com","mapsUrl":"https://maps.google.com/x"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['id'])")
curl -s "$BASE/api/v1/discounts/$ID" -H "Authorization: Bearer $T" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('thumb',d.get('thumbnail_url'),'web',d.get('website_url'),'maps',d.get('maps_url'))"
curl -s -X DELETE "$BASE/api/v1/discounts/$ID" -H "Authorization: Bearer $T" -o /dev/null -w "delete HTTP %{http_code}\n"
```
Expected: type-check + eslint clean; the GET echoes the three URLs; delete returns 200/204.

- [ ] **Step 5: Commit**

```bash
git add "src/app/dashboard/(routes)/discounts/discounts-client.tsx"
git commit -m "feat(discounts): admin CRUD gains thumbnail upload, website, maps, short/long desc

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** §4.1 API → Task 1. §4.2 shared upload → Task 2. §4.3 member card → Task 3. §4.4 detail modal → Task 3. §4.5 admin CRUD → Task 4. Field semantics honored (description=short, terms=long). All covered.
- **Type consistency:** `Discount.thumbnail_url/website_url/maps_url` (Task 1) consumed in Task 3; `DiscountAdmin.thumbnailUrl/...` + `CreateDiscountPayload` extras (Task 1) consumed in Task 4; `uploadViaPresign`/`ImageUploadField.onUpload`/`uploadEbookAsset`/`uploadDiscountAsset` (Task 2) consumed in Tasks 3-4 and the ebook call sites. `getDiscountPresignedUrlAction` (Task 1) consumed by `uploadDiscountAsset` (Task 2).
- **Verify-before-use flagged inline:** `createDiscountAction(values)` accepting the extra form keys (Task 4 Step 2), and the shadcn `DialogTitle` a11y placement (Task 3 Step 2 note).
- **Regression guard:** Task 2 moves shared ebook infra; Step 6 greps for stale imports and relies on unchanged presign behavior. Manual ebook cover/chapter upload check recommended before merge.
```
