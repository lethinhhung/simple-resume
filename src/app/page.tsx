"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { ExportButton } from "@/components/pdf/ExportButton";
import "@/components/preview/resume.css";
import "@/components/editor/editor.css";

export default function Home() {
  const resume = useResumeStore((s) => s.resume);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Simple Resume</h1>
        <ExportButton />
      </header>

      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${mobileTab === "editor" ? "mobile-tab-active" : ""}`}
          onClick={() => setMobileTab("editor")}
        >
          Editor
        </button>
        <button
          className={`mobile-tab ${mobileTab === "preview" ? "mobile-tab-active" : ""}`}
          onClick={() => setMobileTab("preview")}
        >
          Preview
        </button>
      </div>

      <div className="app-layout">
        <div
          className={`app-editor ${mobileTab === "editor" ? "mobile-visible" : "mobile-hidden"}`}
        >
          <EditorPanel />
        </div>
        <div
          className={`app-preview ${mobileTab === "preview" ? "mobile-visible" : "mobile-hidden"}`}
        >
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}
