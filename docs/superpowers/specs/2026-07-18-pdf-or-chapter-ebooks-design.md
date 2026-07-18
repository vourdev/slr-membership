# PDF-or-Chapter Ebooks — Design

**Date:** 2026-07-18
**Area:** Admin ebook form + member ebook reader
**Status:** Approved (design)

## Problem

Ebooks currently exist in one shape only: a multi-chapter, long-form web reader authored via
the admin chapter dialog. The client now wants a second shape — a single uploaded **PDF** ebook —
without losing the existing chapter-based ebooks.

Two ebook content types must coexist:

1. **PDF ebook** — a `pdfUrl` points at an uploaded PDF. No chapters. The chapter authoring UI is
   not shown; the member reads/downloads the PDF.
2. **Chapter ebook** — the existing model, unchanged. The PDF upload field is hidden.

The admin chooses the type with a frontend toggle. The PDF is uploaded exactly like the existing
image uploads — via the ebook `presigned-url` → raw `PUT` flow.

## Backend contract (verified live 2026-07-18 against the OpenAPI JSON)

The backend already supports this — no backend work required. Verified fields:

| Endpoint | Field | Shape |
|---|---|---|
| `POST /api/v1/ebooks/` (request) | `pdfUrl` | string, `format: uri`, `maxLength: 500`, optional + nullable |
| `PATCH /api/v1/ebooks/{id}` (request) | `pdfUrl` | same as POST |
| `GET /api/v1/ebooks/` (list item) | `pdf_url` | `["null","string"]` |
| `GET /api/v1/ebooks/{id}` (detail) | `pdf_url` | `["null","string"]`, sits alongside the existing `chapters[]` |
| `POST /api/v1/ebooks/presigned-url` | `contentType` | free string, `maxLength: 100`, **no enum** → `application/pdf` accepted |

Note: the detail response carries **both** `pdf_url` and `chapters` — the backend does not enforce
mutual exclusivity. The frontend enforces "one content type per ebook" (see Toggle behaviour).

## Decisions

- **Backend:** already live. Wire the frontend directly; curl-verify the real response shape before
  finalizing DTOs (per `docs/API-INTEGRATION.md` curl-first rule).
- **Toggle behaviour: locked after create.** The content type is chosen at create time and is
  **fixed** on edit — derived from whether `pdf_url` is set, with the toggle disabled. This avoids
  orphaned chapters or a dangling PDF and keeps each ebook single-source.
