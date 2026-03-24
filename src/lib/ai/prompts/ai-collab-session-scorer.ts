interface SessionScoringParams {
  challengeTitle: string;
  challengeDescription: string;
  expectedCriteria: string[];
  messages: { role: string; content: string; promptComplexity?: number }[];
  totalPrompts: number;
  durationMinutes: number;
  locale: string;
}

export function buildSessionScoringPrompt(params: SessionScoringParams): string {
  const { challengeTitle, challengeDescription, expectedCriteria, messages, totalPrompts, durationMinutes } = params;

  const conversationText = messages
    .map((m) => `[${m.role}]${m.promptComplexity != null ? ` (complexity: ${m.promptComplexity})` : ""}: ${m.content}`)
    .join("\n\n");

  return `You are evaluating a candidate's AI collaboration skills based on their interaction with an AI assistant during a coding challenge.

CHALLENGE: ${challengeTitle}
DESCRIPTION: ${challengeDescription}
EXPECTED OUTPUT CRITERIA: ${expectedCriteria.join("; ")}

SESSION STATS:
- Total prompts sent: ${totalPrompts}
- Duration: ${durationMinutes} minutes

FULL CONVERSATION:
${conversationText}

Score the candidate on EIGHT dimensions (0-5 each):

1. **ai_decomposition** (Problem Decomposition): Did they break the problem into smaller, manageable parts? Did they tackle it systematically or all at once?

2. **ai_first_principles** (First-Principles Thinking): Did their prompts show understanding of the underlying concepts? Or were they just guessing?

3. **ai_debugging** (Debugging with AI): When the AI produced errors or bugs, did they catch them? How did they approach fixing issues?

4. **ai_communication** (Communication Clarity): Were their prompts clear, specific, and well-structured? Did they provide enough context?

5. **ai_efficiency** (Efficiency): How many prompts did they need? Did they go in circles or make steady progress?

6. **ai_quality** (Solution Quality): What was the quality of the final output they guided the AI to produce?

7. **ai_iteration** (Iteration & Refinement): Did they refine the AI's outputs? Did the quality improve over the session?

8. **ai_creativity** (Creative Problem Solving): Did they use any novel approaches, unexpected techniques, or creative uses of the AI?

For each dimension, provide a score (0-5) and a brief justification (1 sentence).

Also provide:
- An overall summary (2-3 sentences)
- Top 2 strengths
- Top 2 areas for improvement

Output as JSON with this structure:
{
  "ai_decomposition": { "score": <number>, "reason": "<string>" },
  "ai_first_principles": { "score": <number>, "reason": "<string>" },
  "ai_debugging": { "score": <number>, "reason": "<string>" },
  "ai_communication": { "score": <number>, "reason": "<string>" },
  "ai_efficiency": { "score": <number>, "reason": "<string>" },
  "ai_quality": { "score": <number>, "reason": "<string>" },
  "ai_iteration": { "score": <number>, "reason": "<string>" },
  "ai_creativity": { "score": <number>, "reason": "<string>" },
  "summary": "<string>",
  "strengths": ["<string>", "<string>"],
  "improvements": ["<string>", "<string>"]
}`;
}
