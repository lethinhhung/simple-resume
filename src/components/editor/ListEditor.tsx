import { ListSection } from "@/lib/types";
import { generateId } from "@/lib/id";

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
        <div key={item.id} className="editor-row items-start">
          <div className="flex-1 space-y-1">
            <input
              className="editor-input"
              value={item.name}
              onChange={(e) => updateItem(item.id, "name", e.target.value)}
              placeholder="Name (e.g. certification title)"
            />
            <div className="editor-grid-2">
              <input
                className="editor-input"
                value={item.detail}
                onChange={(e) => updateItem(item.id, "detail", e.target.value)}
                placeholder="Detail (optional)"
              />
              <input
                className="editor-input"
                value={item.dates}
                onChange={(e) => updateItem(item.id, "dates", e.target.value)}
                placeholder="MM/YYYY - MM/YYYY"
              />
            </div>
          </div>
          <button
            className="editor-btn-remove"
            onClick={() => removeItem(item.id)}
          >
            &times;
          </button>
        </div>
      ))}
      <button className="editor-btn-add" onClick={addItem}>
        + Add Item
      </button>
    </div>
  );
}
