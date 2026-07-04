"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface DimensionScore {
  name: string;
  score: number;
  fullMark: number;
}

interface DimensionRadarProps {
  data: DimensionScore[];
  /**
   * When true, some dimensions had insufficient data to score. A warning is
   * shown so a normalized 0 (or a missing spoke) is not read as a real result.
   */
  hasInsufficientData?: boolean;
}

export function DimensionRadar({ data, hasInsufficientData = false }: DimensionRadarProps) {
  return (
    <div className="space-y-2">
      {hasInsufficientData && (
        <p
          role="status"
          className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-500"
        >
          Some dimensions had insufficient data and may not be fully represented below.
        </p>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
