# PDF-or-Chapter Ebooks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins create an ebook as either an uploaded PDF or the existing multi-chapter reader, and render each correctly on the member side.

**Architecture:** Add a `pdfUrl`/`pdf_url` field to the ebook DTOs (backend already live). The admin form gets a locked-after-create Chapter/PDF mode toggle: PDF mode swaps the chapter authoring UI for a PDF upload field (reusing the existing presigned-url upload flow). The member reader (`/member/ebooks/[id]`) branches on `pdf_url` — a native `<object>` PDF embed with a download CTA fallback, or the existing chapter `<EbookReader>`.

**Tech Stack:** Next.js 16 (App Router, RSC + server actions), React 19, TypeScript, Tailwind v4, shadcn/ui (`ToggleGroup`, `Form`, `Input`, `Button`, `Tooltip`), React Hook Form + Zod, Sonner toasts.

## Global Constraints

- Money is integer cents; not relevant here but never render `draw_pass` — N/A to ebooks.
- Empty/missing display field → default value, never blank/`undefined`/`null`/`NaN`: string → `"-"`.
- Server Components by default; add `'use client'` only for interactivity (upload field, viewer, form).
- Prettier: 4-space indent, single quotes, JSX single quotes, semicolons, width 120, trailing comma `none`. Tailwind classes auto-sorted.
- Path alias `@/*` → `src/*`.
- Reuse SLR design tokens (`goldButtonStyle` from `@/lib/styles`, `text-slr-*`, dark navy surfaces). No new fonts, no light mode.
- Dashboard forms use dark surfaces (`bg-white/5 border-white/10`); member uses `bg-card-dark-navy border-slr-navy-border`.
- **No unit-test runner exists** (no jest/vitest). The verification gate for every task is: `npm run type-check` + `npx eslint <changed files>`, plus the manual/curl checks noted per task. Do **not** scaffold a test framework.
- API contract is already live (verified 2026-07-18): `POST/PATCH /ebooks` accept `pdfUrl` (uri, ≤500, nullable); `GET /ebooks/` list item and `GET /ebooks/{id}` detail both return `pdf_url` (nullable). `presigned-url` `contentType` accepts `application/pdf`.
- Content-type mode is **locked after create** — derived from `pdf_url` presence on edit; toggle disabled on edit.
- `pdf_url` **wins** if a row somehow has both `pdf_url` and chapters.

---

## File Structure

- `src/lib/api/resources/ebooks.ts` — **modify.** Add PDF field to 4 DTOs. (Task 1)
- `src/components/common/pdf-upload-field.tsx` — **create.** PDF upload field (sibling of `ImageUploadField`). (Task 2)
- `src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx` — **modify.** Mode toggle + conditional PDF/chapter UI + schema + submit. (Task 3)
- `src/app/dashboard/(routes)/ebooks/[id]/page.tsx` — **modify.** Map `pdf_url` into `initialData`. (Task 3)
- `src/components/common/pdf-ebook-viewer.tsx` — **create.** Native `<object>` embed + download CTA. (Task 4)
- `src/app/member/ebooks/[id]/page.tsx` — **modify.** Branch on `pdf_url`. (Task 4)

---

## Task 1: Add `pdfUrl`/`pdf_url` to ebook DTOs

**Files:**
- Modify: `src/lib/api/resources/ebooks.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `EbookListItem.pdf_url: string | null`, `EbookAdmin.pdfUrl: string | null`, `EbookPayload.pdfUrl?: string | null`, `EbookDetail.pdf_url: string | null`.

- [ ] **Step 1: Add `pdf_url` to `EbookListItem`**

In `src/lib/api/resources/ebooks.ts`, in `interface EbookListItem`, add after `cover_url`:

```ts
    cover_url: string | null;
    pdf_url: string | null;
```

- [ ] **Step 2: Add `pdfUrl` to `EbookAdmin`**

In `interface EbookAdmin`, add after `coverUrl`:

```ts
    coverUrl: string | null;
    pdfUrl: string | null;
```

- [ ] **Step 3: Add `pdfUrl` to `EbookPayload`**

In `interface EbookPayload`, add after `coverUrl`:

```ts
    coverUrl?: string;
    pdfUrl?: string | null;
```

- [ ] **Step 4: Add `pdf_url` to `EbookDetail`**

In `interface EbookDetail`, add after `cover_url`:

```ts
    cover_url: string | null;
    pdf_url: string | null;
