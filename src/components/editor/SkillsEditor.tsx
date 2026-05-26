import { SkillsSection } from "@/lib/types";
import { generateId } from "@/lib/id";

interface Props {
  data: SkillsSection;
  onChange: (data: SkillsSection) => void;
}

export function SkillsEditor({ data, onChange }: Props) {
  const updateCategory = (id: string, field: "category" | "values", value: string) => {
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
        <div key={cat.id} className="editor-row items-start">
          <input
            className="editor-input w-36 shrink-0"
            value={cat.category}
            onChange={(e) => updateCategory(cat.id, "category", e.target.value)}
            placeholder="Category"
          />
          <input
            className="editor-input flex-1"
            value={cat.values}
            onChange={(e) => updateCategory(cat.id, "values", e.target.value)}
            placeholder="Comma-separated skills"
          />
          <button
            className="editor-btn-remove"
            onClick={() => removeCategory(cat.id)}
          >
            &times;
          </button>
        </div>
      ))}
      <button className="editor-btn-add" onClick={addCategory}>
        + Add Category
      </button>
    </div>
  );
}
