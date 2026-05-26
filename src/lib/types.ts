export interface ContactItem {
  id: string;
  value: string;
}

export interface HeaderBlock {
  name: string;
  subtitle: string;
  contacts: ContactItem[];
}

export interface TextSection {
  type: "text";
  content: string;
}

export interface EntryItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  dates: string;
  description: string;
  bullets: string[];
}

export interface EntrySection {
  type: "entry";
  entries: EntryItem[];
}

export interface EducationItem {
  id: string;
  institution: string;
  location: string;
  degree: string;
  dates: string;
  gpa: string;
  description: string;
}

export interface EducationSection {
  type: "education";
  entries: EducationItem[];
}

export interface SkillCategory {
  id: string;
  category: string;
  values: string;
}

export interface SkillsSection {
  type: "skills";
  categories: SkillCategory[];
}

export interface ListItem {
  id: string;
  name: string;
  detail: string;
  dates: string;
}

export interface ListSection {
  type: "list";
  items: ListItem[];
}

export type SectionData =
  | TextSection
  | EntrySection
  | EducationSection
  | SkillsSection
  | ListSection;

export type SectionType = SectionData["type"];

export interface Section {
  id: string;
  label: string;
  enabled: boolean;
  data: SectionData;
}

export type FontFamily =
  | "Times-Roman"
  | "Helvetica"
  | "Courier"
  | "Roboto"
  | "Lato"
  | "EBGaramond"
  | "OpenSans"
  | "Calibri";

export interface PageSettings {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  fontSize: number;
  fontFamily: FontFamily;
}

export interface ResumeData {
  header: HeaderBlock;
  sections: Section[];
  pageSettings: PageSettings;
}
