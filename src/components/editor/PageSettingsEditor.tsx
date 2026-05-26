"use client";

import { useResumeStore } from "@/store/resume-store";

export function PageSettingsEditor() {
  const ps = useResumeStore((s) => s.resume.pageSettings);
  const update = useResumeStore((s) => s.updatePageSettings);

  return (
    <div className="editor-section">
      <h3 className="editor-section-title">Page Settings</h3>

      <label className="editor-label">
        Font Size (pt)
        <input
          className="editor-input"
          type="number"
          min={7}
          max={14}
          step={0.5}
          value={ps.fontSize}
          onChange={(e) => update({ fontSize: parseFloat(e.target.value) || 10 })}
        />
      </label>

      <div className="editor-grid-2">
        <label className="editor-label">
          Margin Top (in)
          <input
            className="editor-input"
            type="number"
            min={0.1}
            max={1.5}
            step={0.05}
            value={ps.marginTop}
            onChange={(e) =>
              update({ marginTop: parseFloat(e.target.value) || 0.4 })
            }
          />
        </label>
        <label className="editor-label">
          Margin Bottom (in)
          <input
            className="editor-input"
            type="number"
            min={0.1}
            max={1.5}
            step={0.05}
            value={ps.marginBottom}
            onChange={(e) =>
              update({ marginBottom: parseFloat(e.target.value) || 0.4 })
            }
          />
        </label>
      </div>

      <div className="editor-grid-2">
        <label className="editor-label">
          Margin Left (in)
          <input
            className="editor-input"
            type="number"
            min={0.1}
            max={1.5}
            step={0.05}
            value={ps.marginLeft}
            onChange={(e) =>
              update({ marginLeft: parseFloat(e.target.value) || 0.45 })
            }
          />
        </label>
        <label className="editor-label">
          Margin Right (in)
          <input
            className="editor-input"
            type="number"
            min={0.1}
            max={1.5}
            step={0.05}
            value={ps.marginRight}
            onChange={(e) =>
              update({ marginRight: parseFloat(e.target.value) || 0.45 })
            }
          />
        </label>
      </div>
    </div>
  );
}
