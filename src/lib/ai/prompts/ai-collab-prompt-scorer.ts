export function buildPromptComplexityPrompt(userMessage: string): string {
  return `Rate the complexity of this prompt on a scale of 0-5. Consider:
- Specificity: Is it vague ("help me") or precise ("implement a binary search with error handling")?
- Technical depth: Does it reference specific concepts, patterns, or constraints?
- Decomposition: Does it break the problem into parts?
- Context awareness: Does it reference previous conversation or project state?

Prompt: "${userMessage}"

Output ONLY a JSON object: {"complexity": <number 0-5>, "note": "<5 words max>"}`;
}
