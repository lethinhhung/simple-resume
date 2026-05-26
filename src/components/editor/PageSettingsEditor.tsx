"use client";

import { useResumeStore } from "@/store/resume-store";
import { FontFamily } from "@/lib/types";
import { FONT_OPTIONS } from "@/lib/fonts";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    <Card size="sm">
      <CardContent className="space-y-3">
        <h3 className="text-sm font-semibold">Page Settings</h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Font Family</Label>
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
            <Label className="text-xs">Font Size (pt)</Label>
            <Input
              type="number"
              min={7}
              max={14}
              step={0.5}
              value={ps.fontSize}
              onChange={(e) =>
                update({ fontSize: parseFloat(e.target.value) || 10 })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Margin Top (in)</Label>
            <Input
              type="number"
              min={0.1}
              max={1.5}
              step={0.05}
              value={ps.marginTop}
              onChange={(e) =>
                update({ marginTop: parseFloat(e.target.value) || 0.4 })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Margin Bottom (in)</Label>
            <Input
              type="number"
              min={0.1}
              max={1.5}
              step={0.05}
              value={ps.marginBottom}
              onChange={(e) =>
                update({ marginBottom: parseFloat(e.target.value) || 0.4 })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Margin Left (in)</Label>
            <Input
              type="number"
              min={0.1}
              max={1.5}
              step={0.05}
              value={ps.marginLeft}
              onChange={(e) =>
                update({ marginLeft: parseFloat(e.target.value) || 0.45 })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Margin Right (in)</Label>
            <Input
              type="number"
              min={0.1}
              max={1.5}
              step={0.05}
              value={ps.marginRight}
              onChange={(e) =>
                update({ marginRight: parseFloat(e.target.value) || 0.45 })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
