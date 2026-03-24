"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConsentFormProps {
  title: string;
  description: string;
  consent: string;
  rules: { title: string; items: string[] };
  languageNote: string;
  beginLabel: string;
  onBegin: () => void;
  isLoading: boolean;
}

export function ConsentForm({
  title,
  description,
  consent,
  rules,
  languageNote,
  beginLabel,
  onBegin,
  isLoading,
}: ConsentFormProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border p-4">
          <h4 className="mb-2 text-sm font-medium">{rules.title}</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {rules.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 text-muted-foreground/50">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">{languageNote}</p>

        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={accepted}
            onCheckedChange={(v) => setAccepted(v === true)}
          />
          <Label htmlFor="consent" className="text-xs leading-relaxed cursor-pointer">
            {consent}
          </Label>
        </div>

        <Button onClick={onBegin} disabled={!accepted || isLoading} className="w-full">
          {isLoading ? "Starting..." : beginLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
