"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles } from "lucide-react";
import { Popover } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";

const HINT_KEY = "simple-resume-autofill-hint-seen";
// Breathing room (px) carved around the button so its highlight ring isn't
// clipped by the spotlight's edge.
const PAD = 6;

/**
 * First-visit coachmark that points at the Autofill button. Dims and blurs the
 * whole screen except a hole carved around the button, so attention lands on it.
 * Shows once, then remembers via localStorage. Purely additive — if storage is
 * unavailable the hint silently stays hidden and nothing else changes.
 */
export function AutofillHint({ children }: { children: React.ReactNode }) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Detect a first-time visitor only after mount: localStorage is unavailable on
  // the server, so reading it during render would risk a hydration mismatch.
  useEffect(() => {
    let seen = true;
    try {
      seen = Boolean(localStorage.getItem(HINT_KEY));
    } catch {
      // storage blocked (private mode, etc.) — treat as seen so the hint hides
    }
    if (seen) return;
    // Reveal a beat after load so it reads as intentional rather than a flash on
    // first paint (and keeps the state update out of the effect body).
    const timer = setTimeout(() => setOpen(true), 450);
    return () => clearTimeout(timer);
  }, []);

  // Measure the button so the spotlight can carve a hole around it; re-measure on
  // resize while the hint is open. The first measure runs in rAF (before paint,
  // and off the effect body) so the overlay never flashes at the wrong rect.
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = anchorRef.current;
      if (el) setRect(el.getBoundingClientRect());
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [open]);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      // ignore unavailable storage
    }
  }

  return (
    <span
      ref={anchorRef}
      // Clicking the button (to open Autofill) counts as discovering it. The
      // overlay and popup are portaled to <body>, so their clicks never bubble here.
      onClick={() => open && dismiss()}
      className={cn(
        "relative inline-flex transition-shadow",
        open && "ring-2 ring-foreground/70 ring-offset-2 ring-offset-background"
      )}
    >
      {children}

      {/* Spotlight overlay: a full-screen dim + blur with a rectangular hole
          clipped out around the button. Where the hole is, the overlay (and its
          blur) isn't painted, so the button shows through crisp — independent of
          its z-index, which sidesteps the header's stacking context. */}
      {open && rect && createPortal(
        <SpotlightOverlay rect={rect} onDismiss={dismiss} />,
        document.body
      )}

      <Popover.Root open={open} onOpenChange={(next) => !next && dismiss()}>
        <Popover.Portal>
          <Popover.Positioner
            anchor={anchorRef}
            side="bottom"
            align="end"
            sideOffset={12}
            className="z-[70]"
          >
            {/* initialFocus=false: the hint appears on its own, so it must not
                steal focus from the page on load. */}
            <Popover.Popup
              initialFocus={false}
              className="w-64 bg-foreground p-3 text-background shadow-lg outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            >
              <Popover.Arrow className="data-[side=bottom]:-top-[5px]">
                <div className="size-2.5 rotate-45 bg-foreground" />
              </Popover.Arrow>

              <div className="flex items-start gap-2.5">
                <Sparkles className="mt-0.5 size-4 shrink-0" />
                <div className="space-y-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Start with AI Autofill</p>
                    <p className="text-[11px] leading-relaxed text-background/70">
                      New here? Paste any text — notes, an old resume, a bio — and
                      let AI build your resume in seconds.
                    </p>
                  </div>
                  <button
                    onClick={dismiss}
                    className="bg-background px-2 py-1 text-[11px] font-medium text-foreground transition-opacity hover:opacity-80"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </span>
  );
}

function SpotlightOverlay({
  rect,
  onDismiss,
}: {
  rect: DOMRect;
  onDismiss: () => void;
}) {
  const top = Math.max(0, rect.top - PAD);
  const left = Math.max(0, rect.left - PAD);
  const right = rect.right + PAD;
  const bottom = rect.bottom + PAD;

  // A full-viewport polygon with a rectangular notch cut out of it (the seam runs
  // along y=top from the left edge into the hole, so it's invisible).
  const clip =
    `polygon(` +
    `0px 0px, 100vw 0px, 100vw 100vh, 0px 100vh, ` +
    `0px ${top}px, ${left}px ${top}px, ${left}px ${bottom}px, ` +
    `${right}px ${bottom}px, ${right}px ${top}px, ${left}px ${top}px, 0px ${top}px)`;

  return (
    <div
      aria-hidden
      onClick={onDismiss}
      className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[3px] animate-in fade-in-0 duration-150"
      style={{ clipPath: clip, WebkitClipPath: clip }}
    />
  );
}
