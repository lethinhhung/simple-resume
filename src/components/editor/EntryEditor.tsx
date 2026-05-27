import { X } from "lucide-react";
import { EntrySection, EntryItem } from "@/lib/types";
import { generateId } from "@/lib/id";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  data: EntrySection;
  onChange: (data: EntrySection) => void;
}

export function EntryEditor({ data, onChange }: Props) {
  const updateEntry = (id: string, updated: Partial<EntryItem>) => {
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
          title: "",
          subtitle: "",
          location: "",
          dates: "",
          description: "",
          bullets: [],
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

  const addBullet = (entryId: string) => {
    onChange({
      ...data,
      entries: data.entries.map((e) =>
        e.id === entryId ? { ...e, bullets: [...e.bullets, ""] } : e
      ),
    });
  };

  const updateBullet = (entryId: string, index: number, value: string) => {
    onChange({
      ...data,
      entries: data.entries.map((e) =>
        e.id === entryId
          ? { ...e, bullets: e.bullets.map((b, i) => (i === index ? value : b)) }
          : e
      ),
    });
  };

  const removeBullet = (entryId: string, index: number) => {
    onChange({
      ...data,
      entries: data.entries.map((e) =>
        e.id === entryId
          ? { ...e, bullets: e.bullets.filter((_, i) => i !== index) }
          : e
      ),
    });
  };

  return (
    <div className="space-y-3">
      {data.entries.map((entry) => (
        <div
          key={entry.id}
          className="border border-border p-3 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground truncate">
              {entry.title || "Untitled"}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeEntry(entry.id)}
            >
              <X className="size-3" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input
                value={entry.title}
                onChange={(e) =>
                  updateEntry(entry.id, { title: e.target.value })
                }
                placeholder="Company or project"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Subtitle</Label>
              <Input
                value={entry.subtitle}
                onChange={(e) =>
                  updateEntry(entry.id, { subtitle: e.target.value })
                }
                placeholder="Role or position"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Location</Label>
              <Input
                value={entry.location}
                onChange={(e) =>
                  updateEntry(entry.id, { location: e.target.value })
                }
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Dates</Label>
              <Input
                value={entry.dates}
                onChange={(e) =>
                  updateEntry(entry.id, { dates: e.target.value })
                }
                placeholder="MM/YYYY - MM/YYYY"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={entry.description}
              onChange={(e) =>
                updateEntry(entry.id, { description: e.target.value })
              }
              placeholder="Brief description (optional)"
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Bullets</Label>
            {entry.bullets.map((bullet, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Input
                  value={bullet}
                  onChange={(e) =>
                    updateBullet(entry.id, i, e.target.value)
                  }
                  placeholder="Achievement or responsibility"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeBullet(entry.id, i)}
                >
                  <X className="size-3" />
                </Button>
              </div>
            ))}
            <button
              className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => addBullet(entry.id)}
            >
              + Add Bullet
            </button>
          </div>
        </div>
      ))}
      <button
        className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        onClick={addEntry}
      >
        + Add Entry
      </button>
    </div>
  );
}
