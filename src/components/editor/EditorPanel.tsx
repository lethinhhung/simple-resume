"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { Section, SectionType } from "@/lib/types";
import { HeaderEditor } from "./HeaderEditor";
import { PageSettingsEditor } from "./PageSettingsEditor";
import { SectionEditor } from "./SectionEditor";

const SECTION_TYPE_OPTIONS: { type: SectionType; label: string }[] = [
  { type: "text", label: "Text" },
  { type: "entry", label: "Entry" },
  { type: "education", label: "Education" },
  { type: "skills", label: "Skills" },
  { type: "list", label: "List" },
];

export function EditorPanel() {
  const sections = useResumeStore((s) => s.resume.sections);
  const addSection = useResumeStore((s) => s.addSection);

  return (
    <div className="editor-panel">
      <PageSettingsEditor />
      <HeaderEditor />

      {sections.map((section, index) => (
        <SectionBlock
          key={section.id}
          section={section}
          index={index}
          total={sections.length}
        />
      ))}

      <AddSectionButton onAdd={addSection} />
    </div>
  );
}

function SectionBlock({
  section,
  index,
  total,
}: {
  section: Section;
  index: number;
  total: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const renameSection = useResumeStore((s) => s.renameSection);
  const toggleSection = useResumeStore((s) => s.toggleSection);
  const removeSection = useResumeStore((s) => s.removeSection);
  const moveSection = useResumeStore((s) => s.moveSection);

  return (
    <div
      className="editor-section"
      style={{ opacity: section.enabled ? 1 : 0.5 }}
    >
      <div className="section-controls">
        <div className="section-controls-left">
          <button
            className="section-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "▶" : "▼"}
          </button>
          <input
            className="section-label-input"
            value={section.label}
            onChange={(e) => renameSection(section.id, e.target.value)}
          />
          <span className="editor-type-badge">{section.data.type}</span>
        </div>
        <div className="section-controls-right">
          <button
            className="section-ctrl-btn"
            onClick={() => toggleSection(section.id)}
            title={section.enabled ? "Hide section" : "Show section"}
          >
            {section.enabled ? "👁" : "👁‍🗨"}
          </button>
          <button
            className="section-ctrl-btn"
            onClick={() => moveSection(section.id, "up")}
            disabled={index === 0}
            title="Move up"
          >
            ↑
          </button>
          <button
            className="section-ctrl-btn"
            onClick={() => moveSection(section.id, "down")}
            disabled={index === total - 1}
            title="Move down"
          >
            ↓
          </button>
          <button
            className="section-ctrl-btn section-ctrl-btn-danger"
            onClick={() => removeSection(section.id)}
            title="Remove section"
          >
            &times;
          </button>
        </div>
      </div>

      {!collapsed && section.enabled && <SectionEditor section={section} />}
    </div>
  );
}

function AddSectionButton({ onAdd }: { onAdd: (type: SectionType) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="add-section-container">
      {open ? (
        <div className="add-section-picker">
          <span className="add-section-picker-label">Choose type:</span>
          {SECTION_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              className="add-section-type-btn"
              onClick={() => {
                onAdd(opt.type);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
          <button
            className="add-section-cancel-btn"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button className="editor-btn-add w-full" onClick={() => setOpen(true)}>
          + Add Section
        </button>
      )}
    </div>
  );
}
