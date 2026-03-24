"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface AstroResult {
  destinyNumber: number;
  soulNumber: number;
  personalityNumber: number;
  sunSign: string;
  moonSign: string;
  topCareers: { career: string; score: number; reasoning: string }[];
}

export default function AstroQuickPage() {
  const t = useTranslations("astro");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AstroResult | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/astro/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob }),
      });
      if (res.ok) {
        setResult(await res.json());
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{t("quick.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("quick.description")}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("quick.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("quick.nameLabel")}</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pradeep / प्रदीप"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">{t("quick.dobLabel")}</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Analyzing..." : t("quick.analyze")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <Card>
                <CardContent className="grid grid-cols-3 gap-4 pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{result.destinyNumber}</div>
                    <div className="text-xs text-muted-foreground">{t("results.destinyNumber")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{result.soulNumber}</div>
                    <div className="text-xs text-muted-foreground">{t("results.soulNumber")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{result.personalityNumber}</div>
                    <div className="text-xs text-muted-foreground">{t("results.personalityNumber")}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex justify-around pt-6">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">{result.sunSign}</Badge>
                    <div className="text-xs text-muted-foreground">{t("results.sunSign")}</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">{result.moonSign}</Badge>
                    <div className="text-xs text-muted-foreground">{t("results.moonSign")}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("results.topCareers")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.topCareers.map((career, i) => (
                    <div key={i} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{career.career}</span>
                        <span className="font-mono text-xs text-primary">{career.score}%</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{career.reasoning}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <p className="text-center text-xs text-muted-foreground">{t("disclaimer")}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
