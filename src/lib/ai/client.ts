export const AI_MODELS = {
  primary: "anthropic/claude-sonnet-4.6",
  fallback: "openai/gpt-5.4",
} as const;

export const MODEL = AI_MODELS.primary;
