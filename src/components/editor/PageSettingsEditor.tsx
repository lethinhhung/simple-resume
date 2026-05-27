"use client";

import { useResumeStore } from "@/store/resume-store";
import { FontFamily } from "@/lib/types";
import { FONT_OPTIONS } from "@/lib/fonts";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PageSettingsEditor() {
  const ps = useResumeStore((s) => s.resume.pageSettings);
  const update = useResumeStore((s) => s.updatePageSettings);

  return (
    <div className="border-b border-border">
      <div className="px-5 py-4 space-y-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Page Settings
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Family</Label>
            <Select
              value={ps.fontFamily}
              onValueChange={(v) => update({ fontFamily: v as FontFamily })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_OPTIONS.map((f) => (
                  <SelectItem key={f.family} value={f.family}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Font Size (pt)</Label>
            <NumberInput
              value={ps.fontSize}
              onChange={(v) => update({ fontSize: v })}
              min={7}
              max={14}
              step={0.5}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Top</Label>
            <NumberInput
              value={ps.marginTop}
              onChange={(v) => update({ marginTop: v })}
              min={0.2}
              max={4}
              step={0.1}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Bottom</Label>
            <NumberInput
              value={ps.marginBottom}
              onChange={(v) => update({ marginBottom: v })}
              min={0.2}
              max={4}
              step={0.1}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Left</Label>
            <NumberInput
              value={ps.marginLeft}
              onChange={(v) => update({ marginLeft: v })}
              min={0.2}
              max={4}
              step={0.1}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Right</Label>
            <NumberInput
              value={ps.marginRight}
              onChange={(v) => update({ marginRight: v })}
              min={0.2}
              max={4}
              step={0.1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
