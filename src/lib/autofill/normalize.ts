// The "fixed code formatter": coerces an arbitrary, untrusted JSON value (an LLM
// response) into a structurally valid `ResumeData`, or returns a typed error.
// This is the source of truth — not the model. All ids are regenerated locally;
// unknown fields are stripped; unknown section types are dropped.

import { generateId } from "@/lib/id";
import { DEFAULT_RESUME } from "@/lib/defaults";
import type {
  ResumeData,
  HeaderBlock,
  Section,
  SectionData,
  SectionType,
  EntryItem,
  EducationItem,
  SkillCategory,
  ListItem,
} from "@/lib/types";

export type NormalizeResult =
  | { ok: true; data: ResumeData }
  | { ok: false; error: string };

const DEFAULT_LABELS: Record<SectionType, string> = {
  text: "Objective",
  entry: "Experience",
  education: "Education",
  skills: "Technical Skills",
  list: "Certification",
};

const VALID_TYPES = new Set<SectionType>([
  "text",
  "entry",
  "education",
  "skills",
  "list",
]);

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

/** Skills values may arrive as a string or an array of strings. */
function joinValues(v: unknown): string {
  if (Array.isArray(v)) {
    return v
      .map(str)
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");
  }
  return str(v);
}

function normalizeHeader(raw: unknown): HeaderBlock {
  const o = isObject(raw) ? raw : {};
  const contacts = arr(o.contacts)
    .map((c) => {
      if (typeof c === "string") return c.trim();
      if (isObject(c) && typeof c.value === "string") return c.value.trim();
      return "";
    })
    .filter((value) => value.length > 0)
    .map((value) => ({ id: generateId(), value }));

  return { name: str(o.name), subtitle: str(o.subtitle), contacts };
}

function entryItem(raw: unknown): EntryItem {
  const o = isObject(raw) ? raw : {};
  return {
    id: generateId(),
    title: str(o.title),
    subtitle: str(o.subtitle),
    location: str(o.location),
    dates: str(o.dates),
    description: str(o.description),
    bullets: arr(o.bullets)
      .map(str)
      .map((b) => b.trim())
      .filter(Boolean),
  };
}

function educationItem(raw: unknown): EducationItem {
  const o = isObject(raw) ? raw : {};
  return {
    id: generateId(),
    institution: str(o.institution),
    location: str(o.location),
    degree: str(o.degree),
    dates: str(o.dates),
    gpa: str(o.gpa),
    description: str(o.description),
  };
}

function skillCategory(raw: unknown): SkillCategory {
  const o = isObject(raw) ? raw : {};
  return {
    id: generateId(),
    category: str(o.category),
    values: joinValues(o.values),
  };
}

function listItem(raw: unknown): ListItem {
  const o = isObject(raw) ? raw : {};
  return {
    id: generateId(),
    name: str(o.name),
    detail: str(o.detail),
    dates: str(o.dates),
  };
}

function normalizeData(type: SectionType, p: Record<string, unknown>): SectionData {
  switch (type) {
    case "text":
      return { type: "text", content: str(p.content) || str(p.text) };
    case "entry":
      return { type: "entry", entries: arr(p.entries).map(entryItem) };
    case "education":
      return { type: "education", entries: arr(p.entries).map(educationItem) };
    case "skills":
      return { type: "skills", categories: arr(p.categories).map(skillCategory) };
    case "list":
      return { type: "list", items: arr(p.items).map(listItem) };
  }
}

function normalizeSection(raw: unknown): Section | null {
  if (!isObject(raw)) return null;

  // Tolerate both the flat shape (fields on the section) and a nested `data`.
  const payload = isObject(raw.data) ? raw.data : raw;
  const rawType = str(raw.type) || str(payload.type);
  if (!VALID_TYPES.has(rawType as SectionType)) return null;
  const type = rawType as SectionType;

  const label =
    str(raw.label).trim() || str(payload.label).trim() || DEFAULT_LABELS[type];

  return {
    id: generateId(),
    label,
    enabled: true,
    data: normalizeData(type, payload),
  };
}

export function normalizeResume(input: unknown): NormalizeResult {
  let value = input;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return { ok: false, error: "Response was not valid JSON." };
    }
  }

  if (!isObject(value)) {
    return { ok: false, error: "Response was not a JSON object." };
  }

  const header = normalizeHeader(value.header);
  const sections = arr(value.sections)
    .map(normalizeSection)
    .filter((s): s is Section => s !== null);

  if (sections.length === 0) {
    return { ok: false, error: "No usable resume sections were found." };
  }

  // pageSettings is layout, not content; the store preserves the existing one.
  // A placeholder keeps the result a complete, valid ResumeData.
  return {
    ok: true,
    data: { header, sections, pageSettings: DEFAULT_RESUME.pageSettings },
  };
}
