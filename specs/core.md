# Core Spec

## Overview

Next.js application for creating ATS-friendly Harvard-style resumes with
realtime preview and PDF export.

The product targets job seekers who want a clean, structured resume without
fighting word processors or wrestling with formatting. One template, one page,
no decisions to agonize over — open the app, fill in your sections (or let **AI
Autofill** draft them from pasted text), export a PDF that passes every ATS
parser.

## Design Principles

- **Minimal editing workflow** — The interface gets out of the way. No
  drag-and-drop styling, no theme galleries. Structured form inputs map
  directly to resume sections.
- **Deterministic rendering** — The same data always produces the same output.
  No layout guesswork, no surprises between preview and export.
- **One-page optimized layout** — Content is constrained and reflowed to fit a
  single US Letter page. Overflow is handled by font-size reduction and spacing
  compression, never by spilling to a second page.
- **ATS-safe formatting** — Semantic structure, standard fonts, no columns, no
  tables-for-layout, no images, no icons in the PDF output. Machine-readable
  text order matches visual order.
- **Fast PDF generation** — Export completes in under 2 seconds on a modern
  machine. No server round-trip required for generation.

(Autofill-specific principles live in §AI Autofill.)

## User Capabilities

1. **Create and edit resumes** — Start from a blank Harvard-style template.
   Fill in structured fields. Edits reflect immediately in the preview.
2. **Customize resume structure** — Add, remove, reorder, and rename sections.
   Choose from predefined section types (Text, Entry, Education, Skills, List).
   Multiple sections of the same type are allowed.
3. **Preview resumes in realtime** — A live preview renders the resume exactly
   as it will appear in the exported PDF, updating on every keystroke.
4. **Export resumes as PDF** — One-click export produces a downloadable PDF
   that preserves the preview layout.
5. **Save resume data locally** — Resume data persists in browser localStorage.
   No account required. Data survives reloads and restarts.
6. **Autofill from pasted text** — Paste free-form text (and an optional
   writing-style instruction) and have AI structure and re-voice it into the
   resume in one action. See §AI Autofill.
7. **Emphasize keywords inline** — Mark **bold** and *italic* spans inside
   free-text fields to draw the eye to keywords. See §Inline Emphasis.

## Resume Form

The resume is composed of a **header block** and a list of **sections**. Each
section has a type that determines its field structure. The form ships with a
default Harvard layout that users can customize freely.

### Header Block (always present)

| Field    | Required | Notes                                         |
|----------|----------|-----------------------------------------------|
| Name     | Yes      | Rendered centered, bold, ALL CAPS             |
| Subtitle | No       | Job title or tagline, centered below name     |
| Contact  | Yes      | List of contact items (email, phone, location, links), rendered as a single hyphen-separated line |

### Section Types

| Type       | Fields per entry                                          | Default label     |
|------------|-----------------------------------------------------------|-------------------|
| Text       | Free-text paragraph                                       | Objective         |
| Entry      | Title (bold), subtitle, location, dates (right-aligned), description paragraph, bullet points (hyphen) | Experience |
| Education  | Institution (bold, caps), location, degree + field, dates, GPA (optional), description (optional) | Education |
| Skills     | Category label (bold) + colon, comma-separated values     | Technical Skills  |
| List       | Name, detail fields (issuer/score/date), dates (right-aligned) | Certification |

Users can have **multiple sections of the same type** (e.g., two Entry sections
— "Relevant Experience" and "Projects").

### Inline Emphasis (Rich Text)

Free-text **body** fields support inline **bold** and *italic* emphasis so users
can highlight keywords (skills, tools, metrics) without leaving the form.

- **Marker syntax** — lightweight, Markdown-style and stored *inline in the
  existing `string` fields*: `**bold**`, `*italic*`, `***bold italic***`. No
  schema change, no data migration; persistence, the store, and the normalizer
  are untouched (markers are just characters in the string).
- **Where it applies** — only genuinely free-text body fields: Text `content`,
  Entry `description` and `bullets`, Education `description`, List `detail`,
  Skills `values`. Structured/label fields (name, subtitle, contacts, entry
  title, subtitle, location, dates, gpa, institution, degree, skill category,
  list name) keep their fixed template formatting and render markers literally —
  the editor does not offer emphasis controls on them.
