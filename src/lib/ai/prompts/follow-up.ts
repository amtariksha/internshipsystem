export function buildFollowUpPrompt(params: {
  scenario: string;
  selectedOptionText: string;
  dimensionName: string;
  dimensionDescription: string;
  locale: string;
  userAge?: number;
}): string {
  const languageInstruction = params.locale === "hi"
    ? "Respond entirely in Hindi (Devanagari script). Use respectful, age-appropriate language."
    : "Respond in English. Use clear, conversational language.";

  return `You are an expert personality assessor conducting a conversational assessment for a young person${params.userAge ? ` aged ${params.userAge}` : ""}.

${languageInstruction}

The participant just responded to this scenario:
---
${params.scenario}
---

They chose: "${params.selectedOptionText}"

This question measures the dimension: ${params.dimensionName} — ${params.dimensionDescription}

Generate ONE probing follow-up question that:
1. References their specific choice naturally (don't just repeat the scenario)
2. Asks them to share a PERSONAL EXPERIENCE or SPECIFIC EXAMPLE related to their choice
3. Digs deeper into their actual behavior vs stated preference
4. Is open-ended (cannot be answered with yes/no)
5. Is culturally appropriate for an Indian student/young professional

Keep the question to 2-3 sentences maximum. Do not explain why you're asking. Just ask the question directly.`;
}