- **Scope:** admin form **and** the member reader (`/member/ebooks/[id]`).
- **PDF rendering:** native inline embed (`<object>`) inside the existing branded shell, with a gold
  "Download / Open in new tab" CTA as the fallback (covers mobile that can't inline-render). No new
  PDF library dependency.
- **Public home ebooks page** (`(home)/(routes)/ebooks`) is **out of scope** — the approved scope was
  the member reader only. Listed as a fast-follow (see Out of Scope).

## Design

### 1. Data layer — `src/lib/api/resources/ebooks.ts`

Add the PDF field to the existing DTOs (mirroring the verified live shape):

- `EbookPayload` → add `pdfUrl?: string | null` (uri, ≤500).
- `EbookAdmin` → add `pdfUrl: string | null`.
- `EbookListItem` → add `pdf_url: string | null`.
- `EbookDetail` → add `pdf_url: string | null` (alongside existing `chapters`).

No new resource function. PDF upload reuses `getEbookPresignedUrl` — its `contentType` is a free
string, so `application/pdf` needs nothing new.

### 2. Admin form — `src/app/dashboard/(routes)/ebooks/_components/ebook-form.tsx`

- **Mode state:** `type ContentMode = 'chapters' | 'pdf'`.
  - **Create:** default `'chapters'`. A shadcn segmented toggle switches between the two. **Enabled.**
  - **Edit:** mode is **derived** — `initialData.pdfUrl ? 'pdf' : 'chapters'`. The toggle is
    **disabled**, with a tooltip: "Content type is fixed after creation."
- **PDF mode renders:** the new `PdfUploadField` (below). Hides the Chapters & Sections panel and the
  `description` WYSIWYG editor (chapter-only content).
- **Chapter mode renders:** the existing form exactly as today; the PDF field is hidden.
- **Schema:** `formSchema` gains `pdfUrl: z.string().optional()`.
- **Submit:** when PDF mode, send `pdfUrl` and omit chapter-only content. When Chapter mode, send
  `pdfUrl: null`. (Switching is locked, but sending an explicit `null` keeps the payload honest and
  guards against any stale value. `PATCH` already requires sending the full payload — see the existing
  comment in `resources/ebooks.ts`.)
- **Validation:** in PDF mode a `pdfUrl` is required before submit (inline form error). In Chapter
  mode it is ignored.

The `initialData` prop gains `pdfUrl: string`. The edit page that builds `initialData` maps
`ebook.pdf_url ?? ''` into it.

### 3. New component — `src/components/common/pdf-upload-field.tsx`

`ImageUploadField` is image-locked (`accept='image/*'`, `file.type.startsWith('image/')` guard, and an
`<Image>` thumbnail preview), so it cannot be reused directly. Add a sibling `PdfUploadField` with the
same prop contract (`value`, `onChange`, `onUpload`, `disabled`):

- File input `accept='application/pdf'`; guard `file.type === 'application/pdf'` (toast on mismatch).
- Reuses `onUpload={uploadEbookAsset}` — the presign helper is file-type-agnostic, no change.
- Preview: a filename chip derived from the URL + a "View" link (opens the PDF in a new tab) + a
  remove `X`. No image thumbnail.
- Dark dashboard styling consistent with `ImageUploadField`.

### 4. Member reader — `src/app/member/ebooks/[id]/page.tsx`

Branch on `ebook.pdf_url` after the existing 401/403/404 handling (unchanged):

- **`pdf_url` set →** render a new `PdfEbookViewer` client component inside the existing hero shell
  (title, subtitle, reading time, footnote all still render). The viewer:
  - Inline `<object data={pdf_url} type="application/pdf" />` sized to a tall reading frame.
  - Inside `<object>` (fallback content shown when inline PDF isn't supported): a branded card with a
    gold "Download PDF" / "Open in new tab" CTA (`goldButtonStyle`), linking to `pdf_url`.
  - The chapter-count meta line is suppressed/adjusted for PDF ebooks (no chapters).
- **No `pdf_url` →** the existing chapter `<EbookReader>` path, unchanged.

New file: `src/components/common/pdf-ebook-viewer.tsx` (client component; `<object>` + fallback CTA).

## Edge cases

- **PDF ebook opened by a locked-tier member:** backend returns `403` → existing `UpgradeGate`
  (unchanged; the branch is downstream of the 403 catch).
- **PDF mode with empty `pdfUrl` on submit:** blocked by inline validation (see §2).
- **Chapter ebook with a stray `pdf_url`:** cannot occur through this UI (mode is locked to
  `chapters` and submits `pdfUrl: null`). If a backend row somehow has both, the member reader treats
  `pdf_url` as present and shows the PDF (documented precedence: `pdf_url` wins).
- **Missing display fields:** follow the project rule — string → `"-"`, never blank/`undefined`.

## Testing / verification

- `npm run type-check` + `npx eslint` on all touched files.
- Curl `POST /ebooks` with a real admin token to confirm the live response echoes `pdfUrl`, and
  `GET /ebooks/{id}` returns `pdf_url` — before trusting the DTO.
- Manual: create a PDF ebook (upload a real PDF via presign), confirm chapters UI hidden; create a
  chapter ebook, confirm PDF field hidden; edit each and confirm the toggle is locked to the right
  mode; open both as a member and confirm PDF embed + download CTA vs chapter reader.

## Out of scope (fast-follow)

- **Public home ebooks page** (`src/app/(home)/(routes)/ebooks`) shares `EbookReader`. Applying the
  same `pdf_url` branch there for parity is a separate, near-identical follow-up once the member side
  is approved in production.
- No PDF.js / custom in-app page viewer (page controls, thumbnails) — native embed only.
- No in-app PDF **generation** from chapters, and no chapter↔PDF conversion.
