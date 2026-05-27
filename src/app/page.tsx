"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { PdfPreview } from "@/components/pdf/PdfPreview";
import { ExportButton } from "@/components/pdf/ExportButton";
import { useTheme } from "@/hooks/use-theme";

export default function Home() {
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <div className="flex flex-col h-dvh overflow-hidden pt-[env(safe-area-inset-top)]">
      <header className="flex items-center justify-between px-6 h-12 bg-background border-b shrink-0 z-10">
        <span className="text-sm font-medium tracking-tight text-foreground">
          Simple Resume
        </span>
        <div className="flex items-center gap-1">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="size-3.5" />
              ) : (
                <Moon className="size-3.5" />
              )}
            </Button>
          )}
          <ExportButton />
        </div>
      </header>

      <div className="flex border-b bg-background shrink-0 md:hidden">
        <button
          className={`flex-1 py-2.5 text-xs font-medium tracking-wide uppercase transition-colors ${
            mobileTab === "editor"
              ? "text-foreground border-b border-foreground"
              : "text-muted-foreground border-b border-transparent"
          }`}
          onClick={() => setMobileTab("editor")}
        >
          Editor
        </button>
        <button
          className={`flex-1 py-2.5 text-xs font-medium tracking-wide uppercase transition-colors ${
            mobileTab === "preview"
              ? "text-foreground border-b border-foreground"
              : "text-muted-foreground border-b border-transparent"
          }`}
          onClick={() => setMobileTab("preview")}
        >
          Preview
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`w-full md:w-1/2 bg-background overflow-y-auto border-r editor-scroll ${
            mobileTab === "editor" ? "block" : "hidden md:block"
          }`}
        >
          <EditorPanel />
        </div>
        <div
          className={`w-full md:w-1/2 bg-neutral-100 dark:bg-neutral-900 ${
            mobileTab === "preview" ? "block" : "hidden md:block"
          }`}
        >
          <PdfPreview />
        </div>
      </div>
    </div>
  );
}
