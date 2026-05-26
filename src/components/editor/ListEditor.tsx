import { X } from "lucide-react";
import { ListSection } from "@/lib/types";
import { generateId } from "@/lib/id";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  data: ListSection;
  onChange: (data: ListSection) => void;
}

export function ListEditor({ data, onChange }: Props) {
  const updateItem = (
    id: string,
    field: "name" | "detail" | "dates",
    value: string
  ) => {
    onChange({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [
        ...data.items,
        { id: generateId(), name: "", detail: "", dates: "" },
      ],
    });
  };

  const removeItem = (id: string) => {
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="space-y-2">
      {data.items.map((item) => (
        <div key={item.id} className="flex items-start gap-1.5">
          <div className="flex-1 space-y-1.5">
            <Input
              value={item.name}
              onChange={(e) => updateItem(item.id, "name", e.target.value)}
              placeholder="Name (e.g. certification title)"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={item.detail}
                onChange={(e) => updateItem(item.id, "detail", e.target.value)}
                placeholder="Detail (optional)"
              />
              <Input
                value={item.dates}
                onChange={(e) => updateItem(item.id, "dates", e.target.value)}
                placeholder="MM/YYYY - MM/YYYY"
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive shrink-0 mt-1"
            onClick={() => removeItem(item.id)}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="xs"
        className="border-dashed"
        onClick={addItem}
      >
        + Add Item
      </Button>
    </div>
  );
}
