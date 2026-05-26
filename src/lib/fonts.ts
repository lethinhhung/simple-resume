import { FontFamily } from "./types";

export interface FontConfig {
  label: string;
  family: FontFamily;
  builtin: boolean;
  category: "serif" | "sans-serif" | "monospace";
}

export const FONT_OPTIONS: FontConfig[] = [
  { label: "Times Roman", family: "Times-Roman", builtin: true, category: "serif" },
  { label: "Helvetica", family: "Helvetica", builtin: true, category: "serif" },
  { label: "Courier", family: "Courier", builtin: true, category: "monospace" },
  { label: "EB Garamond", family: "EBGaramond", builtin: false, category: "serif" },
  { label: "Roboto", family: "Roboto", builtin: false, category: "sans-serif" },
  { label: "Lato", family: "Lato", builtin: false, category: "sans-serif" },
  { label: "Open Sans", family: "OpenSans", builtin: false, category: "sans-serif" },
  { label: "Calibri", family: "Calibri", builtin: false, category: "sans-serif" },
];

export function getFontLabel(family: FontFamily): string {
  return FONT_OPTIONS.find((f) => f.family === family)?.label ?? family;
}
