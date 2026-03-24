"use client";

import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  elapsed: number;
  guideSecs: number;
  isOverTime: boolean;
}

export function TimerDisplay({ elapsed, guideSecs, isOverTime }: TimerDisplayProps) {
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div
      className={cn(
        "font-mono text-xs tabular-nums",
        isOverTime ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
      <span className="ml-1 text-muted-foreground/50">/ {guideSecs}s</span>
    </div>
  );
}
