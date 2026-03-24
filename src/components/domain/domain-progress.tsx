"use client";

interface DomainProgressProps {
  currentPosition: number;
  estimatedRange: string;
  difficulty: number;
  questionLabel: string;
  difficultyLabel: string;
}

export function DomainProgress({
  currentPosition,
  estimatedRange,
  difficulty,
  questionLabel,
  difficultyLabel,
}: DomainProgressProps) {
  const difficultyColor = [
    "bg-green-500",
    "bg-lime-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
  ][difficulty - 1] ?? "bg-muted";

  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>{questionLabel} ({estimatedRange})</span>
      <div className="flex items-center gap-2">
        <span>{difficultyLabel}</span>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-2 w-2 rounded-full ${level <= difficulty ? difficultyColor : "bg-muted"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
