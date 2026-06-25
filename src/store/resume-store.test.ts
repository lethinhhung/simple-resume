import { beforeEach, describe, expect, test } from "vitest";
import { useResumeStore } from "./resume-store";
import { DEFAULT_RESUME } from "@/lib/defaults";
import type { ResumeData, SectionType } from "@/lib/types";

const DEFAULT_LABEL: Record<SectionType, string> = {
  text: "Objective",
  entry: "Experience",
  education: "Education",
  skills: "Technical Skills",
  list: "Certification",
};

const EMPTY_DEFAULT = {
  text: { type: "text", content: "" },
  entry: { type: "entry", entries: [{ title: "", subtitle: "", location: "", dates: "", description: "", bullets: [] }] },
  education: { type: "education", entries: [{ institution: "", location: "", degree: "", dates: "", gpa: "", description: "" }] },
  skills: { type: "skills", categories: [{ category: "", values: "" }] },
  list: { type: "list", items: [{ name: "", detail: "", dates: "" }] },
} as const;

function getSections() {
  return useResumeStore.getState().resume.sections;
}

beforeEach(() => {
  localStorage.clear();
  useResumeStore.setState({ resume: structuredClone(DEFAULT_RESUME) });
});

describe("addSection", () => {
  test.each<SectionType>(["text", "entry", "education", "skills", "list"])(
    "appends a %s section with default label, empty data, and enabled=true",
    (type) => {
      const before = getSections().length;
      useResumeStore.getState().addSection(type);

      const sections = getSections();
      expect(sections).toHaveLength(before + 1);

      const added = sections[sections.length - 1];
      expect(added.label).toBe(DEFAULT_LABEL[type]);
      expect(added.enabled).toBe(true);
      expect(added.id).toEqual(expect.any(String));

      // Compare data ignoring generated ids on nested items.
      const stripIds = (v: unknown): unknown => {
        if (Array.isArray(v)) return v.map(stripIds);
        if (v && typeof v === "object") {
          const out: Record<string, unknown> = {};
          for (const [k, val] of Object.entries(v)) {
            if (k === "id") continue;
            out[k] = stripIds(val);
          }
          return out;
        }
        return v;
      };
      expect(stripIds(added.data)).toEqual(EMPTY_DEFAULT[type]);
    }
  );

  test("allows multiple sections of the same type", () => {
    const { addSection } = useResumeStore.getState();
    addSection("entry");
    addSection("entry");

    const entrySections = getSections().filter((s) => s.data.type === "entry");
    // Default resume already has 2 entry sections (Relevant Experience + Projects)
    // plus the two we just added = 4.
    expect(entrySections).toHaveLength(4);
    const ids = new Set(entrySections.map((s) => s.id));
    expect(ids.size).toBe(4);
  });
});

describe("removeSection", () => {
  test("removes only the matching section and preserves order", () => {
    const before = getSections();
    const target = before[2];

    useResumeStore.getState().removeSection(target.id);

    const after = getSections();
    expect(after).toHaveLength(before.length - 1);
    expect(after.find((s) => s.id === target.id)).toBeUndefined();
    expect(after.map((s) => s.id)).toEqual(
      before.filter((s) => s.id !== target.id).map((s) => s.id)
    );
  });
});

describe("renameSection", () => {
  test("updates only the target section's label", () => {
    const before = getSections();
    const target = before[1];
    const others = before.filter((s) => s.id !== target.id);

    useResumeStore.getState().renameSection(target.id, "My Education");

    const after = getSections();
    expect(after.find((s) => s.id === target.id)?.label).toBe("My Education");
    for (const o of others) {
      expect(after.find((s) => s.id === o.id)?.label).toBe(o.label);
    }
  });
});

describe("toggleSection", () => {
  test("flips only the target section's enabled flag", () => {
    const target = getSections()[0];
    const initial = target.enabled;

    useResumeStore.getState().toggleSection(target.id);
    expect(getSections().find((s) => s.id === target.id)?.enabled).toBe(!initial);

    useResumeStore.getState().toggleSection(target.id);
    expect(getSections().find((s) => s.id === target.id)?.enabled).toBe(initial);

    const untouched = getSections().filter((s) => s.id !== target.id);
    for (const s of untouched) {
      const original = DEFAULT_RESUME.sections.find((d) => d.id === s.id);
      expect(s.enabled).toBe(original?.enabled);
    }
  });
});

describe("moveSection", () => {
  test("swaps with the previous section when moving up", () => {
    const before = getSections().map((s) => s.id);
    const targetId = before[2];

    useResumeStore.getState().moveSection(targetId, "up");

    const after = getSections().map((s) => s.id);
    const expected = [...before];
    [expected[1], expected[2]] = [expected[2], expected[1]];
    expect(after).toEqual(expected);
  });

  test("swaps with the next section when moving down", () => {
    const before = getSections().map((s) => s.id);
    const targetId = before[2];

    useResumeStore.getState().moveSection(targetId, "down");

    const after = getSections().map((s) => s.id);
    const expected = [...before];
    [expected[2], expected[3]] = [expected[3], expected[2]];
    expect(after).toEqual(expected);
  });

  test("no-ops when moving the first section up", () => {
    const before = getSections().map((s) => s.id);
    useResumeStore.getState().moveSection(before[0], "up");
    expect(getSections().map((s) => s.id)).toEqual(before);
  });

  test("no-ops when moving the last section down", () => {
    const before = getSections().map((s) => s.id);
    useResumeStore.getState().moveSection(before[before.length - 1], "down");
    expect(getSections().map((s) => s.id)).toEqual(before);
  });
});

