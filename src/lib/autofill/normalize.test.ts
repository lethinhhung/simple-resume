import { describe, expect, test } from "vitest";
import { normalizeResume } from "./normalize";
import type { EntrySection } from "@/lib/types";

const wellFormed = {
  header: {
    name: "Jane Doe",
    subtitle: "Senior Engineer",
    contacts: ["jane@example.com", "NYC", ""],
  },
  sections: [
    {
      label: "Experience",
      type: "entry",
      entries: [
        {
          title: "Software Engineer",
          subtitle: "Acme Corp",
          location: "NYC",
          dates: "2020-2023",
          description: "",
          bullets: ["Drove revenue growth", "  "],
        },
      ],
    },
    {
      label: "Skills",
      type: "skills",
      categories: [{ category: "Languages", values: "TypeScript, Go" }],
    },
    { label: "Summary", type: "text", content: "Builder of things." },
    {
      label: "Education",
      type: "education",
      entries: [{ institution: "MIT", degree: "BS CS", dates: "2016-2020" }],
    },
    {
      label: "Certs",
      type: "list",
      items: [{ name: "AWS SA", detail: "", dates: "2022" }],
    },
  ],
};

describe("normalizeResume", () => {
  test("maps a well-formed payload to a valid ResumeData with fresh ids", () => {
    const res = normalizeResume(wellFormed);
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    expect(res.data.header.name).toBe("Jane Doe");
    expect(res.data.header.subtitle).toBe("Senior Engineer");
    // Empty contact dropped; remaining get fresh ids.
    expect(res.data.header.contacts.map((c) => c.value)).toEqual([
      "jane@example.com",
      "NYC",
    ]);
    expect(res.data.header.contacts.every((c) => c.id.length > 0)).toBe(true);

    expect(res.data.sections).toHaveLength(5);
    expect(res.data.sections.every((s) => s.id.length > 0)).toBe(true);

    const entry = res.data.sections.find((s) => s.data.type === "entry")!
      .data as EntrySection;
    expect(entry.entries[0].id.length).toBeGreaterThan(0);
    // Blank bullet trimmed away.
    expect(entry.entries[0].bullets).toEqual(["Drove revenue growth"]);
  });

  test("always regenerates ids, ignoring any id present in the payload", () => {
    const res = normalizeResume({
      header: { name: "A", contacts: [{ id: "EVIL", value: "x@y.z" }] },
      sections: [{ type: "text", label: "X", content: "hi", id: "EVIL-SECTION" }],
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.data.sections[0].id).not.toBe("EVIL-SECTION");
    expect(res.data.header.contacts[0].id).not.toBe("EVIL");
  });

  test("drops a section with an unknown type; valid siblings survive", () => {
    const res = normalizeResume({
      header: { name: "A" },
      sections: [
        { type: "bogus", label: "X" },
        { type: "text", label: "Y", content: "keep me" },
      ],
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.data.sections).toHaveLength(1);
    expect(res.data.sections[0].data.type).toBe("text");
  });

  test("strips unknown fields and defaults missing ones", () => {
    const res = normalizeResume({
      header: { name: "A" },
      sections: [
        { type: "entry", label: "E", entries: [{ title: "T", bogus: "X" }] },
      ],
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const entry = res.data.sections[0].data as EntrySection;
    expect(
      (entry.entries[0] as unknown as Record<string, unknown>).bogus
    ).toBeUndefined();
    expect(entry.entries[0].subtitle).toBe("");
    expect(entry.entries[0].bullets).toEqual([]);
  });

  test("uses the type's default label when label is missing", () => {
    const res = normalizeResume({
      header: { name: "A" },
      sections: [{ type: "skills", categories: [{ category: "c", values: "v" }] }],
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.data.sections[0].label).toBe("Technical Skills");
  });

  test("returns an error when zero valid sections survive", () => {
    expect(normalizeResume({ header: { name: "A" }, sections: [{ type: "x" }] }).ok).toBe(
      false
    );
    expect(normalizeResume({ header: { name: "A" }, sections: [] }).ok).toBe(false);
  });

  test("returns a typed error for non-object / non-JSON input without throwing", () => {
    expect(normalizeResume(null).ok).toBe(false);
    expect(normalizeResume("not json").ok).toBe(false);
    expect(normalizeResume(42).ok).toBe(false);
    expect(() => normalizeResume(undefined)).not.toThrow();
  });
});
