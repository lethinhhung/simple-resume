import * as React from "react";
import { Bold, Italic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toggleMarker, type Marker } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

type RichTextInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Layout classes for the wrapper (e.g. `flex-1`); the field fills it. */
  className?: string;
} & (
  | { multiline: true; rows?: number }
  | { multiline?: false; rows?: never }
);

/**
 * A text field with inline-emphasis controls. Selecting text and pressing the
 * B / I buttons (shown on focus) or Cmd/Ctrl+B / Cmd/Ctrl+I wraps the selection
 * in `**`/`*` markers via {@link toggleMarker}. Markers live inline in the
 * string value, so the parent stores a plain string exactly as before.
 */
export function RichTextInput({
  value,
  onChange,
  placeholder,
  className,
  multiline,
  rows,
}: RichTextInputProps) {
  const ref = React.useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const pendingSelection = React.useRef<[number, number] | null>(null);

  // After a controlled re-render, re-apply the selection so the wrapped text
  // stays highlighted and the toolbar can be used again immediately.
  React.useEffect(() => {
    const el = ref.current;
    if (pendingSelection.current && el) {
      const [start, end] = pendingSelection.current;
      pendingSelection.current = null;
      el.focus();
      el.setSelectionRange(start, end);
    }
  });

  const apply = (marker: Marker) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const result = toggleMarker(value, start, end, marker);
    if (result.value === value) return;
    pendingSelection.current = [result.selectionStart, result.selectionEnd];
    onChange(result.value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && !e.altKey) {
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        apply("**");
      } else if (key === "i") {
        e.preventDefault();
        apply("*");
      }
    }
  };

  const fieldProps = {
    value,
    placeholder,
    onChange: (
      e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => onChange(e.target.value),
    onKeyDown,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    // Reserve room so the toolbar never overlaps the text.
    className: "pr-12",
  };

  return (
    <div className={cn("relative", className)}>
      {multiline ? (
        <Textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          {...fieldProps}
        />
      ) : (
        <Input ref={ref as React.Ref<HTMLInputElement>} {...fieldProps} />
      )}
      {focused ? (
        <div className="absolute right-1 top-1 flex gap-0.5">
          <EmphasisButton label="Bold (⌘/Ctrl+B)" onClick={() => apply("**")}>
            <Bold className="size-3" />
          </EmphasisButton>
          <EmphasisButton label="Italic (⌘/Ctrl+I)" onClick={() => apply("*")}>
            <Italic className="size-3" />
          </EmphasisButton>
        </div>
      ) : null}
    </div>
  );
}

function EmphasisButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      // Prevent the field from blurring (which would hide the toolbar before
      // the click lands) and keep the current text selection intact.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex size-5 items-center justify-center border border-input bg-background text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
    >
      {children}
    </button>
  );
}
