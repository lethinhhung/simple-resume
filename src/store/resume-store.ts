import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ResumeData,
  HeaderBlock,
  SectionData,
  SectionType,
  PageSettings,
} from "@/lib/types";
import { DEFAULT_RESUME } from "@/lib/defaults";
import { generateId } from "@/lib/id";

const DEFAULT_SECTION_DATA: Record<SectionType, () => SectionData> = {
  text: () => ({ type: "text", content: "" }),
  entry: () => ({
    type: "entry",
    entries: [
      {
        id: generateId(),
        title: "",
        subtitle: "",
        location: "",
        dates: "",
        description: "",
        bullets: [],
      },
    ],
  }),
  education: () => ({
    type: "education",
    entries: [
      {
        id: generateId(),
        institution: "",
        location: "",
        degree: "",
        dates: "",
        gpa: "",
        description: "",
      },
    ],
  }),
  skills: () => ({
    type: "skills",
    categories: [{ id: generateId(), category: "", values: "" }],
  }),
  list: () => ({
    type: "list",
    items: [{ id: generateId(), name: "", detail: "", dates: "" }],
  }),
};

const DEFAULT_LABELS: Record<SectionType, string> = {
  text: "Objective",
  entry: "Experience",
  education: "Education",
  skills: "Technical Skills",
  list: "Certification",
};

interface ResumeStore {
  resume: ResumeData;
  updateHeader: (header: Partial<HeaderBlock>) => void;
  updateSection: (sectionId: string, data: SectionData) => void;
  renameSection: (sectionId: string, label: string) => void;
  toggleSection: (sectionId: string) => void;
  addSection: (type: SectionType) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  updatePageSettings: (settings: Partial<PageSettings>) => void;
  resetResume: () => void;
  autofillResume: (data: ResumeData) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: DEFAULT_RESUME,

      updateHeader: (header) =>
        set((state) => ({
          resume: {
            ...state.resume,
            header: { ...state.resume.header, ...header },
          },
        })),

      updateSection: (sectionId, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            sections: state.resume.sections.map((s) =>
              s.id === sectionId ? { ...s, data } : s
            ),
          },
        })),

      renameSection: (sectionId, label) =>
        set((state) => ({
          resume: {
            ...state.resume,
            sections: state.resume.sections.map((s) =>
              s.id === sectionId ? { ...s, label } : s
            ),
          },
        })),

      toggleSection: (sectionId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            sections: state.resume.sections.map((s) =>
              s.id === sectionId ? { ...s, enabled: !s.enabled } : s
            ),
          },
        })),

      addSection: (type) =>
        set((state) => ({
          resume: {
            ...state.resume,
            sections: [
              ...state.resume.sections,
              {
                id: generateId(),
                label: DEFAULT_LABELS[type],
                enabled: true,
                data: DEFAULT_SECTION_DATA[type](),
              },
            ],
          },
        })),

      removeSection: (sectionId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            sections: state.resume.sections.filter((s) => s.id !== sectionId),
          },
        })),

      moveSection: (sectionId, direction) =>
        set((state) => {
          const sections = [...state.resume.sections];
          const index = sections.findIndex((s) => s.id === sectionId);
          if (index === -1) return state;
          const targetIndex =
            direction === "up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= sections.length) return state;
          [sections[index], sections[targetIndex]] = [
            sections[targetIndex],
            sections[index],
          ];
          return { resume: { ...state.resume, sections } };
        }),

      reorderSections: (fromIndex, toIndex) =>
        set((state) => {
          const sections = [...state.resume.sections];
          const [moved] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, moved);
          return { resume: { ...state.resume, sections } };
        }),

      updatePageSettings: (settings) =>
        set((state) => ({
          resume: {
            ...state.resume,
            pageSettings: { ...state.resume.pageSettings, ...settings },
          },
        })),

      resetResume: () => set({ resume: DEFAULT_RESUME }),

      // Replace header + sections from an AI-generated resume; pageSettings
      // (layout preferences, not pasted content) are intentionally preserved.
      autofillResume: (data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            header: data.header,
            sections: data.sections,
          },
        })),
    }),
    {
      name: "simple-resume-data",
      merge: (persisted, current) => {
        const p = persisted as Partial<ResumeStore> | undefined;
        if (!p?.resume) return current;
        return {
          ...current,
          resume: {
            ...current.resume,
            ...p.resume,
            pageSettings: {
              ...current.resume.pageSettings,
              ...p.resume.pageSettings,
            },
          },
        };
      },
    }
  )
);
