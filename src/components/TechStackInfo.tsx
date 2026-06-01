"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TechStackInfo() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="About this project">
            <Info className="size-3.5" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About this project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="mb-1.5 text-xs font-medium tracking-tight text-foreground">
              Framework
            </h3>
            <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
              <li>Next.js 16 (App Router)</li>
              <li>React 19</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-1.5 text-xs font-medium tracking-tight text-foreground">
              Styling
            </h3>
            <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
              <li>Tailwind CSS v4</li>
              <li>Base UI components</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-1.5 text-xs font-medium tracking-tight text-foreground">
              Core
            </h3>
            <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
              <li>PDF rendering (@react-pdf/renderer)</li>
              <li>State management (Zustand)</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-1.5 text-xs font-medium tracking-tight text-foreground">
              Features
            </h3>
            <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
              <li>Live PDF preview</li>
              <li>Dark/Light theme</li>
              <li>Export to PDF</li>
              <li>Local-first — your data never leaves the browser</li>
            </ul>
          </div>
          <div className="border-t border-border pt-4 text-xs text-muted-foreground">
            Made by{" "}
            <a
              href="https://thinghunggg.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            >
              thinghunggg
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
