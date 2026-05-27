"use client";

import { useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useResumeStore } from "@/store/resume-store";
import { ResumePdf } from "./ResumePdf";

export function PdfPreview() {
  const resume = useResumeStore((s) => s.resume);
  const [url, setUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setGenerating(true);
      try {
        const blob = await pdf(<ResumePdf resume={resume} />).toBlob();
        const newUrl = URL.createObjectURL(blob);
        if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = newUrl;
        setUrl(newUrl);
      } finally {
        setGenerating(false);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resume]);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs tracking-wide">
        Generating preview...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-auto preview-scroll">
      {generating && (
        <div className="absolute top-3 right-3 text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 z-10">
          Updating...
        </div>
      )}
      <iframe
        src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
        className="w-full h-full border-none"
        style={{ minWidth: 600, minHeight: "100%" }}
        title="Resume Preview"
      />
    </div>
  );
}
