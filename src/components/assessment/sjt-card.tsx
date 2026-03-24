"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SjtOption {
  position: number;
  text: string;
}

interface SjtCardProps {
  scenario: string;
  prompt: string;
  options: SjtOption[];
  onSubmit: (selectedPosition: number) => void;
  isSubmitting: boolean;
  sjtInstruction: string;
}

export function SjtCard({
  scenario,
  prompt,
  options,
  onSubmit,
  isSubmitting,
  sjtInstruction,
}: SjtCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm leading-relaxed">{scenario}</p>
        </div>
        <p className="font-medium">{prompt}</p>
        <p className="text-xs text-muted-foreground">{sjtInstruction}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => (
          <button
            key={option.position}
            type="button"
            onClick={() => setSelected(option.position)}
            className={cn(
              "w-full rounded-lg border p-4 text-left text-sm transition-colors",
              selected === option.position
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs font-medium">
              {String.fromCharCode(64 + option.position)}
            </span>
            {option.text}
          </button>
        ))}

        <Button
          onClick={() => selected && onSubmit(selected)}
          disabled={!selected || isSubmitting}
          className="mt-4 w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </CardContent>
    </Card>
  );
}
