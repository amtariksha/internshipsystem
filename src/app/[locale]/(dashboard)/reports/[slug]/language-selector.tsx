"use client";

import { useState, useTransition } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";

interface LanguageOption {
  code: string;
  label: string;
  /** Whether a narrative in this language already exists (cached or default). */
  generated: boolean;
}

interface ReportLanguageSelectorProps {
  slug: string;
  sessionId: string;
  /** The currently displayed report language (from ?rlang, defaults to report locale). */
  currentLocale: string;
  options: LanguageOption[];
  labels: {
    reportLanguage: string;
    notGeneratedYet: string;
    generateInLanguage: string;
    generating: string;
    generateFailed: string;
  };
}

/**
 * Lets the report viewer switch the narrative language. Already-generated
 * languages are one-click links (?rlang=xx). A language that has not been
 * generated yet shows a button that POSTs to /api/assessment/score with a
 * reportLocale to generate + cache it, then navigates to that language.
 */
export function ReportLanguageSelector({
  slug,
  sessionId,
  currentLocale,
  options,
  labels,
}: ReportLanguageSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const current = options.find((o) => o.code === currentLocale);
  const needsGeneration = current ? !current.generated : false;

  function select(code: string) {
    setError(null);
    router.push(`/reports/${slug}?rlang=${code}`);
  }

  async function generate() {
    setError(null);
    try {
      const res = await fetch("/api/assessment/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, reportLocale: currentLocale }),
      });
      if (!res.ok) {
        setError(labels.generateFailed);
        return;
      }
      // Narrative is now cached for currentLocale; re-render this page.
      startTransition(() => router.refresh());
    } catch {
      setError(labels.generateFailed);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{labels.reportLanguage}</span>
        {options.map((opt) => (
          <Button
            key={opt.code}
            type="button"
            size="sm"
            variant={opt.code === currentLocale ? "default" : "outline"}
            onClick={() => select(opt.code)}
            aria-current={opt.code === currentLocale ? "true" : undefined}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {needsGeneration && (
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
          <p className="text-muted-foreground">{labels.notGeneratedYet}</p>
          <Button
            type="button"
            size="sm"
            className="mt-2"
            onClick={generate}
            disabled={isPending}
          >
            {isPending ? labels.generating : `${labels.generateInLanguage} ${current?.label ?? ""}`}
          </Button>
          {error && <p className="mt-2 text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}
