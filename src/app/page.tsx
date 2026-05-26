"use client";

import { useResumeStore } from "@/store/resume-store";
import { ResumePreview } from "@/components/preview/ResumePreview";
import "@/components/preview/resume.css";

export default function Home() {
  const resume = useResumeStore((s) => s.resume);

  return (
    <main className="flex-1 bg-gray-100 py-8 overflow-auto">
      <ResumePreview resume={resume} />
    </main>
  );
}
