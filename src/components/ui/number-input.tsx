"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: NumberInputProps) {
  const decrement = () => {
    const next = Math.round((value - step) * 100) / 100;
    if (next >= min) onChange(next);
  };

  const increment = () => {
    const next = Math.round((value + step) * 100) / 100;
    if (next <= max) onChange(next);
  };

  return (
    <div
      className={cn(
        "flex h-8 items-center rounded-lg border border-input overflow-hidden",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "dark:bg-input/30",
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="flex items-center justify-center w-7 h-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
      >
        <Minus className="size-3" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!isNaN(v) && v >= min && v <= max) onChange(v);
        }}
        min={min}
        max={max}
        step={step}
        className="w-full h-full bg-transparent text-center text-sm outline-none border-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden [-moz-appearance:textfield]"
      />
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="flex items-center justify-center w-7 h-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
      >
        <Plus className="size-3" />
      </button>
    </div>
  );
}

export { NumberInput };
