# Core Spec

## Overview

Next.js application for creating ATS-friendly Harvard-style resumes with
realtime preview and PDF export.

The product targets job seekers who want a clean, structured resume without
fighting word processors or wrestling with formatting. One template, one page,
no decisions to agonize over — open the app, fill in your sections, export a
PDF that passes every ATS parser.

## Design Principles

- **Minimal editing workflow** — The interface gets out of the way. No
  drag-and-drop, no style pickers, no theme galleries. Structured form inputs
  map directly to resume sections.
- **Deterministic rendering** — The same data always produces the same output.
  No layout engine guesswork, no floating elements, no surprises between
  preview and export.
- **One-page optimized layout** — Content is constrained and reflowed to fit a
  single US Letter page. Overflow is handled by font-size reduction and
  spacing compression, never by spilling to a second page.
- **ATS-safe formatting** — Semantic HTML structure, standard fonts, no
  columns, no tables-for-layout, no images, no icons in the PDF output.
  Machine-readable text order matches visual order.
- **Fast PDF generation** — Export completes in under 2 seconds on a modern
  machine. No server round-trip required for generation.

## User Capabilities

1. **Create and edit resumes** — Start from a blank Harvard-style template.
   Fill in structured fields. Edits are reflected immediately in the preview
   pane.
2. **Customize resume structure** — Add, remove, reorder, and rename sections.
   Choose from predefined section types (Text, Entry, Education, Skills,
   List). Multiple sections of the same type are allowed.
3. **Preview resumes in realtime** — A live preview renders the resume exactly
   as it will appear in the exported PDF. Preview updates on every keystroke
   without manual refresh.
4. **Export resumes as PDF** — One-click export produces a downloadable PDF
   that preserves the preview layout pixel-for-pixel.
5. **Save resume data locally** — Resume data persists in browser local storage.
   No account required. Data survives page reloads and browser restarts.

## Resume Form

The resume is composed of a **header block** and a list of **sections**. Users
can add, remove, reorder, and rename sections. Each section has a type that
determines its field structure. The form ships with a default Harvard layout
that users can customize freely.

### Header Block (always present)

| Field    | Required | Notes                                         |
|----------|----------|-----------------------------------------------|
| Name     | Yes      | Rendered centered, bold, ALL CAPS             |
| Subtitle | No       | Job title or tagline, centered below name     |
| Contact  | Yes      | List of contact items (email, phone, location, links), rendered as a single hyphen-separated line |

### Section Types

Each section the user adds is one of these types:

| Type       | Fields per entry                                          | Default label     |
|------------|-----------------------------------------------------------|-------------------|
| Text       | Free-text paragraph                                       | Objective         |
| Entry      | Title (bold), subtitle, location, dates (right-aligned), description paragraph, bullet points (hyphen) | Experience |
| Education  | Institution (bold, caps), location, degree + field, dates, GPA (optional), description (optional) | Education |
| Skills     | Category label (bold) + colon, comma-separated values     | Technical Skills  |
| List       | Name, detail fields (issuer/score/date), dates (right-aligned) | Certification |

Users can have **multiple sections of the same type** (e.g., two Entry
sections — one for "Relevant Experience", one for "Projects").

### Default Sections

New resumes start with this layout (all removable except Header):

1. Header (Name + Subtitle + Contact)
2. Objective (Text)
3. Education (Education)
4. Technical Skills (Skills)
5. Relevant Experience (Entry)
6. Projects (Entry)
7. Certification (List)

Users can rename any section label, reorder sections via drag or
move-up/move-down controls, toggle sections on/off, and add new sections
from the type list.

## Template

Phase 1 ships exactly one template: **Harvard**. The template controls
rendering style, not content structure — users customize *what* appears,
the template controls *how* it looks.

- Single-column layout
- Header: name centered ALL CAPS, subtitle centered bold below, contact
  on one hyphen-separated line
- Section headers: centered, bold, underlined
- Two-column alignment: entity/label left, location/dates right
- Bullet points use hyphens (`-`)
- Skills use bold category labels with colon separator
- Font: Times New Roman or equivalent serif, 10–11pt
- Margins: 0.5in all sides
- No color, no icons, no graphics

## In-Scope (Phase 1)

- Single Harvard-style template
- Structured form-based editing
- Realtime preview (side-by-side on desktop, tabbed on mobile)
- Client-side PDF export
- Local storage persistence
- Responsive editor UI (desktop and mobile)
- Customizable form: add/remove/reorder/rename sections, multiple section types

## Out-of-Scope (Phase 1)

- User accounts and authentication
- Server-side storage or database
- Multiple templates or template switching
- Custom styling, fonts, or color options
- Import from LinkedIn, existing PDF, or other formats
- Collaboration or sharing features
- Cover letter generation
- AI-assisted content writing
- Print-specific CSS (PDF export is the only output path)
- Multi-page resume support
- Localization beyond English

Everything not explicitly in-scope is out-of-scope.

## Scope Change Rule

To add a feature to Phase 1, remove an in-scope feature of equivalent
complexity. No silent additions.

## Architecture Constraints

- **Client-only** — No backend server for resume operations. PDF generation,
  data persistence, and all rendering happen in the browser.
- **Single framework** — Next.js handles both the application shell and the
  resume rendering. No separate rendering service.
- **No external runtime dependencies** — The app must function fully offline
  after initial load. No API calls required for core functionality.
- **Deterministic PDF output** — The PDF generation pipeline must produce
  byte-identical output for identical input data across browsers.

## Technology

- **Framework**: Next.js (App Router), TypeScript strict
- **Styling**: Tailwind CSS + shadcn/ui for the editor UI
- **State**: Zustand for resume data, react-hook-form + zod for form validation
- **PDF**: Client-side generation (react-pdf or equivalent)
- **Storage**: Browser localStorage, JSON serialization
- **Testing**: Vitest for unit tests, Playwright for e2e

## Success Criteria

1. A user can go from zero to exported PDF in under 5 minutes
2. Exported PDF passes ATS parsing validation (Jobscan or equivalent)
3. Preview matches exported PDF with no visible discrepancies
4. Resume data survives browser restart without loss
