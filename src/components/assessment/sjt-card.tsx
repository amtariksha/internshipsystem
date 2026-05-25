"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface SjtOption {
  position: number;
  text: string;
}

interface SjtCardProps {
  scenario: string;
  prompt: string;
  options: SjtOption[];
  onSubmit: (selectedPosition: number, freeText?: string) => void;
  isSubmitting: boolean;
  sjtInstruction: string;
  noneLabel: string;
  nonePlaceholder: string;
}

const NONE_POSITION = 0;

export function SjtCard({
  scenario,
  prompt,
  options,
  onSubmit,
  isSubmitting,
  sjtInstruction,
  noneLabel,
  nonePlaceholder,
}: SjtCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [freeText, setFreeText] = useState("");

  const isNoneSelected = selected === NONE_POSITION;
  const canSubmit = selected !== null && (!isNoneSelected || freeText.trim().length >= 20);

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
            onClick={() => {
              setSelected(option.position);
              setFreeText("");
            }}
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

        {/* None of the above — with free-text input */}
        <button
          type="button"
          onClick={() => setSelected(NONE_POSITION)}
          className={cn(
            "w-full rounded-lg border p-4 text-left text-sm transition-colors",
            isNoneSelected
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground/50"
          )}
        >
          <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs font-medium">
            ✎
          </span>
          {noneLabel}
        </button>

        {isNoneSelected && (
          <div className="space-y-1.5 pl-1">
            <Textarea
              value={freeText}
              onChange={(event) => setFreeText(event.target.value)}
              placeholder={nonePlaceholder}
              rows={4}
              className="text-sm"
              autoFocus
            />
            <p className="text-[10px] text-muted-foreground">
              {freeText.trim().length < 20
                ? `Min 20 characters (${freeText.trim().length}/20)`
                : `${freeText.trim().length} characters`}
            </p>
          </div>
        )}

        <Button
          onClick={() => {
            if (canSubmit && selected !== null) {
              onSubmit(selected, isNoneSelected ? freeText.trim() : undefined);
            }
          }}
          disabled={!canSubmit || isSubmitting}
          className="mt-4 w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </CardContent>
    </Card>
  );
}
