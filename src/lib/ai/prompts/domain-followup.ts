interface DomainFollowUpParams {
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  domain: string;
  subdomain: string | null;
  difficulty: number;
  locale: string;
}

export function buildDomainFollowUpPrompt(params: DomainFollowUpParams): string {
  const { questionText, selectedAnswer, correctAnswer, isCorrect, domain, subdomain, difficulty, locale } = params;

  const languageInstruction =
    locale === "hi"
      ? "Respond ENTIRELY in Hindi (Devanagari script). Do not use English."
      : "Respond in clear, simple English.";

  const probeType = isCorrect
    ? `The student answered CORRECTLY (selected: "${selectedAnswer}").
Generate a follow-up question that probes DEEPER understanding:
- Ask them to explain WHY this answer is correct
- Ask for a real-world application or example
- Test if they understand the underlying concept vs. just knowing the answer`
    : `The student answered INCORRECTLY (selected: "${selectedAnswer}", correct: "${correctAnswer}").
Generate a follow-up question that diagnoses the gap:
- Determine if it was a careless mistake or a genuine knowledge gap
- Ask a simpler question about the same concept to gauge baseline understanding
- Be encouraging, not judgmental`;

  return `You are assessing a student's ${domain}${subdomain ? ` (${subdomain})` : ""} knowledge at difficulty level ${difficulty}/5.

Original question: "${questionText}"

${probeType}

Requirements:
- Generate exactly ONE probing question (2-3 sentences max)
- The question must be open-ended (not yes/no)
- It must directly relate to the concept being tested
- Adjust complexity for difficulty level ${difficulty}/5
- ${languageInstruction}

Output ONLY the question, nothing else.`;
}