- **Rendering** — at render time a deterministic parser splits the string into
  styled runs and the PDF renderer emits nested `Text` runs with the matching
  weight/style; the literal asterisks are **stripped** from the output. Bold and
  italic are real font variants (every shipped font registers both), so output
  stays **ATS-safe** — machine-readable text with no asterisks and no graphics.
- **Unmatched / malformed markers** render as literal text (no crash, no
  partial styling): a lone `*` or an unclosed `**` stays verbatim.
- **Editor affordance** — rich-text fields expose a **B** / *I* control (shown
  on focus) and Cmd/Ctrl+B / Cmd/Ctrl+I shortcuts that wrap or unwrap the
  current selection. Applying bold then italic to the same selection yields
  `***…***`.

### Default Sections

New resumes start with this layout (all removable except Header): Header,
Objective (Text), Education, Technical Skills (Skills), Relevant Experience
(Entry), Projects (Entry), Certification (List). Users can rename labels,
reorder via move-up/down controls, toggle sections on/off, and add new sections
from the type list.

## Template

Exactly one template: **Harvard**. The template controls *how* the resume looks,
not *what* it contains.

- Single-column layout
- Header: name centered ALL CAPS, subtitle centered bold below, contact on one
  hyphen-separated line
- Section headers: centered, bold, underlined
- Two-column alignment: entity/label left, location/dates right
- Bullet points use hyphens (`-`); Skills use bold category labels with a colon
- Inline **bold**/*italic* emphasis is allowed inside body text (see §Inline
  Emphasis); it is the only per-character styling the template permits
- Serif font (Times New Roman or equivalent), 10–11pt; 0.5in margins
- No color, no icons, no graphics

## AI Autofill

A user pastes **free-form text** — a rough draft, an old resume's text, a
LinkedIn "About" dump, notes — and the app uses an LLM to structure and re-voice
it into the app's `ResumeData`, then applies it to the editor. An optional
**writing-style** instruction shapes voice and phrasing. The feature is
**additive**: with it removed or the network unavailable, every other capability
still works fully offline.

### Principles

- **Server-proxied key** — The Gemini API key is app-owned, stored only in a
  server environment variable (`GEMINI_API_KEY`) and read only by the
  `/api/autofill` route handler. It is **never** shipped in the client bundle.
  The browser calls our route; the route calls Gemini.
- **The validator is the source of truth, not the LLM** — LLM output is
  untrusted input. A deterministic, hand-written normalizer coerces the response
  into a valid `ResumeData` on the client *before* it touches the store.
  Malformed, partial, or hallucinated output is repaired or rejected, never
  applied raw.
- **Restyle, never fabricate** — The writing-style instruction may rephrase,
  tighten, or re-voice the pasted content, but the system prompt forbids
  inventing facts the source text does not contain — no made-up employers,
  titles, dates, metrics, or skills. Style governs *how* content reads, not
  *what* it claims. As part of presentation, the model may **emphasize** a few
  keywords already in the source with inline `**bold**`/`*italic*` markers (see
  §Inline Emphasis); emphasis is styling, never a license to add content.
- **Fail closed, never half-apply** — The resume is mutated only after a fully
  validated `ResumeData` is in hand. Any error (network, quota, invalid JSON,
  schema mismatch) leaves the existing resume untouched.
- **Informed consent for personal data** — A resume is personal data. The
  dialog discloses, before the user sends anything, that submitted text is sent
  to Google and that Gemini's free tier may use it for model training.
- **Best-effort abuse guard** — Because the key is app-owned, the route guards
  itself: a per-IP sliding-window limit (5 requests / 10 minutes), a strict
  request-size cap, and a same-origin check. The limiter is in-memory (per
  serverless instance, resets on cold start) — best-effort, not a hard security
  boundary; Gemini's own daily quota is the ultimate ceiling.

### User Flow

1. An **Autofill** button in the editor toolbar opens the Autofill dialog.
2. The dialog presents:
   - A multi-line **textarea** for free-format content.
   - An optional **writing-style** field for voice/phrasing instructions; blank
     yields a neutral, faithful rendering.
   - A short **privacy disclosure** (text is sent to Google; free-tier training
     note).
   - An **Autofill** button, disabled when the textarea is empty.
3. On submit:
   1. POST the pasted text + writing-style to `/api/autofill`.
   2. The route enforces the size cap, same-origin, and rate limit (responding
      429 with a retry time when exhausted), then calls Gemini with a response
      schema mirroring `ResumeData`, requesting structured JSON.
   3. The client runs the response through the normalizer → a validated
      `ResumeData`.
   4. The store's autofill action replaces the resume.
   5. Close the dialog. On any error, keep it open and show the specific
      failure; do not mutate the resume.

### Semantics

- A successful autofill **replaces** the current resume's `header` and
  `sections`. Because this is destructive, the dialog requires explicit
  confirmation when the current resume is non-default.
- `pageSettings` (font, size, margins) are **preserved** — they are layout
  preferences, not content present in the pasted text.
- All `id` fields are generated locally via `generateId()`. The LLM is never
  trusted to mint ids.

### Writing Style

The optional instruction controls the *voice* of the generated content — tone,
bullet phrasing, tense, and emphasis.

- **Wording only.** The model may turn "did sales, numbers went up" into "Drove
  revenue growth through targeted sales initiatives", but may not invent a
  figure, employer, date, or skill the source never mentioned.
- **Sparing emphasis.** The model may wrap a handful of high-signal keywords per
  resume in `**bold**`/`*italic*` markers, but only inside the free-text body
  fields listed in §Inline Emphasis — never in structured fields (names, titles,
  dates). Over-emphasis is discouraged; when in doubt, leave text unmarked.
- **Cannot alter structure.** Output shape is fixed by the response schema and
  re-enforced by the normalizer; the field cannot produce an invalid
  `ResumeData`.
- **Sensible defaults the style can override.** With no instruction, output is
  written in English (source translated; proper nouns and contacts kept
  verbatim), in concise professional resume voice (no name or third-person
  narration), suited to the source's own profession (no assumed field), and
  omits purely personal hobbies. A style instruction can change any of these —
  e.g. another language, a target field, or to include interests.
- **Persisted for convenience** in `simple-resume-autofill-style`; blank is the
  default.

### Normalizer Contract ("fixed code formatter")

Input: an arbitrary parsed JSON value. Output: a valid `ResumeData`, or a typed
error.

- **Header**: `name`/`subtitle` coerced to strings (default `""`); `contacts`
  mapped to `ContactItem[]` with fresh ids, dropping empty/non-string values.
- **Sections**: each candidate's `data.type` must be one of `text | entry |
  education | skills | list`; unknown or missing type → dropped. Each kept
  section gets a fresh `id`, `enabled: true`, and a `label` (LLM-suggested, or
  the type's default when absent).
- **Per-type fields**: only fields defined in `src/lib/types.ts` for that type
  are kept; unknown fields stripped; missing fields default to `""` (or `[]` for
  `bullets`). Nested items (entries, categories, list items) get fresh ids.
- **Result**: always a structurally valid `ResumeData`. Zero valid sections →
  an error, not an empty resume.

Pure and deterministic (no network; randomness only via `generateId()`);
unit-tested against representative and adversarial payloads.

### Server Route Contract

`src/app/api/autofill/route.ts` (POST):

- Reads `GEMINI_API_KEY` from the server environment; responds 500 if unset.
- Rejects bodies over the size cap (413) and requests whose `Origin` is not the
  site (403).
- Enforces the per-IP sliding-window limit; 429 with a retry hint when
  exhausted.
- Forwards `{ text, style }` to Gemini with the `ResumeData` response schema and
  returns Gemini's JSON (or a typed error). It holds no resume data and persists
  nothing.

### Rate Limit

The sliding-window logic is a pure, unit-tested helper backing the route:

- Limit: **5 requests / 10-minute window**, keyed by client IP.
- `checkRateLimit(key, now)` → `{ allowed, remaining, retryAfterMs }` where
  `retryAfterMs` is the time until the oldest in-window request ages out.
- `recordRequest(key, now)` appends a timestamp and prunes aged-out entries.
- `now` is injectable for deterministic tests. State is an in-memory map (per
  instance, best-effort).

## Architecture Constraints

- **Client-first** — All resume editing, preview, PDF generation, and
  persistence happen in the browser. The sole server component is the stateless
  `/api/autofill` proxy, which holds the Gemini key and forwards requests; it
  stores nothing and never touches persisted resume data.
- **Single framework** — Next.js handles the app shell, resume rendering, and
  the one route handler. No separate services.
- **Offline-capable core** — Every capability except Autofill works with no
  network. Autofill is the only network-dependent feature.
- **Deterministic PDF output** — Byte-identical output for identical input data
  across browsers.
- **Untrusted LLM boundary** — Gemini output reaches the store only through the
  normalizer.

## Technology

- **Framework**: Next.js (App Router), TypeScript strict
- **Styling**: Tailwind CSS + shadcn/ui (`@base-ui/react` primitives)
- **State**: Zustand with `persist` middleware. Form inputs are plain controlled
  components bound to the store — no react-hook-form, no zod.
- **PDF**: `@react-pdf/renderer`, client-side
- **AI Autofill**: a Next.js Route Handler proxy → Google Gemini REST API with
  structured output (`responseSchema` / JSON response mode); a hand-written
  TypeScript normalizer; an in-memory rate limiter. No new runtime dependency.
- **Storage**: Browser localStorage, JSON serialization
- **Testing**: Vitest (jsdom) for unit tests, Playwright for e2e

## Storage Keys

- `simple-resume-data` — resume content (persisted store).
- `simple-resume-theme` — light/dark theme.
- `simple-resume-autofill-style` — last-used writing-style instruction
  (convenience only).

## In-Scope

- Single Harvard template, structured form editing, realtime preview,
  client-side PDF export, localStorage persistence, responsive editor,
  add/remove/reorder/rename sections with multiple section types.
- Inline **bold**/*italic* emphasis in free-text body fields, stored as inline
  markers; editor controls + keyboard shortcuts; ATS-safe styled PDF output.
