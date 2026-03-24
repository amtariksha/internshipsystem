"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DomainScoreData {
  domain: string;
  compositeScore: number;
  proficiencyLevel: string;
  mcqScore: number;
  aiProbeScore: number | null;
  questionsTotal: number;
  questionsCorrect: number;
  backlogCount: number;
}

interface DomainScoreCardProps {
  data: DomainScoreData;
  labels: {
    title: string;
    mcqAccuracy: string;
    aiProbeScore: string;
    compositeScore: string;
    backlogs: string;
    proficiencyLabel: string;
  };
}

const PROFICIENCY_COLORS: Record<string, string> = {
  EXPERT: "bg-green-500/20 text-green-400 border-green-500/30",
  ADVANCED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  INTERMEDIATE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  BEGINNER: "bg-muted text-muted-foreground",
};

export function DomainScoreCard({ data, labels }: DomainScoreCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{labels.title}</CardTitle>
          <Badge className={PROFICIENCY_COLORS[data.proficiencyLevel] ?? ""}>
            {labels.proficiencyLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{labels.compositeScore}</span>
          <span className="text-lg font-bold">{data.compositeScore}/100</span>
        </div>

        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${data.compositeScore}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-lg border border-border p-2 text-center">
            <p className="text-xs text-muted-foreground">{labels.mcqAccuracy}</p>
            <p className="font-mono text-sm font-medium">{data.questionsCorrect}/{data.questionsTotal}</p>
            <p className="font-mono text-xs text-muted-foreground">{data.mcqScore}%</p>
          </div>
          {data.aiProbeScore !== null && (
            <div className="rounded-lg border border-border p-2 text-center">
              <p className="text-xs text-muted-foreground">{labels.aiProbeScore}</p>
              <p className="font-mono text-sm font-medium">{data.aiProbeScore}/100</p>
            </div>
          )}
        </div>

        {data.backlogCount > 0 && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2">
            <span className="text-yellow-400">&#9888;</span>
            <span className="text-xs text-yellow-400">
              {labels.backlogs}: {data.backlogCount}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
