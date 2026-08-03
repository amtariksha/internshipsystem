"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  label: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    // w-full so justify-between actually has room to distribute. Without it the
    // container shrank to its content and the label ran straight into the
    // percentage — "Question 2 of 49" + "4%" read as "Question 2 of 494%".
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="shrink-0 tabular-nums">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
