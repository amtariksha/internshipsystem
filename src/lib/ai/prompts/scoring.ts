export function buildScoringPrompt(params: {
  scenario: string;
  selectedOptionText: string;
  freeText: string;
  dimensionName: string;
  dimensionDescription: string;
  locale: string;
  userAge?: number;
}): string {
  return `You are a psychometric scoring engine. Analyze a free-text response from a personality assessment.

Context:
- Dimension being measured: ${params.dimensionName} — ${params.dimensionDescription}
- Participant age: ${params.userAge ?? "unknown"}
- Response language: ${params.locale === "hi" ? "Hindi" : "English"}

The participant saw this scenario:
---
${params.scenario}
---

They chose: "${params.selectedOptionText}"

Then they wrote this free-text response to a follow-up question:
---
${params.freeText}
---

Score the response on these criteria (0-5 each):

1. **Specificity**: Does the response include concrete details, specific examples, or real situations? (5 = very specific with named examples, 0 = completely vague/generic)

2. **Consistency**: Is the free-text response consistent with their SJT choice? Do their stated values and described behaviors align? (5 = perfectly consistent, 0 = contradicts their choice)

3. **Depth**: Does the response show self-awareness, reflection, or nuanced thinking? (5 = deep introspection, 0 = surface-level platitude)

4. **Authenticity**: Does this feel like a genuine personal response vs a rehearsed, AI-generated, or socially desirable answer? (5 = clearly personal and authentic, 0 = sounds like ChatGPT or a textbook)

5. **Overall Score**: How well does this response indicate strength in ${params.dimensionName}? (5 = strong evidence of this trait, 0 = no evidence or counter-evidence)

Important:
- Adjust expectations for the participant's stated age
- Account for ${params.locale === "hi" ? "Hindi" : "English"} language norms
- Short but specific responses can score higher than long generic ones
- Watch for social desirability bias (saying what sounds good vs genuine reflection)

Provide your scoring as structured output with a brief reasoning.`;
}
