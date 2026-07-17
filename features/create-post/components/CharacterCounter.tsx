"use client";

import { cn } from "@/lib/utils";

interface CharacterCounterProps {
  current: number;
  max: number;
}

export function CharacterCounter({
  current,
  max,
}: CharacterCounterProps) {
  const percentage = (current / max) * 100;

  const colorClass =
    percentage >= 100
      ? "text-destructive"
      : percentage >= 90
      ? "text-amber-500"
      : "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs font-medium transition-colors",
        colorClass
      )}
      aria-live="polite"
      aria-label={`${current} of ${max} characters used`}
    >
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-200",
            percentage >= 100
              ? "bg-destructive"
              : percentage >= 90
              ? "bg-amber-500"
              : "bg-primary"
          )}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <span>
        {current}/{max}
      </span>
    </div>
  );
}