- AI Autofill: free-form text → `ResumeData` via the app's server proxy;
  optional writing-style re-voicing; deterministic normalizer; best-effort
  server-side rate limiting; privacy disclosure; destructive-replace
  confirmation.

## Out-of-Scope

- User accounts/authentication; server-side resume storage or database.
- Multiple templates; custom fonts/colors beyond page settings; multi-page
  resumes.
- File / LinkedIn / PDF / DOCX import (Autofill is text-paste only).
- **Fabricating content** — inventing employers, titles, dates, metrics, or
  skills absent from the pasted text.
- BYOK / user-supplied API keys; multi-LLM provider abstraction (Gemini only).
- Durable or distributed rate limiting (in-memory best-effort only).
- Incremental merge into an existing resume (Autofill replaces).
- Collaboration/sharing; cover letters; print-specific CSS; localization beyond
  English.

## Success Criteria

1. A user can go from zero to exported PDF in under 5 minutes.
2. Exported PDF passes ATS parsing validation (Jobscan or equivalent).
3. Preview matches exported PDF with no visible discrepancies.
4. Resume data survives browser restart without loss.
5. A user can paste plain-text and land a populated, structurally valid editor
   in one action.
6. A malformed or adversarial LLM response never corrupts the store — it is
   repaired by the normalizer or surfaced as an error.
