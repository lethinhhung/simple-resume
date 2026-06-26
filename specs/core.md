# Core Spec

## Overview

Next.js application for creating ATS-friendly Harvard-style resumes with
realtime preview and PDF export.

Targets job seekers who want a clean, structured resume without fighting word
processors. One template, one page, no decisions to agonize over — open the
app, fill in your sections (or let **AI Autofill** draft them from pasted
text), export a PDF that passes every ATS parser.

## Design Principles

- **Minimal editing workflow** — Structured form inputs map directly to resume
  sections. No drag-and-drop styling, no theme galleries.
- **Deterministic rendering** — The same data always produces the same output;
  no surprises between preview and export.
- **One-page optimized layout** — Content is reflowed to fit a single US Letter
  page via font-size reduction and spacing compression. Should content still
  exceed one page, it paginates at entry boundaries without ever splitting a
  single entry across the page boundary (see §Template).
- **ATS-safe formatting** — Standard fonts, no columns, no tables-for-layout, no
  images or icons in the PDF. Machine-readable text order matches visual order.
- **Fast PDF generation** — Export completes in under 2 seconds, with no server
  round-trip.

(Autofill-specific principles live in §AI Autofill.)

## User Capabilities

1. **Create and edit resumes** — Start from a blank Harvard-style template; edits
   reflect immediately in the preview.
2. **Customize resume structure** — Add, remove, reorder, and rename sections.
   Choose from predefined types (Text, Entry, Education, Skills, List); multiple
   sections of the same type are allowed.
3. **Preview in realtime** — A live preview renders the resume exactly as the
   exported PDF, updating on every keystroke.
4. **Export as PDF** — One-click export produces a downloadable PDF that
   preserves the preview layout.
5. **Save locally** — Resume data persists in browser localStorage; no account,
   survives reloads and restarts.
6. **Autofill from pasted text** — Paste free-form text (and an optional
   writing-style instruction) and have AI structure and re-voice it in one
   action. See §AI Autofill.
7. **Emphasize keywords inline** — Mark **bold** and *italic* spans inside
   free-text fields to draw the eye to keywords. See §Inline Emphasis.

## Resume Form

A **header block** plus a list of **sections**. Each section's type determines
its fields. Ships with a default Harvard layout users can customize freely.

### Header Block (always present)

| Field    | Required | Notes                                         |
|----------|----------|-----------------------------------------------|
| Name     | Yes      | Centered, bold, ALL CAPS                       |
| Subtitle | No       | Job title or tagline, centered below name     |
| Contact  | Yes      | List of contact items (email, phone, location, links), rendered as a single hyphen-separated line |

### Section Types

| Type       | Fields per entry                                          | Default label     |
|------------|-----------------------------------------------------------|-------------------|
| Text       | Free-text paragraph                                       | Objective         |
| Entry      | Title (bold), subtitle, location, dates (right-aligned), description, bullets (hyphen) | Experience |
| Education  | Institution (bold, caps), location, degree + field, dates, GPA (optional), description (optional) | Education |
| Skills     | Category label (bold) + colon, comma-separated values     | Technical Skills  |
| List       | Name, detail (issuer/score/date), dates (right-aligned)   | Certification     |