```

- [ ] **Step 5: Verify types compile**

Run: `npm run type-check`
Expected: PASS (no errors). New fields are additive; no consumer breaks.

- [ ] **Step 6: (Optional) curl-verify the live shape**

Confirm the real response matches before trusting the DTO (project curl-first rule). With a real admin token:

Run:
```bash
curl -s "https://api.smartliferewards.com.au/docsx-2s3crt3-199/json" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); p=d['paths']; print('POST keys:', list(p['/api/v1/ebooks/']['post']['requestBody']['content']['application/json']['schema']['properties'])); print('DETAIL has pdf_url:', 'pdf_url' in p['/api/v1/ebooks/{id}']['get']['responses']['200']['content']['application/json']['schema']['properties']['data']['properties'])"
```
Expected: `POST keys` includes `pdfUrl`; `DETAIL has pdf_url: True`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/api/resources/ebooks.ts
git commit -m "feat(ebooks): add pdfUrl/pdf_url to ebook DTOs"
```

---

## Task 2: `PdfUploadField` component

**Files:**
- Create: `src/components/common/pdf-upload-field.tsx`

**Interfaces:**
- Consumes: nothing (self-contained; `onUpload` is passed by the caller in Task 3).
- Produces: `export function PdfUploadField(props: { value?: string; onChange: (url: string) => void; onUpload: (file: File) => Promise<string>; disabled?: boolean })`.

- [ ] **Step 1: Create the component**

Create `src/components/common/pdf-upload-field.tsx` with the full content:

```tsx
'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FileText, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface PdfUploadFieldProps {
    value?: string;
    onChange: (url: string) => void;
    /** Uploads the picked file and resolves to its public URL. */
    onUpload: (file: File) => Promise<string>;
    placeholder?: string;
    disabled?: boolean;
}

/** Derive a human-readable filename from a storage URL. */
function fileNameFromUrl(url: string): string {
    try {
        const path = new URL(url).pathname;
        const last = path.slice(path.lastIndexOf('/') + 1);

        return decodeURIComponent(last) || 'document.pdf';
    } catch {
        return 'document.pdf';
    }
}

export function PdfUploadField({
    value,
    onChange,
    onUpload,
    placeholder = 'https://…/document.pdf',
    disabled
}: PdfUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (inputRef.current) inputRef.current.value = '';
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('File must be a PDF.');

            return;
        }

        setIsUploading(true);
        const toastId = toast.loading('Uploading PDF…');
        try {
            const url = await onUpload(file);
            onChange(url);
            toast.success('PDF uploaded.', { id: toastId });
        } catch (error) {
            console.error('[pdf-upload-field] upload failed', error);
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
                <input
                    type='file'
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept='application/pdf'
                    className='hidden'
                />
                <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    disabled={disabled || isUploading}
                    onClick={() => inputRef.current?.click()}
                    title='Upload PDF'>
                    {isUploading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Upload className='h-4 w-4' />}
                </Button>
            </div>

            {value ? (
                <div className='border-border flex w-fit items-center gap-2 rounded-lg border px-3 py-2'>
                    <FileText className='h-4 w-4 text-white/60' />
                    <a
                        href={value}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='max-w-[240px] truncate text-xs text-white/80 underline-offset-2 hover:underline'>
                        {fileNameFromUrl(value)}
                    </a>
                    <button
                        type='button'
                        onClick={() => onChange('')}
                        disabled={disabled || isUploading}
                        className='text-foreground rounded-full p-0.5 transition-opacity hover:opacity-80 disabled:pointer-events-none'
                        title='Remove PDF'>
                        <X className='h-3.5 w-3.5' />
                    </button>
                </div>
            ) : null}
        </div>
    );
}
```

- [ ] **Step 2: Verify types + lint**

Run: `npm run type-check && npx eslint src/components/common/pdf-upload-field.tsx`
Expected: PASS, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/common/pdf-upload-field.tsx
git commit -m "feat(ebooks): add PdfUploadField component"
```

---

## Task 3: Admin form mode toggle + PDF wiring

**Files:**
- Modify: `src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx`
- Modify: `src/app/dashboard/(routes)/ebooks/[id]/page.tsx`

**Interfaces:**
- Consumes: `PdfUploadField` (Task 2); `EbookPayload.pdfUrl`, `EbookListItem.pdf_url` (Task 1); existing `uploadEbookAsset`, `ToggleGroup`/`ToggleGroupItem` (`@/components/ui/toggle-group`).
- Produces: nothing downstream.

- [ ] **Step 1: Pass `pdfUrl` into `initialData` from the edit page**

In `src/app/dashboard/(routes)/ebooks/[id]/page.tsx`, in the `initialData` object, add after `coverUrl`:

```ts
        coverUrl: ebookListItem.cover_url || '',
        pdfUrl: ebookListItem.pdf_url || '',