describe("reorderSections", () => {
  test("moves a section forward to the requested index", () => {
    const before = getSections().map((s) => s.id);
    useResumeStore.getState().reorderSections(1, 4);

    const expected = [...before];
    const [moved] = expected.splice(1, 1);
    expected.splice(4, 0, moved);
    expect(getSections().map((s) => s.id)).toEqual(expected);
  });

  test("moves a section backward to the requested index", () => {
    const before = getSections().map((s) => s.id);
    useResumeStore.getState().reorderSections(5, 0);

    const expected = [...before];
    const [moved] = expected.splice(5, 1);
    expected.splice(0, 0, moved);
    expect(getSections().map((s) => s.id)).toEqual(expected);
  });
});

describe("updateHeader", () => {
  test("merges partial fields and preserves the rest", () => {
    const before = useResumeStore.getState().resume.header;
    useResumeStore.getState().updateHeader({ name: "JANE DOE" });

    const after = useResumeStore.getState().resume.header;
    expect(after.name).toBe("JANE DOE");
    expect(after.subtitle).toBe(before.subtitle);
    expect(after.contacts).toEqual(before.contacts);
  });
});

describe("updateSection", () => {
  test("replaces the section's data and leaves id/label/enabled untouched", () => {
    const target = getSections().find((s) => s.data.type === "text")!;
    const newData = { type: "text", content: "Updated objective" } as const;

    useResumeStore.getState().updateSection(target.id, newData);

    const after = getSections().find((s) => s.id === target.id)!;
    expect(after.data).toEqual(newData);
    expect(after.label).toBe(target.label);
    expect(after.enabled).toBe(target.enabled);
  });
});

describe("updatePageSettings", () => {
  test("merges partial settings", () => {
    const before = useResumeStore.getState().resume.pageSettings;
    useResumeStore.getState().updatePageSettings({ fontSize: 12 });

    const after = useResumeStore.getState().resume.pageSettings;
    expect(after.fontSize).toBe(12);
    expect(after.fontFamily).toBe(before.fontFamily);
    expect(after.marginTop).toBe(before.marginTop);
    expect(after.marginBottom).toBe(before.marginBottom);
    expect(after.marginLeft).toBe(before.marginLeft);
    expect(after.marginRight).toBe(before.marginRight);
  });
});

describe("resetResume", () => {
  test("restores DEFAULT_RESUME", () => {
    useResumeStore.getState().updateHeader({ name: "MUTATED" });
    useResumeStore.getState().removeSection(getSections()[0].id);

    useResumeStore.getState().resetResume();

    expect(useResumeStore.getState().resume).toEqual(DEFAULT_RESUME);
  });
});

describe("persistence", () => {
  test("writes resume state to localStorage on mutation", () => {
    useResumeStore.getState().updateHeader({ name: "PERSISTED" });

    const raw = localStorage.getItem("simple-resume-data");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.resume.header.name).toBe("PERSISTED");
  });

  test("merge deep-merges pageSettings with current defaults", () => {
    const merge = useResumeStore.persist.getOptions().merge!;
    const current = {
      resume: structuredClone(DEFAULT_RESUME),
    } as Parameters<typeof merge>[1];
    const persisted = {
      resume: {
        ...structuredClone(DEFAULT_RESUME),
        pageSettings: { fontSize: 13 },
      },
    };

    const merged = merge(persisted, current) as { resume: typeof DEFAULT_RESUME };
    expect(merged.resume.pageSettings.fontSize).toBe(13);
    expect(merged.resume.pageSettings.fontFamily).toBe(
      DEFAULT_RESUME.pageSettings.fontFamily
    );
    expect(merged.resume.pageSettings.marginTop).toBe(
      DEFAULT_RESUME.pageSettings.marginTop
    );
  });

  test("merge returns current state unchanged when persisted has no resume", () => {
    const merge = useResumeStore.persist.getOptions().merge!;
    const current = {
      resume: structuredClone(DEFAULT_RESUME),
    } as Parameters<typeof merge>[1];

    const merged = merge({}, current);
    expect(merged).toBe(current);
  });
});

describe("autofillResume", () => {
  const incoming: ResumeData = {
    header: {
      name: "AUTOFILLED PERSON",
      subtitle: "Imported Subtitle",
      contacts: [{ id: "x1", value: "new@example.com" }],
    },
    sections: [
      {
        id: "new-s1",
        label: "Summary",
        enabled: true,
        data: { type: "text", content: "Autofilled summary." },
      },
    ],
    pageSettings: {
      marginTop: 9,
      marginBottom: 9,
      marginLeft: 9,
      marginRight: 9,
      fontSize: 99,
      fontFamily: "Courier",
    },
  };

  test("replaces header and sections with the provided data", () => {
    useResumeStore.getState().autofillResume(incoming);

    const after = useResumeStore.getState().resume;
    expect(after.header).toEqual(incoming.header);
    expect(after.sections).toEqual(incoming.sections);
  });

  test("preserves the existing pageSettings and ignores the incoming ones", () => {
    const before = useResumeStore.getState().resume.pageSettings;
    useResumeStore.getState().autofillResume(incoming);

    const after = useResumeStore.getState().resume.pageSettings;
    expect(after).toEqual(before);
    expect(after.fontSize).not.toBe(99);
  });

  test("persists the replacement to simple-resume-data", () => {
    useResumeStore.getState().autofillResume(incoming);

    const raw = localStorage.getItem("simple-resume-data");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.resume.header.name).toBe("AUTOFILLED PERSON");
    expect(parsed.state.resume.sections).toHaveLength(1);
  });
});
