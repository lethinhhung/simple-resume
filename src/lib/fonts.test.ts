import { describe, expect, test } from "vitest";
import { FONT_OPTIONS, getFontLabel } from "./fonts";
import type { FontFamily } from "./types";

describe("getFontLabel", () => {
  test.each(FONT_OPTIONS.map((f) => [f.family, f.label] as const))(
    "returns %s -> %s",
    (family, label) => {
      expect(getFontLabel(family)).toBe(label);
    }
  );

  test("falls back to the raw family name when not in FONT_OPTIONS", () => {
    const unknown = "DoesNotExist" as FontFamily;
    expect(getFontLabel(unknown)).toBe("DoesNotExist");
  });
});

describe("FONT_OPTIONS", () => {
  test("every entry has a label, family, builtin flag, and category", () => {
    for (const opt of FONT_OPTIONS) {
      expect(opt.label).toBeTruthy();
      expect(opt.family).toBeTruthy();
      expect(typeof opt.builtin).toBe("boolean");
      expect(["serif", "sans-serif", "monospace"]).toContain(opt.category);
    }
  });

  test("families are unique", () => {
    const families = FONT_OPTIONS.map((f) => f.family);
    expect(new Set(families).size).toBe(families.length);
  });
});
