"use client";

import { useResumeStore } from "@/store/resume-store";

export default function Home() {
  const resume = useResumeStore((s) => s.resume);

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Simple Resume</h1>
        <p className="text-gray-600">
          Loaded: {resume.header.name} — {resume.sections.length} sections
        </p>
      </div>
    </main>
  );
}
