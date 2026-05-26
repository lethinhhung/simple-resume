## Stage 1: Project Setup + Data Layer

**Goal**: Initialize Next.js project with TypeScript, Tailwind, Zustand store, and resume data types.
**Success Criteria**: App runs, types compile, store persists to localStorage, default resume data matches reference PDF structure.
**Tests**: Zustand store unit tests — create, update, persist, hydrate.
**Status**: Complete

## Stage 2: Resume Preview Renderer

**Goal**: Build Harvard template renderer matching the reference PDF exactly.
**Success Criteria**: Centered ALL CAPS name, subtitle, hyphen-separated contact, centered bold underlined section headers, two-column alignment, hyphen bullets, bold skills labels, Times New Roman 10–11pt, 0.5in margins.
**Tests**: Renderer renders all 5 section types, snapshot tests for layout.
**Status**: Complete

## Stage 3: Editor Form

**Goal**: Build form editor for all section types wired to Zustand store.
**Success Criteria**: Header fields, section-specific forms, add/remove entries, live preview updates on keystroke.
**Tests**: Form interaction tests — edit field, verify store update.
**Status**: Complete

## Stage 4: Section Management

**Goal**: Add/remove/reorder/rename sections, type picker, toggle on/off.
**Success Criteria**: All section management operations work, multiple sections of same type allowed.
**Tests**: Section CRUD operations, reorder, toggle.
**Status**: In Progress

## Stage 5: PDF Export + Responsive Layout

**Goal**: Client-side PDF generation matching preview, responsive layout.
**Success Criteria**: One-click PDF download, desktop side-by-side, mobile tabbed, one-page constraint with overflow compression.
**Tests**: PDF generates without error, responsive breakpoints work.
**Status**: Not Started
