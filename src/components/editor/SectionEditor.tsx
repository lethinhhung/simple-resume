"use client";

import { useResumeStore } from "@/store/resume-store";
import { Section } from "@/lib/types";
import { TextEditor } from "./TextEditor";
import { EntryEditor } from "./EntryEditor";
import { EducationEditor } from "./EducationEditor";
import { SkillsEditor } from "./SkillsEditor";
import { ListEditor } from "./ListEditor";

export function SectionEditor({ section }: { section: Section }) {
  const updateSection = useResumeStore((s) => s.updateSection);

  const handleUpdate = (data: Section["data"]) => {
    updateSection(section.id, data);
  };

  switch (section.data.type) {
    case "text":
      return <TextEditor data={section.data} onChange={handleUpdate} />;
    case "entry":
      return <EntryEditor data={section.data} onChange={handleUpdate} />;
    case "education":
      return <EducationEditor data={section.data} onChange={handleUpdate} />;
    case "skills":
      return <SkillsEditor data={section.data} onChange={handleUpdate} />;
    case "list":
      return <ListEditor data={section.data} onChange={handleUpdate} />;
  }
}
