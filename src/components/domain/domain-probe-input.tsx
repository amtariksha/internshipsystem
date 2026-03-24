"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface DomainProbeInputProps {
  aiPrompt: string;
  onSubmit: (response: string) => void;
  isSubmitting: boolean;
  instruction: string;
  submitLabel: string;
}

export function DomainProbeInput({
  aiPrompt,
  onSubmit,
  isSubmitting,
  instruction,
  submitLabel,
}: DomainProbeInputProps) {
  const [response, setResponse] = useState("");

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <p className="text-sm leading-relaxed">{aiPrompt}</p>
      </div>

      <p className="text-xs text-muted-foreground">{instruction}</p>

      <Textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Type your answer here..."
        rows={4}
        disabled={isSubmitting}
        className="resize-none"
      />

      <Button
        onClick={() => response.trim().length > 0 && onSubmit(response)}
        disabled={response.trim().length < 10 || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "..." : submitLabel}
      </Button>
    </div>
  );
}
