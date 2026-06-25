import { describe, expect, test } from "vitest";
import { parseRichText, toggleMarker } from "./rich-text";

describe("parseRichText", () => {
  test("plain text is a single unstyled run", () => {
    expect(parseRichText("hello world")).toEqual([
      { text: "hello world", bold: false, italic: false },
    ]);
  });

  test("empty string yields no runs", () => {
    expect(parseRichText("")).toEqual([]);
  });

  test("strips markers from a bold span", () => {
    expect(parseRichText("**React**")).toEqual([
      { text: "React", bold: true, italic: false },
    ]);
  });

  test("strips markers from an italic span", () => {
    expect(parseRichText("*React*")).toEqual([
      { text: "React", bold: false, italic: true },
    ]);
  });

  test("treats triple markers as bold + italic", () => {
    expect(parseRichText("***React***")).toEqual([
      { text: "React", bold: true, italic: true },
    ]);
  });

  test("splits mixed text into ordered runs", () => {
    expect(parseRichText("Led **React** and *Node* work")).toEqual([
      { text: "Led ", bold: false, italic: false },
      { text: "React", bold: true, italic: false },
      { text: " and ", bold: false, italic: false },
      { text: "Node", bold: false, italic: true },
      { text: " work", bold: false, italic: false },
    ]);
  });

  test("matches across newlines", () => {
    expect(parseRichText("a **b\nc** d")).toEqual([
      { text: "a ", bold: false, italic: false },
      { text: "b\nc", bold: true, italic: false },
      { text: " d", bold: false, italic: false },
    ]);
  });

  test("leaves an unclosed marker literal", () => {
    expect(parseRichText("a ** b")).toEqual([
      { text: "a ** b", bold: false, italic: false },
    ]);
  });

  test("leaves a lone star literal", () => {
    expect(parseRichText("2 * 3 = 6")).toEqual([
      { text: "2 * 3 = 6", bold: false, italic: false },
    ]);
  });

  test("is reusable across calls (no shared regex state)", () => {
    parseRichText("**a**");
    expect(parseRichText("**b**")).toEqual([
      { text: "b", bold: true, italic: false },
    ]);
  });
});

describe("toggleMarker", () => {
  const wrap = (text: string, a: string) => {
    const start = text.indexOf(a);
    return toggleMarker(text, start, start + a.length, "**");
  };

  test("wraps a selection in bold", () => {
    expect(wrap("Led React work", "React")).toEqual({
      value: "Led **React** work",
      selectionStart: 6,
      selectionEnd: 11,
    });
  });

  test("wraps a selection in italic", () => {
    const r = toggleMarker("Led React work", 4, 9, "*");
    expect(r.value).toBe("Led *React* work");
    expect("Led *React* work".slice(r.selectionStart, r.selectionEnd)).toBe("React");
  });

  test("is a no-op on an empty selection", () => {
    expect(toggleMarker("hello", 2, 2, "**")).toEqual({
      value: "hello",
      selectionStart: 2,
      selectionEnd: 2,
    });
  });

  test("unwraps when markers are inside the selection", () => {
    // select the whole "**React**"
    const r = toggleMarker("Led **React** work", 4, 13, "**");
    expect(r.value).toBe("Led React work");
    expect("Led React work".slice(r.selectionStart, r.selectionEnd)).toBe("React");
  });

  test("unwraps when markers hug the selection", () => {
    // select just "React"; the markers sit immediately outside
    const r = toggleMarker("Led **React** work", 6, 11, "**");
    expect(r.value).toBe("Led React work");
    expect("Led React work".slice(r.selectionStart, r.selectionEnd)).toBe("React");
  });

  test("bold then italic on the same selection stacks to ***...***", () => {
    const bold = wrap("Led React work", "React");
    // selection now hugs the inner word; apply italic with the shifted range
    const both = toggleMarker(bold.value, bold.selectionStart, bold.selectionEnd, "*");
    expect(both.value).toBe("Led ***React*** work");
    expect(both.value.slice(both.selectionStart, both.selectionEnd)).toBe("React");
  });

  test("italic toggle does not corrupt an adjacent bold marker", () => {
    // "React" inside "**React**": italic must wrap, not eat the bold stars
    const r = toggleMarker("Led **React** work", 6, 11, "*");
    expect(r.value).toBe("Led ***React*** work");
  });
});
