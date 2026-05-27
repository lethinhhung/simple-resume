"use client";

import { useState, useCallback } from "react";
import { ArrowDownToLine } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/resume-store";
import { ResumePdf } from "./ResumePdf";

export function ExportButton() {
  const [exporting, setExporting] = useState(false);
  const resume = useResumeStore((s) => s.resume);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const blob = await pdf(<ResumePdf resume={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = resume.header.name
        ? `${resume.header.name.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }, [resume]);

  return (
    <Button onClick={handleExport} disabled={exporting} size="sm">
      <ArrowDownToLine data-icon="inline-start" className="size-3.5" />
      {exporting ? "Exporting..." : "Export"}
    </Button>
  );
}
