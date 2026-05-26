"use client";

import { useResumeStore } from "@/store/resume-store";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { EditorPanel } from "@/components/editor/EditorPanel";
import "@/components/preview/resume.css";
import "@/components/editor/editor.css";

export default function Home() {
  const resume = useResumeStore((s) => s.resume);

  return (
    <div className="app-layout">
      <div className="app-editor">
        <EditorPanel />
      </div>
      <div className="app-preview">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
