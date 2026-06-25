// Inline emphasis for free-text body fields. Formatting is stored *inline* in
// the existing string fields using lightweight Markdown-style markers
// (`**bold**`, `*italic*`, `***both***`) so there is no schema change. This
// module is the single source of truth for both directions:
//   - parseRichText: string -> styled runs (used by the PDF renderer)
//   - toggleMarker:  wrap/unwrap a selection (used by the editor toolbar)
// Pure and deterministic; never throws on malformed input.

export interface TextRun {
  text: string;
  bold: boolean;
  italic: boolean;
}

export type Marker = "**" | "*";

// Order matters: try the longest marker first so `***x***` is read as
// bold+italic rather than bold-then-stray-star. `[\s\S]` so multi-line
// descriptions match across newlines. Lazy `+?` keeps spans tight.
const TOKEN =
  /\*\*\*([\s\S]+?)\*\*\*|\*\*([\s\S]+?)\*\*|\*([\s\S]+?)\*/g;

/**
 * Splits a string into ordered runs. Plain text (or any unmatched/unclosed
 * marker) is returned verbatim in unstyled runs; the surrounding asterisks of a
 * matched span are stripped from `text`.
 */
export function parseRichText(input: string): TextRun[] {
  const runs: TextRun[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  // Fresh lastIndex each call (module-level regex is stateful).
  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(input)) !== null) {
    if (match.index > last) {
      runs.push({ text: input.slice(last, match.index), bold: false, italic: false });
    }
    if (match[1] !== undefined) {
      runs.push({ text: match[1], bold: true, italic: true });
    } else if (match[2] !== undefined) {
      runs.push({ text: match[2], bold: true, italic: false });
    } else {
      runs.push({ text: match[3], bold: false, italic: true });
    }
    last = TOKEN.lastIndex;
  }
  if (last < input.length) {
    runs.push({ text: input.slice(last), bold: false, italic: false });
  }
  return runs;
}

// A single `*` must not be mistaken for half of a `**`, otherwise toggling
// italic on bold text (or vice-versa) corrupts the markers. These helpers treat
// a star as "italic" only when it is not adjacent to another star.
function endsWithMarker(s: string, marker: Marker): boolean {
  if (!s.endsWith(marker)) return false;
  return marker === "*" ? !s.endsWith("**") : true;
}

function startsWithMarker(s: string, marker: Marker): boolean {
  if (!s.startsWith(marker)) return false;
  return marker === "*" ? !s.startsWith("**") : true;
}

export interface WrapResult {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * Wraps the `[start, end)` selection of `text` in `marker`, or unwraps it when
 * already wrapped (markers just inside, or just outside, the selection).
 * Returns the new string and the selection shifted to keep covering the same
 * visible text. A no-op when the selection is empty.
 *
 * Stacking is intentional: bolding a selection then italicising the same
 * selection produces `***…***`, because a lone `*` never matches an adjacent
 * `**`.
 */
export function toggleMarker(
  text: string,
  start: number,
  end: number,
  marker: Marker
): WrapResult {
  if (start === end) {
    return { value: text, selectionStart: start, selectionEnd: end };
  }

  const len = marker.length;
  const before = text.slice(0, start);
  const sel = text.slice(start, end);
  const after = text.slice(end);

  // Markers sit inside the selection (the user selected `**word**`) -> unwrap.
  if (
    sel.length >= len * 2 &&
    startsWithMarker(sel, marker) &&
    endsWithMarker(sel, marker)
  ) {
    const inner = sel.slice(len, sel.length - len);
    return {
      value: before + inner + after,
      selectionStart: start,
      selectionEnd: start + inner.length,
    };
  }

  // Markers sit just outside the selection (the user selected `word`,
  // markers hug it) -> unwrap.
  if (endsWithMarker(before, marker) && startsWithMarker(after, marker)) {
    return {
      value: before.slice(0, before.length - len) + sel + after.slice(len),
      selectionStart: start - len,
      selectionEnd: end - len,
    };
  }

  // Otherwise wrap, keeping the original text selected.
  return {
    value: before + marker + sel + marker + after,
    selectionStart: start + len,
    selectionEnd: end + len,
  };
}
