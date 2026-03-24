interface DomainProbeScoringParams {
  questionText: string;
  aiProbe: string;
  studentResponse: string;
  domain: string;
  subdomain: string | null;
  locale: string;
}

export function buildDomainProbeScoringPrompt(params: DomainProbeScoringParams): string {
  const { questionText, aiProbe, studentResponse, domain, subdomain, locale } = params;

  return `You are evaluating a student's response to a domain knowledge probe in ${domain}${subdomain ? ` (${subdomain})` : ""}.

Original MCQ question: "${questionText}"
Follow-up probe question: "${aiProbe}"
Student's response: "${studentResponse}"

Score the response on THREE dimensions (0-5 scale each):

1. **Conceptual Understanding** (0-5): Does the student demonstrate understanding of the underlying concept?
   - 5: Deep, accurate understanding with nuance
   - 3: Basic understanding, some gaps
   - 1: Fundamental misunderstanding
   - 0: No relevant content

2. **Application Ability** (0-5): Can they apply the concept to real scenarios?
   - 5: Clear practical application with examples
   - 3: Some application ability
   - 1: Cannot connect theory to practice
   - 0: No attempt at application

3. **Overall Score** (0-5): Holistic assessment of domain competence shown
   - Consider the quality of reasoning, not just correctness
   - A short but accurate response beats a long vague one
   - Account for the student's likely education level

Also provide a brief reasoning (1-2 sentences) explaining the score.

${locale === "hi" ? "The student's response is in Hindi. Evaluate it in the context of Hindi-medium education." : ""}

Output as JSON with these exact fields: conceptualUnderstanding, applicationAbility, score, reasoning.`;
}
