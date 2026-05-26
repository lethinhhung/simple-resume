"use client";

import { useResumeStore } from "@/store/resume-store";
import { HeaderEditor } from "./HeaderEditor";
import { SectionEditor } from "./SectionEditor";

export function EditorPanel() {
  const sections = useResumeStore((s) => s.resume.sections);

  return (
    <div className="editor-panel">
      <HeaderEditor />

      {sections.map((section) => (
        <div key={section.id} className="editor-section">
          <h3 className="editor-section-title">
            {section.label}
            <span className="editor-type-badge">{section.data.type}</span>
          </h3>
          <SectionEditor section={section} />
        </div>
      ))}
    </div>
  );
}
