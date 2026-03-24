"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FreeTextInputProps {
  aiPrompt: string;
  onSubmit: (text: string) => void;
  isSubmitting: boolean;
  freeTextInstruction: string;
}

export function FreeTextInput({
  aiPrompt,
  onSubmit,
  isSubmitting,
  freeTextInstruction,
}: FreeTextInputProps) {
  const [text, setText] = useState("");

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="space-y-3">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm leading-relaxed">{aiPrompt}</p>
        </div>
        <p className="text-xs text-muted-foreground">{freeTextInstruction}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={handlePaste}
          placeholder="Share your thoughts here..."
          rows={6}
          className="resize-none"
          maxLength={3000}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length} / 3000 characters
          </span>
          <Button
            onClick={() => onSubmit(text)}
            disabled={text.length < 10 || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