Users can have **multiple sections of the same type** (e.g., "Relevant
Experience" and "Projects", both Entry).

### Inline Emphasis (Rich Text)

Free-text **body** fields support inline **bold** and *italic* so users can
highlight keywords without leaving the form.

- **Syntax** — Markdown-style markers stored inline in the existing `string`
  fields: `**bold**`, `*italic*`, `***bold italic***`. No schema change.
- **Where** — only free-text body fields: Text `content`, Entry `description` and
  `bullets`, Education `description`, List `detail`, Skills `values`.
  Structured/label fields render markers literally and offer no emphasis controls.
- **Rendering** — a deterministic parser splits the string into styled runs; the
  PDF emits real font variants and strips the asterisks, keeping output ATS-safe.
- **Malformed markers** (a lone `*`, an unclosed `**`) render as literal text;
  the parser never throws.
- **Editor** — rich-text fields expose **B**/*I* controls (on focus) and
  Cmd/Ctrl+B / Cmd/Ctrl+I shortcuts that wrap or unwrap the selection; applying
  both yields `***…***`.

### Default Sections

New resumes start with: Header, Objective (Text), Education, Technical Skills
(Skills), Relevant Experience (Entry), Projects (Entry), Certification (List).
All removable except Header. Users can rename labels, reorder via move-up/down,
toggle sections on/off, and add new sections from the type list.

## Template

Exactly one template: **Harvard**. It controls *how* the resume looks, not
*what* it contains.

- Single-column layout
- Header: name centered ALL CAPS, subtitle centered bold below, contact on one
  hyphen-separated line
- Section headers: centered, bold, underlined
- Two-column alignment: entity/label left, location/dates right
- Bullets use hyphens (`-`); Skills use bold category labels with a colon
- Inline **bold**/*italic* is the only per-character styling permitted (see
  §Inline Emphasis)
- Serif font (Times New Roman or equivalent), 10–11pt; 0.5in margins
- No color, no icons, no graphics
- **Page-break safety** — A section may span a page boundary, but only between
  its entries: a multi-entry section (e.g. Experience, Projects) breaks between
  whole entries, and a single entry — one job, one degree, one list item, one
  skills line — is never split across pages, moving intact to the next page when
  it does not fit. The centered section header is kept with the start of its
  content rather than stranded alone at the foot of a page. (Free-text
  paragraphs, having no entries, may still flow across the boundary.)

## AI Autofill

A user pastes **free-form text** — a rough draft, an old resume, a LinkedIn
"About" dump — and the app uses an LLM to structure and re-voice it into
`ResumeData`, then applies it to the editor. An optional **writing-style**
instruction shapes voice. The feature is **additive**: with it removed or the
network down, every other capability still works offline.

### Principles

- **Server-proxied key** — The Gemini API key lives only in a server env var
  (`GEMINI_API_KEY`), read only by the `/api/autofill` route. It is never shipped
  to the browser.
- **The validator is the source of truth, not the LLM** — LLM output is
  untrusted; a deterministic normalizer coerces it into valid `ResumeData` on the
  client before it touches the store. Zero valid sections is an error, never an
  empty resume.
- **Restyle, never fabricate** — Style may rephrase or re-voice, but never invent
  facts (employers, titles, dates, metrics, skills) absent from the source. The
  model may emphasize a few existing keywords (§Inline Emphasis); emphasis is not
  a license to add content.
- **Fail closed** — The resume is mutated only after a fully validated
  `ResumeData` is in hand; any error leaves the existing resume untouched.
- **Informed consent** — Before sending, the dialog discloses that text goes to
  Google and that Gemini's free tier may train on it.
- **Best-effort abuse guard** — The route applies a per-IP sliding-window limit
  (5 requests / 10 min), a request-size cap, and a same-origin check. In-memory
  and best-effort, not a hard security boundary.

### Flow

1. An **Autofill** button opens a dialog with a content textarea, an optional
   writing-style field, and a privacy disclosure.
2. On submit, the client POSTs `{ text, style }` to `/api/autofill`, which
   enforces the guards and calls Gemini with a `ResumeData` response schema.
3. The client normalizes the response → validated `ResumeData` → the store's
   autofill action replaces the resume. On any error, the dialog stays open and
   shows the failure; the resume is untouched.

### Semantics

- A successful autofill **replaces** `header` and `sections`; because this is
  destructive, the dialog confirms when the current resume is non-default.
- `pageSettings` (font, size, margins) are **preserved** — layout preferences,
  not pasted content.
- All `id`s are generated locally; the LLM never mints ids.
- The writing-style instruction is persisted (`simple-resume-autofill-style`) for
  convenience. Blank yields a neutral, faithful rendering: English (source
  translated, proper nouns and contacts kept verbatim), concise resume voice, the
  source's own profession, no personal hobbies. A style instruction can override
  any of these.

## Architecture Constraints

- **Client-first** — All editing, preview, PDF generation, and persistence happen
  in the browser. The only server component is the stateless `/api/autofill`
  proxy, which holds the Gemini key, stores nothing, and never touches persisted
  resume data.
- **Single framework** — Next.js handles the app shell, rendering, and the one
  route handler.
- **Offline-capable core** — Every capability except Autofill works with no
  network.
- **Deterministic PDF output** — Byte-identical output for identical input.
- **Untrusted LLM boundary** — Gemini output reaches the store only through the
  normalizer.

## Technology

- **Framework**: Next.js (App Router), TypeScript strict
- **Styling**: Tailwind CSS + shadcn/ui (`@base-ui/react` primitives)
- **State**: Zustand with `persist`; plain controlled inputs (no react-hook-form,
  no zod)
- **PDF**: `@react-pdf/renderer`, client-side
- **AI Autofill**: Next.js Route Handler proxy → Google Gemini REST API with
  structured output; a hand-written TypeScript normalizer; an in-memory rate
  limiter. No new runtime dependency.
- **Storage**: Browser localStorage — `simple-resume-data` (content),
  `simple-resume-theme`, `simple-resume-autofill-style`,
  `simple-resume-autofill-hint-seen` (first-visit Autofill coachmark dismissed)
- **Testing**: Vitest (jsdom) unit tests next to source; Playwright e2e

## In-Scope

- Single Harvard template; structured form editing; realtime preview;
  client-side PDF export; localStorage persistence; add/remove/reorder/rename
  sections with multiple types.
- Inline **bold**/*italic* emphasis in body fields, stored as inline markers,
  with editor controls and ATS-safe styled PDF output.
- AI Autofill: free-form text → `ResumeData` via the server proxy; optional
  writing-style re-voicing; deterministic normalizer; best-effort rate limiting;
  privacy disclosure; destructive-replace confirmation.

## Out-of-Scope

- Accounts/auth; server-side storage or database.
- Multiple templates; custom fonts/colors beyond page settings; multi-page resumes.
- File / LinkedIn / PDF / DOCX import (Autofill is text-paste only).
- **Fabricating content** absent from the pasted text.
- BYOK / user-supplied keys; multi-LLM abstraction (Gemini only).
- Durable/distributed rate limiting (in-memory best-effort only).
- Incremental merge into an existing resume (Autofill replaces).
- Collaboration/sharing; cover letters; localization beyond English.

## Success Criteria

1. Zero to exported PDF in under 5 minutes.
2. Exported PDF passes ATS parsing validation (Jobscan or equivalent).
3. Preview matches exported PDF with no visible discrepancies.
4. Resume data survives browser restart without loss.
5. Pasting plain text yields a populated, structurally valid editor in one action.
6. A malformed or adversarial LLM response never corrupts the store — it is
   repaired by the normalizer or surfaced as an error.
7. With the network disabled, every non-Autofill capability still works.

## Tests

Unit tests live next to source as `*.test.ts(x)` and run under Vitest (jsdom);
the prose contracts above are the source of truth when a test fails. Covered
surfaces: the store (section management, header/data/page-settings/reset,
autofill action, persistence/hydration), the autofill normalizer and rate-limit
helper, rich-text parse/toggle, and the `id`/`cn`/font/theme utilities. PDF
rendering, editor components, the Autofill dialog, and the live Gemini call are
covered by e2e, not unit tests.
