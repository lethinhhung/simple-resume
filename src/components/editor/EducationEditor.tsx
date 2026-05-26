import { EducationSection, EducationItem } from "@/lib/types";
import { generateId } from "@/lib/id";

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
    <div className="space-y-4">
      {data.entries.map((entry) => (
        <div key={entry.id} className="editor-entry-card">
          <div className="editor-entry-header">
            <span className="editor-entry-label">
              {entry.institution || "Untitled"}
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
              Institution
              <input
                className="editor-input"
                value={entry.institution}
                onChange={(e) =>
                  updateEntry(entry.id, { institution: e.target.value })
                }
                placeholder="University name"
              />
            </label>
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
          </div>

          <div className="editor-grid-2">
            <label className="editor-label">
              Degree & Field
              <input
                className="editor-input"
                value={entry.degree}
                onChange={(e) =>
                  updateEntry(entry.id, { degree: e.target.value })
                }
                placeholder="Bachelor of Science in..."
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
                placeholder="MM/YYYY"
              />
            </label>
          </div>

          <div className="editor-grid-2">
            <label className="editor-label">
              GPA
              <input
                className="editor-input"
                value={entry.gpa}
                onChange={(e) =>
                  updateEntry(entry.id, { gpa: e.target.value })
                }
                placeholder="3.5/4.0 (optional)"
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
              placeholder="Thesis, honors, etc. (optional)"
              rows={2}
            />
          </label>
        </div>
      ))}
      <button className="editor-btn-add" onClick={addEntry}>
        + Add Education
      </button>
    </div>
  );
}
