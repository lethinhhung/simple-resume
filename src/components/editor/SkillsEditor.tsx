import { X } from "lucide-react";
import { SkillsSection } from "@/lib/types";
import { generateId } from "@/lib/id";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  data: SkillsSection;
  onChange: (data: SkillsSection) => void;
}

export function SkillsEditor({ data, onChange }: Props) {
  const updateCategory = (
    id: string,
    field: "category" | "values",
    value: string
  ) => {
    onChange({
      ...data,
      categories: data.categories.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const addCategory = () => {
    onChange({
      ...data,
      categories: [
        ...data.categories,
        { id: generateId(), category: "", values: "" },
      ],
    });
  };

  const removeCategory = (id: string) => {
    onChange({
      ...data,
      categories: data.categories.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-2">
      {data.categories.map((cat) => (
        <div key={cat.id} className="flex items-start gap-1.5">
          <Input
            value={cat.category}
            onChange={(e) => updateCategory(cat.id, "category", e.target.value)}
            placeholder="Category"
            className="w-32 shrink-0"
          />
          <Input
            value={cat.values}
            onChange={(e) => updateCategory(cat.id, "values", e.target.value)}
            placeholder="Comma-separated skills"
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive shrink-0 mt-1"
            onClick={() => removeCategory(cat.id)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="xs"
        className="border-dashed"
        onClick={addCategory}
      >
        + Add Category
      </Button>
    </div>
  );
}
