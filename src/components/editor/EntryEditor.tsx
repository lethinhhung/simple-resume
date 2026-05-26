import { EntrySection, EntryItem } from "@/lib/types";
import { generateId } from "@/lib/id";

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
    <div className="space-y-4">
      {data.entries.map((entry) => (
        <div key={entry.id} className="editor-entry-card">
          <div className="editor-entry-header">
            <span className="editor-entry-label">
              {entry.title || "Untitled Entry"}
            </span>
            <button
              className="editor-btn-remove"
              onClick={() => removeEntry(entry.id)}
            >
              &times;
            </button>
          </div>

          <div className="editor-grid-2">
            <label className="editor-label">
              Title
              <input
                className="editor-input"
                value={entry.title}
                onChange={(e) =>
                  updateEntry(entry.id, { title: e.target.value })
                }
                placeholder="Company or project name"
              />
            </label>
            <label className="editor-label">
              Subtitle
              <input
                className="editor-input"
                value={entry.subtitle}
                onChange={(e) =>
                  updateEntry(entry.id, { subtitle: e.target.value })
                }
                placeholder="Role or position"
              />
            </label>
          </div>

          <div className="editor-grid-2">
            <label className="editor-label">
              Location
              <input
                className="editor-input"
                value={entry.location}
                onChange={(e) =>
                  updateEntry(entry.id, { location: e.target.value })
                }
                placeholder="City, Country"
              />
            </label>
            <label className="editor-label">
              Dates
              <input
                className="editor-input"
                value={entry.dates}
                onChange={(e) =>
                  updateEntry(entry.id, { dates: e.target.value })
                }
                placeholder="MM/YYYY - MM/YYYY"
              />
            </label>
          </div>

          <label className="editor-label">
            Description
            <textarea
              className="editor-textarea"
              value={entry.description}
              onChange={(e) =>
                updateEntry(entry.id, { description: e.target.value })
              }
              placeholder="Brief description (optional)"
              rows={2}
            />
          </label>

          <div className="editor-label">
            Bullet Points
            {entry.bullets.map((bullet, i) => (
              <div key={i} className="editor-row">
                <input
                  className="editor-input flex-1"
                  value={bullet}
                  onChange={(e) =>
                    updateBullet(entry.id, i, e.target.value)
                  }
                  placeholder="Achievement or responsibility"
                />
                <button
                  className="editor-btn-remove"
                  onClick={() => removeBullet(entry.id, i)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              className="editor-btn-add"
              onClick={() => addBullet(entry.id)}
            >
              + Add Bullet
            </button>
          </div>
        </div>
      ))}
      <button className="editor-btn-add" onClick={addEntry}>
        + Add Entry
      </button>
    </div>
  );
}