```

- [ ] **Step 2: Add imports to the form**

In `src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx`, add these imports alongside the existing ones:

```tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { PdfUploadField } from '@/components/common/pdf-upload-field';
```

(Place `ToggleGroup` with the other `@/components/ui/*` imports and `PdfUploadField` with the other `@/components/common/*` import, per the sort-imports convention.)

- [ ] **Step 3: Add `pdfUrl` to the schema and the `initialData` prop type**

In the `formSchema` `z.object({ … })`, add after `coverUrl`:

```ts
    coverUrl: z.string().optional(),
    pdfUrl: z.string().optional(),
```

In the `EbookFormProps` `initialData` object type, add after `coverUrl: string;`:

```ts
        coverUrl: string;
        pdfUrl: string;
```

- [ ] **Step 4: Add `pdfUrl` to both `defaultValues` branches**

In `defaultValues`, the `initialData` branch — add after `coverUrl: initialData.coverUrl,`:

```ts
              coverUrl: initialData.coverUrl,
              pdfUrl: initialData.pdfUrl,
```

The else (create) branch — add after `coverUrl: '',`:

```ts
              coverUrl: '',
              pdfUrl: '',
```

- [ ] **Step 5: Add the content-mode state**

Immediately after the existing `const [chapters, setChapters] = useState…` lines inside `EbookForm`, add:

```tsx
    // Content type is chosen at create time and locked on edit (derived from pdfUrl).
    const isPdfEbook = Boolean(initialData?.pdfUrl);
    const [contentMode, setContentMode] = useState<'chapters' | 'pdf'>(
        initialData ? (isPdfEbook ? 'pdf' : 'chapters') : 'chapters'
    );
    const isEditing = Boolean(initialData);
```

- [ ] **Step 6: Enforce mode in `onSubmit`**

Replace the existing `onSubmit` body's `const res = …` line so PDF/chapter fields are mutually exclusive in the payload. Change `onSubmit` to:

```tsx
    const onSubmit = (values: FormValues) => {
        if (contentMode === 'pdf' && !values.pdfUrl) {
            form.setError('pdfUrl', { message: 'Upload a PDF or paste its URL.' });

            return;
        }

        const payload: FormValues =
            contentMode === 'pdf'
                ? { ...values, pdfUrl: values.pdfUrl, description: '' }
                : { ...values, pdfUrl: null as unknown as string };

        startTransition(async () => {
            const res = initialData ? await updateEbookAction(initialData.id, payload) : await createEbookAction(payload);

            if (res.ok) {
                toast.success(res.message);
                router.push('/dashboard/ebooks');
                router.refresh();
            } else {
                toast.error(res.code ? `${res.message} (${res.code})` : res.message);
            }
        });
    };
```

(Chapter mode sends `pdfUrl: null` so a chapter ebook never carries a stray PDF; the `as unknown as string` bridges the optional-string form type to the nullable payload field.)

- [ ] **Step 7: Add the mode toggle above the form fields**

Inside `<form … className='flex flex-col gap-6'>`, as the **first child** (before the existing `<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>` with title/subtitle), add:

```tsx
                        <div className='flex flex-col gap-2'>
                            <span className='text-sm font-medium text-white/80'>Content type</span>
                            <ToggleGroup
                                type='single'
                                value={contentMode}
                                onValueChange={(v) => {
                                    if (v && !isEditing) setContentMode(v as 'chapters' | 'pdf');
                                }}
                                disabled={isEditing}
                                className='w-fit'>
                                <ToggleGroupItem value='chapters'>Chapters</ToggleGroupItem>
                                <ToggleGroupItem value='pdf'>PDF</ToggleGroupItem>
                            </ToggleGroup>
                            <p className='text-xs text-white/40'>
                                {isEditing
                                    ? 'Content type is fixed after creation.'
                                    : 'Choose whether this ebook is a multi-chapter reader or a single uploaded PDF.'}
                            </p>
                        </div>
```

- [ ] **Step 8: Hide the description WYSIWYG in PDF mode**

Wrap the existing `description` `FormField` (the one rendering `<WysiwygEditor … />`) in a conditional so it only shows in chapter mode. Change its surrounding to:

```tsx
                        {contentMode === 'chapters' && (
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content / Description</FormLabel>
                                        <FormControl>
                                            <WysiwygEditor
                                                placeholder='Write the ebook content or description...'
                                                onImageUpload={uploadEbookAsset}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
```

- [ ] **Step 9: Add the PDF upload field (PDF mode only)**

Directly after the `description` block from Step 8, add a PDF field shown only in PDF mode:

```tsx
                        {contentMode === 'pdf' && (
                            <FormField
                                control={form.control}
                                name='pdfUrl'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PDF file</FormLabel>
                                        <FormControl>
                                            <PdfUploadField
                                                value={field.value}
                                                onChange={field.onChange}
                                                onUpload={uploadEbookAsset}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
```

- [ ] **Step 10: Hide the Chapters & Sections panel in PDF mode**

The chapters management panel is currently gated on `{initialData && ( … )}`. Change that opening guard to also require chapter mode:

```tsx
            {initialData && contentMode === 'chapters' && (
```

(Leave the panel's contents unchanged; only the guard changes.)

- [ ] **Step 11: Verify types + lint**

Run: `npm run type-check && npx eslint "src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx" "src/app/dashboard/(routes)/ebooks/[id]/page.tsx"`
Expected: PASS, no errors.

- [ ] **Step 12: Manual smoke test**

Run: `npm run dev`, then in the dashboard:
- New ebook → toggle **PDF** → the Chapters panel and description editor are gone; the PDF upload field shows. Upload a real PDF (presign PUT succeeds), fill title/tier, Create → success.
- New ebook → toggle **Chapters** (default) → PDF field hidden; description + (after save) chapters panel present.
- Edit a PDF ebook → toggle is **disabled** and stuck on PDF; "Content type is fixed after creation." shows.
- Edit a chapter ebook → toggle disabled on Chapters; chapters panel present, no PDF field.

Expected: all four behave as described; no console errors.

- [ ] **Step 13: Commit**

```bash
git add "src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx" "src/app/dashboard/(routes)/ebooks/[id]/page.tsx"
git commit -m "feat(ebooks): locked PDF/Chapter mode toggle + PDF upload in admin form"
```

---

## Task 4: Member reader PDF branch

**Files:**
- Create: `src/components/common/pdf-ebook-viewer.tsx`
- Modify: `src/app/member/ebooks/[id]/page.tsx`

**Interfaces:**
- Consumes: `EbookDetail.pdf_url` (Task 1); `goldButtonStyle` (`@/lib/styles`).
- Produces: `export function PdfEbookViewer(props: { pdfUrl: string; title: string })`.

- [ ] **Step 1: Create the PDF viewer component**

Create `src/components/common/pdf-ebook-viewer.tsx`:

```tsx
'use client';

import { goldButtonStyle } from '@/lib/styles';

import { Download, ExternalLink } from 'lucide-react';

interface PdfEbookViewerProps {
    pdfUrl: string;
    title: string;
}

/**
 * Renders a PDF ebook inline via a native <object>. When the browser can't
 * embed a PDF (common on mobile), the <object> fallback content shows a
 * branded download / open-in-new-tab CTA instead.
 */
