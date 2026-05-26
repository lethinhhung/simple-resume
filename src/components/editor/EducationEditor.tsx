import { X } from "lucide-react";
import { EducationSection, EducationItem } from "@/lib/types";
import { generateId } from "@/lib/id";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  data: EducationSection;
  onChange: (data: EducationSection) => void;
}

export function EducationEditor({ data, onChange }: Props) {
  const updateEntry = (id: string, updated: Partial<EducationItem>) => {
    onChange({
      ...data,
      entries: data.entries.map((e) =>
        e.id === id ? { ...e, ...updated } : e
      ),
    });
  };

  const addEntry = () => {
    onChange({
      ...data,
      entries: [
        ...data.entries,
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
    });
  };

  const removeEntry = (id: string) => {
    onChange({
      ...data,
      entries: data.entries.filter((e) => e.id !== id),
    });
  };

  return (
    <div className="space-y-3">
      {data.entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-md border border-border p-3 space-y-2"
        >
          <div className="flex items-center justify-between pb-2 border-b">
            <span className="text-sm font-medium truncate">
              {entry.institution || "Untitled"}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeEntry(entry.id)}
            >
              <X className="size-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Institution</Label>
              <Input
                value={entry.institution}
                onChange={(e) =>
                  updateEntry(entry.id, { institution: e.target.value })
                }
                placeholder="University name"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Location</Label>
              <Input
                value={entry.location}
                onChange={(e) =>
                  updateEntry(entry.id, { location: e.target.value })
                }
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Degree & Field</Label>
              <Input
                value={entry.degree}
                onChange={(e) =>
                  updateEntry(entry.id, { degree: e.target.value })
                }
                placeholder="Bachelor of Science in..."
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Dates</Label>
              <Input
                value={entry.dates}
                onChange={(e) =>
                  updateEntry(entry.id, { dates: e.target.value })
                }
                placeholder="MM/YYYY"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">GPA</Label>
              <Input
                value={entry.gpa}
                onChange={(e) =>
                  updateEntry(entry.id, { gpa: e.target.value })
                }
                placeholder="3.5/4.0 (optional)"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea
              value={entry.description}
              onChange={(e) =>
                updateEntry(entry.id, { description: e.target.value })
              }
              placeholder="Thesis, honors, etc. (optional)"
              rows={2}
            />
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="xs"
        className="border-dashed"
        onClick={addEntry}
      >
        + Add Education
      </Button>
    </div>
  );
}