7. With the network disabled, every non-Autofill capability still works.

## Tests

Unit tests live next to source as `*.test.ts`/`*.test.tsx`. Vitest runs them in
a jsdom environment. Each spec below is a contract — when a test fails, the spec
is the source of truth for what the code should do. UI wiring and the live
Gemini call are covered by e2e/mocks, not unit tests.

### Store: Section Management

**Surface**: `useResumeStore` in `src/store/resume-store.ts`.

- `addSection(type)` appends a section with the type's default label, the type's
  empty default data shape, and `enabled: true`.
- `addSection` allows multiple sections of the same type.
- `removeSection(id)` removes only the matching section; preserves order.
- `renameSection(id, label)` updates only the target's label.
- `toggleSection(id)` flips only the target's `enabled` flag.
- `moveSection(id, "up" | "down")` swaps with the adjacent section; no-ops at
  the boundary.
- `reorderSections(from, to)` moves the section and shifts the rest, both
  directions.

### Store: Header, Section Data, Page Settings, Reset

- `updateHeader(partial)` merges into the existing header; unspecified fields
  preserved.
- `updateSection(id, data)` replaces the data payload; leaves `id`/`label`/
  `enabled` untouched.
- `updatePageSettings(partial)` merges into existing page settings.
- `resetResume()` restores the store to `DEFAULT_RESUME`.