export function PdfEbookViewer({ pdfUrl, title }: PdfEbookViewerProps) {
    return (
        <div className='mx-auto w-full max-w-5xl px-4 md:px-6'>
            <div className='border-slr-navy-border bg-card-dark-navy overflow-hidden rounded-2xl border'>
                <object data={pdfUrl} type='application/pdf' className='h-[80vh] min-h-[520px] w-full' aria-label={title}>
                    <div className='flex flex-col items-center px-6 py-14 text-center'>
                        <h2 className='font-bebas-neue text-2xl tracking-wide text-white uppercase md:text-3xl'>
                            Open “{title}”
                        </h2>
                        <p className='text-slr-muted mt-2 max-w-md text-sm leading-relaxed'>
                            Your browser can’t display this PDF inline. Download it or open it in a new tab to read.
                        </p>
                        <div className='mt-5 flex flex-wrap items-center justify-center gap-3'>
                            <a
                                href={pdfUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold uppercase'
                                style={goldButtonStyle}>
                                Open PDF <ExternalLink className='size-4' />
                            </a>
                            <a
                                href={pdfUrl}
                                download
                                className='border-slr-navy-border text-slr-muted hover:text-foreground inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold uppercase transition-colors'>
                                Download <Download className='size-4' />
                            </a>
                        </div>
                    </div>
                </object>
            </div>

            <div className='mt-4 flex justify-end'>
                <a
                    href={pdfUrl}
                    download
                    className='text-slr-muted hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors'>
                    <Download className='size-3.5' /> Download PDF
                </a>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Import the viewer in the member reader page**

In `src/app/member/ebooks/[id]/page.tsx`, add with the other `@/components/common/*` import:

```tsx
import { PdfEbookViewer } from '@/components/common/pdf-ebook-viewer';
```

- [ ] **Step 3: Branch on `pdf_url` in the reader page**

In `EbookReaderPage`, after the `ebook` is loaded and before `const chapters = toReaderChapters(ebook.chapters);`, add the PDF branch. Replace:

```tsx
    const chapters = toReaderChapters(ebook.chapters);

    return (
        <div className='flex-1'>
```

with:

```tsx
    const isPdf = Boolean(ebook.pdf_url);
    const chapters = isPdf ? [] : toReaderChapters(ebook.chapters);

    return (
        <div className='flex-1'>
```

- [ ] **Step 4: Render the PDF viewer instead of the chapter reader**

Replace the existing bottom `<section id='guide' …> … </section>` block (the one wrapping `<EbookReader … />`) with a conditional:

```tsx
            {isPdf ? (
                <section className='py-6 md:py-10'>
                    <PdfEbookViewer pdfUrl={ebook.pdf_url!} title={ebook.title} />
                </section>
            ) : (
                <section id='guide' className='scroll-mt-24 py-6 md:py-10'>
                    <EbookReader
                        chapters={chapters}
                        finishLabel={`You Finished ${ebook.title}`}
                        shareTitle={ebook.title}
                        shareText={`Read "${ebook.title}" on SLR Rewards.`}
                        nextHref='/member/ebooks'
                        nextLabel='More E-Books'
                    />
                </section>
            )}
```

- [ ] **Step 5: Suppress the chapter-count meta line for PDF ebooks**

In the hero meta row, the `<Layers …>{ebook.chapter_count} …chapters</span>` element is meaningless for a PDF. Wrap it so it only renders when not a PDF. Change that `<span>` to:

```tsx
                        {!isPdf && (
                            <span className='inline-flex items-center gap-1.5'>
                                <Layers className='size-4' />
                                {ebook.chapter_count} {ebook.chapter_count === 1 ? 'chapter' : 'chapters'}
                            </span>
                        )}
```

- [ ] **Step 6: Verify types + lint**

Run: `npm run type-check && npx eslint src/components/common/pdf-ebook-viewer.tsx "src/app/member/ebooks/[id]/page.tsx"`
Expected: PASS, no errors.

- [ ] **Step 7: Manual smoke test**

With `npm run dev` and a RED/BLUE member session:
- Open a **PDF** ebook at `/member/ebooks/<id>` → PDF renders inline in the branded frame; the "Download PDF" link works; the chapter-count meta is absent.
- Open a **chapter** ebook → the long-form `<EbookReader>` renders as before.
- Open a PDF ebook as a **below-tier** member → the existing `UpgradeGate` (403) still shows.

Expected: all three behave as described; no console errors.

- [ ] **Step 8: Production build sanity**

Run: `npm run build`
Expected: build succeeds with no type or lint errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/common/pdf-ebook-viewer.tsx "src/app/member/ebooks/[id]/page.tsx"
git commit -m "feat(ebooks): render PDF ebooks in the member reader"
```

---

## Post-implementation

- [ ] Run `graphify update .` to refresh the knowledge graph (AST-only, no API cost).
- [ ] Update `docs/API-INTEGRATION.md`: note that `pdfUrl`/`pdf_url` is now integrated on `POST/PATCH /ebooks` (admin form) and `GET /ebooks/{id}` (member reader).

## Out of scope (fast-follow, not in this plan)

- Public home ebooks page (`src/app/(home)/(routes)/ebooks`) PDF parity — near-identical branch, separate task.
- PDF.js custom in-app viewer (page controls, thumbnails).
- Chapter↔PDF conversion or in-app PDF generation.
