"use client";

import { useState } from "react";
import { Moon, Sun, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PdfPreview } from "@/components/pdf/PdfPreview";
import { ExportButton } from "@/components/pdf/ExportButton";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 bg-background border-b shrink-0 z-10">
        <h1 className="text-base font-bold text-foreground">Simple Resume</h1>
        <div className="flex items-center gap-2">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          )}
          <ExportButton />
        </div>
      </header>

      <div className="flex border-b bg-background shrink-0 md:hidden">
        <button
          className={`flex-1 py-2 text-sm font-medium border-b-2 ${
            mobileTab === "editor"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent"
          }`}
          onClick={() => setMobileTab("editor")}
        >
          Editor
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium border-b-2 ${
            mobileTab === "preview"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent"
          }`}
          onClick={() => setMobileTab("preview")}
        >
          Preview
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`w-full md:w-1/2 bg-muted/30 overflow-y-auto border-r ${
            mobileTab === "editor" ? "block" : "hidden md:block"
          }`}
        >
          <EditorPanel />
        </div>
        <div
          className={`w-full md:w-1/2 bg-neutral-500 dark:bg-neutral-800 overflow-hidden ${
            mobileTab === "preview" ? "block" : "hidden md:block"
          }`}
        >
          <PdfPreview />
        </div>
      </div>
    </div>
  );
}
