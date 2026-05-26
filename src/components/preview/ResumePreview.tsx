"use client";

import { ResumeData, Section } from "@/lib/types";
import { SectionRenderer } from "./SectionRenderer";

interface ResumePreviewProps {
  resume: ResumeData;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const enabledSections = resume.sections.filter((s) => s.enabled);

  return (
    <div className="resume-page">
      <header className="resume-header">
        <h1 className="resume-name">{resume.header.name.toUpperCase()}</h1>
        {resume.header.subtitle && (
          <div className="resume-subtitle">{resume.header.subtitle}</div>
        )}
        {resume.header.contacts.length > 0 && (
          <div className="resume-contacts">
            {resume.header.contacts
              .map((c) => c.value)
              .filter(Boolean)
              .join(" - ")}
          </div>
        )}
      </header>

      {enabledSections.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </div>
  );
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{section.label}</h2>
      <SectionRenderer data={section.data} />
    </section>
  );
}
