"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useResumeStore } from "@/store/resume-store";
import { DEFAULT_RESUME } from "@/lib/defaults";
import { normalizeResume } from "@/lib/autofill/normalize";

const STYLE_KEY = "simple-resume-autofill-style";

interface ApiError {
  error?: string;
  retryAfterMs?: number;
}

export function AutofillDialog() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  // Restore the last-used writing style for convenience. Read lazily (not in an
  // effect) and guarded for SSR; the field only renders once the dialog opens,
  // so there is no hydration mismatch.
  const [style, setStyle] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      return localStorage.getItem(STYLE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resume = useResumeStore((s) => s.resume);
  const autofillResume = useResumeStore((s) => s.autofillResume);

  // Treat an untouched, freshly-seeded resume as "default": no need to warn.
  const isDefault = JSON.stringify(resume) === JSON.stringify(DEFAULT_RESUME);
  const needsConfirm = !isDefault;
  const canSubmit =
    text.trim().length > 0 && !loading && (!needsConfirm || confirmReplace);

  function reset() {
    setError(null);
    setConfirmReplace(false);
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      try {
        localStorage.setItem(STYLE_KEY, style);
      } catch {
        // ignore unavailable storage
      }

      const res = await fetch("/api/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style }),
      });
      const body: ApiError & { data?: unknown } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok) {
        const retry = body.retryAfterMs
          ? ` Try again in ${Math.ceil(body.retryAfterMs / 60000)} min.`
          : "";
        setError((body.error ?? "Autofill failed.") + retry);
        return;
      }

      const result = normalizeResume(body.data);
      if (!result.ok) {
        setError(
          "Could not turn that text into a resume. Try adding more detail or rephrasing."
        );
        return;
      }

      autofillResume(result.data);
      setOpen(false);
      setText("");
      reset();
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Lock the dialog (Escape, backdrop, X) while a request is in flight.
        if (loading) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" aria-label="Autofill from text">
            <Sparkles data-icon="inline-start" className="size-3.5" />
            Autofill
          </Button>
        }
      />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Autofill from text</DialogTitle>
          <DialogDescription>
            Paste any rough text — notes, an old resume, a bio — and AI will
            structure it into your resume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="autofill-text">Your text</Label>
            <Textarea
              id="autofill-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              placeholder="Paste your experience, skills, education…"
              className="field-sizing-fixed h-72 resize-none overflow-y-auto"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="autofill-style">
              Writing style{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="autofill-style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={loading}
              placeholder="e.g. concise, action-oriented, formal tone"
            />
          </div>

          {needsConfirm && (
            <label className="flex items-start gap-2 text-xs text-muted-foreground has-disabled:opacity-50">
              <input
                type="checkbox"
                checked={confirmReplace}
                onChange={(e) => setConfirmReplace(e.target.checked)}
                disabled={loading}
                className="mt-0.5 accent-foreground disabled:cursor-not-allowed"
              />
              <span>
                Replace my current resume content. Page settings (font, margins)
                are kept.
              </span>
            </label>
          )}

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Your text is sent to Google Gemini to generate the resume. On the
            free tier, Google may use it to improve their models — don&apos;t
            paste anything you wouldn&apos;t want shared.
          </p>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!canSubmit}>
              {loading ? (
                <Loader2
                  data-icon="inline-start"
                  className="size-3.5 animate-spin"
                />
              ) : (
                <Sparkles data-icon="inline-start" className="size-3.5" />
              )}
              {loading ? "Autofilling…" : "Autofill"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
