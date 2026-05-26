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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-3 p-3">
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
    <Card
      size="sm"
      className={section.enabled ? "" : "opacity-50"}
    >
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </Button>
            <Input
              value={section.label}
              onChange={(e) => renameSection(section.id, e.target.value)}
              className="h-7 border-none bg-transparent px-1 font-semibold text-sm shadow-none focus-visible:ring-0 focus-visible:border-b focus-visible:border-ring focus-visible:rounded-none"
            />
            <Badge variant="secondary" className="text-[10px] shrink-0">
              {section.data.type}
            </Badge>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => toggleSection(section.id)}
              title={section.enabled ? "Hide" : "Show"}
            >
              {section.enabled ? (
                <Eye className="size-3.5" />
              ) : (
                <EyeOff className="size-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => moveSection(section.id, "up")}
              disabled={index === 0}
            >
              <ArrowUp className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => moveSection(section.id, "down")}
              disabled={index === total - 1}
            >
              <ArrowDown className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeSection(section.id)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
        {!collapsed && section.enabled && <SectionEditor section={section} />}
      </CardContent>
    </Card>
  );
}

function AddSectionButton({ onAdd }: { onAdd: (type: SectionType) => void }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <Card size="sm">
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">
              Choose type:
            </span>
            {SECTION_TYPE_OPTIONS.map((opt) => (
              <Button
                key={opt.type}
                variant="secondary"
                size="xs"
                onClick={() => {
                  onAdd(opt.type);
                  setOpen(false);
                }}
              >
                {opt.label}
              </Button>
            ))}
            <Button variant="ghost" size="xs" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full border-dashed"
      onClick={() => setOpen(true)}
    >
      + Add Section
    </Button>
  );
}
