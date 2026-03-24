export function buildReportPrompt(params: {
  dimensionScores: { name: string; normalized: number; confidence: number }[];
  compositeScore: number;
  tierStartup: string;
  tierTech: string;
  tierConsultant: string;
  tierTeam: string;
  commitmentFlag: boolean;
  locale: string;
  userAge?: number;
}): string {
  const languageInstruction = params.locale === "hi"
    ? "Write the entire report in Hindi (Devanagari script). Use formal but approachable language suitable for a young Indian audience."
    : "Write the report in English. Use clear, encouraging but honest language.";

  const scoresTable = params.dimensionScores
    .map((d) => `- ${d.name}: ${d.normalized}/100 (confidence: ${Math.round(d.confidence * 100)}%)`)
    .join("\n");

  return `You are a career guidance expert writing a personalized assessment report for a young person${params.userAge ? ` aged ${params.userAge}` : ""}.

${languageInstruction}

Assessment Results:
Composite Score: ${params.compositeScore}/100

Dimension Scores:
${scoresTable}

Talent Tier Classifications:
- Startup Co-founder: ${params.tierStartup}
- Structured Tech Role: ${params.tierTech}
- Independent Consultant: ${params.tierConsultant}
- Team (Amtariksha): ${params.tierTeam}

${params.commitmentFlag ? "COMMITMENT FLAG DETECTED: High stated ambition but low follow-through indicators." : ""}

Generate a comprehensive assessment report that includes:

1. **Summary**: 2-3 sentence executive summary capturing the essence of this person's profile

2. **Strengths**: 3-5 key strengths based on the highest-scoring dimensions. Be specific about how these strengths manifest.

3. **Growth Areas**: 2-4 areas for development based on the lowest-scoring dimensions. Provide actionable, encouraging advice. Never be harsh or discouraging.

4. **Career Paths**: 3-5 suggested career paths with fit percentages and reasoning. Base these on the dimension profile, not just the composite score. Consider Indian career context (startups, tech companies, consulting, government, family business).

5. **Personality Snapshot**: 1-2 paragraph vivid description of this person's personality as revealed by the assessment.

Important:
- Be honest but encouraging — this is for a young person exploring their potential
- Use the dimension scores to ground every claim
- ${params.commitmentFlag ? "Address the commitment gap sensitively — frame it as a growth opportunity, not a character flaw" : ""}
- Make career suggestions culturally relevant to India
- Don't use generic platitudes — reference the specific score patterns`;
}
