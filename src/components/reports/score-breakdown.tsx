"use client";

interface ScoreItem {
  name: string;
  score: number;
  confidence: number;
}

interface ScoreBreakdownProps {
  scores: ScoreItem[];
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      {scores.map((item) => (
        <div key={item.name} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{item.name}</span>
            <span className="font-mono text-xs">{item.score}/100</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${item.score}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground/50">
              {Math.round(item.confidence * 100)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
