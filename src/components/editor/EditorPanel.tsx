"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useResumeStore } from "@/store/resume-store";
import { Section, SectionType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="space-y-px">
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
      className={`border-b border-border transition-opacity ${
        section.enabled ? "" : "opacity-40"
      }`}
    >
      <div className="px-5 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <button
              className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>
            <Input
              value={section.label}
              onChange={(e) => renameSection(section.id, e.target.value)}
              className="h-7 border-none bg-transparent px-1 font-medium text-sm shadow-none focus-visible:ring-0 focus-visible:border-b focus-visible:border-foreground focus-visible:rounded-none"
            />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
              {section.data.type}
            </span>
          </div>
          <div className="flex items-center shrink-0">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => toggleSection(section.id)}
              title={section.enabled ? "Hide" : "Show"}
            >
              {section.enabled ? (
                <Eye className="size-3" />
              ) : (
                <EyeOff className="size-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => moveSection(section.id, "up")}
              disabled={index === 0}
            >
              <ArrowUp className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => moveSection(section.id, "down")}
              disabled={index === total - 1}
            >
              <ArrowDown className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeSection(section.id)}
            >
              <X className="size-3" />
            </Button>
          </div>
        </div>
        {!collapsed && section.enabled && (
          <div className="mt-3">
            <SectionEditor section={section} />
          </div>
        )}
      </div>
    </div>
  );
}

function AddSectionButton({ onAdd }: { onAdd: (type: SectionType) => void }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">
            Add section:
          </span>
          {SECTION_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              className="text-xs px-2.5 py-1 border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
              onClick={() => {
                onAdd(opt.type);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
          <button
            className="text-xs px-2.5 py-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      <button
        className="w-full py-2 text-xs text-muted-foreground border border-dashed border-border hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
        onClick={() => setOpen(true)}
      >
        + Add Section
      </button>
    </div>
  );
}
