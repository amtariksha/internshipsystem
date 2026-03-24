"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DomainMcqCardProps {
  questionText: string;
  options: { position: number; text: string }[];
  difficulty: number;
  subdomain: string | null;
  onSubmit: (selectedPosition: number) => void;
  isSubmitting: boolean;
  submitLabel: string;
  difficultyLabel: string;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export function DomainMcqCard({
  questionText,
  options,
  difficulty,
  subdomain,
  onSubmit,
  isSubmitting,
  submitLabel,
  difficultyLabel,
}: DomainMcqCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-[10px]">
          {difficultyLabel}
        </Badge>
        {subdomain && (
          <Badge variant="outline" className="text-[10px]">
            {subdomain}
          </Badge>
        )}
      </div>

      <p className="text-sm leading-relaxed">{questionText}</p>

      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={opt.position}
            type="button"
            onClick={() => setSelected(opt.position)}
            disabled={isSubmitting}
            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
              selected === opt.position
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
              selected === opt.position ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              {OPTION_LABELS[i] ?? String(opt.position)}
            </span>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>

      <Button
        onClick={() => selected !== null && onSubmit(selected)}
        disabled={selected === null || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "..." : submitLabel}
      </Button>
    </div>
  );
}