### Store: Autofill Action

**Surface**: `useResumeStore` in `src/store/resume-store.ts`.

- The autofill action replaces `header` and `sections` with the provided
  `ResumeData`.
- The autofill action **preserves** the existing `pageSettings`.
- The replacement persists to `simple-resume-data` like any other mutation.

### Store: Persistence and Hydration

The store uses zustand `persist` with key `simple-resume-data`, plus a custom
`merge` that deep-merges `pageSettings`.

- After any mutating action, the serialized state reflects the new data.
- The custom `merge` deep-merges `pageSettings`: missing keys fall back to the
  current default rather than becoming `undefined`.
- If persisted state has no `resume` field, `merge` returns the current state
  unchanged.

### Lib: Rate Limit

**Surface**: `src/lib/rate-limit.ts`.

- Under the limit, `checkRateLimit` reports `allowed: true` with the correct
  `remaining`.
- At 5 in-window requests, the 6th reports `allowed: false` with positive
  `retryAfterMs`.
- A request older than the 10-minute window is pruned and frees a slot.
- An unknown key / empty state is treated as an empty log (no throw).

### Lib: Autofill Normalizer

**Surface**: `src/lib/autofill/normalize.ts`.

- A well-formed payload maps to a valid `ResumeData`; every `id` is freshly
  generated, not taken from the payload.
- A section with an unknown `data.type` is dropped; valid siblings survive.
- Unknown fields on a known type are stripped; missing fields default to `""` /
  `[]`.
- A section missing a `label` receives the type's default label.
- A payload yielding zero valid sections returns an error, not an empty resume.
- Non-object / non-JSON input returns a typed error rather than throwing.

### Lib: Rich Text

**Surface**: `src/lib/rich-text.ts`.

- `parseRichText(s)` splits a string into ordered runs `{ text, bold, italic }`;
  plain text yields a single unstyled run.
- `**x**` → bold run, `*x*` → italic run, `***x***` → bold+italic run, with the
  surrounding asterisks stripped from `text`.
- Unmatched or unclosed markers (a lone `*`, a dangling `**`) stay literal in a
  plain run; the function never throws.
- `toggleMarker(text, start, end, marker)` wraps the `[start, end)` selection in
  the marker and returns the new value plus the shifted selection.
- `toggleMarker` is a no-op when the selection is empty.
- `toggleMarker` **unwraps** when the selection is already wrapped — markers
  immediately inside or immediately outside the selection — without corrupting an
  adjacent marker of the other kind (`*` vs `**`).

### Utilities

**Surface**: `src/lib/id.ts`, `src/lib/utils.ts`, `src/lib/fonts.ts`.

- `generateId()` returns a unique string on every call.
- `cn(...)` resolves Tailwind conflicts via `tailwind-merge` (later wins) and
  ignores falsy inputs.
- `getFontLabel(family)` returns the human label from `FONT_OPTIONS`, falling
  back to the raw family name when not found.

### Hooks: useTheme

**Surface**: `src/hooks/use-theme.ts`.

- Reads initial theme from `localStorage["simple-resume-theme"]` when set.
- Falls back to `prefers-color-scheme` when storage is empty.
- `toggleTheme()` flips the theme, writes it to localStorage, and toggles the
  `dark` class on `<html>`.

**Out of scope (unit)**: PDF rendering, editor form components, the Autofill
dialog, and the server route's live network call (covered by e2e).
