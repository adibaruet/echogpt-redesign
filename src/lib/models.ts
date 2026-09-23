export type ModelId = "echogpt" | "gpt" | "claude" | "gemini" | "llama" | "deepseek" | "mistral";

export type AIModel = {
  id: ModelId;
  name: string;
  provider: string;
  /** One-line summary shown in pickers */
  blurb: string;
  bestFor: string[];
  tier: "free" | "pro";
  /** Relative scores 1-5 for the landing-page model explorer */
  speed: number;
  reasoning: number;
  context: string;
  /** Monogram colours (no third-party logos are used) */
  color: string;
  monogram: string;
};

/**
 * Illustrative model catalogue. The real list comes from the EchoGPT backend;
 * names are kept to model families so the UI never ships stale version numbers.
 */
export const MODELS: AIModel[] = [
  {
    id: "echogpt",
    name: "EchoGPT",
    provider: "EchoGPT",
    blurb: "Fast, balanced default for ideas, summaries and feedback",
    bestFor: ["Brainstorming", "Quick answers", "Summaries"],
    tier: "free",
    speed: 5,
    reasoning: 3,
    context: "128K",
    color: "#6A3DE8",
    monogram: "E",
  },
  {
    id: "gpt",
    name: "GPT",
    provider: "OpenAI",
    blurb: "Strong all-rounder for writing and reasoning",
    bestFor: ["Writing", "Reasoning", "Everyday tasks"],
    tier: "free",
    speed: 4,
    reasoning: 5,
    context: "128K",
    color: "#10A37F",
    monogram: "G",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic",
    blurb: "Careful analysis, long documents and code",
    bestFor: ["Long documents", "Coding", "Analysis"],
    tier: "pro",
    speed: 4,
    reasoning: 5,
    context: "200K",
    color: "#D97757",
    monogram: "C",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
    blurb: "Huge context window and multimodal input",
    bestFor: ["Research", "Big files", "Images"],
    tier: "pro",
    speed: 4,
    reasoning: 4,
    context: "1M",
    color: "#4285F4",
    monogram: "G",
  },
  {
    id: "llama",
    name: "Llama",
    provider: "Meta",
    blurb: "Open-weight model, quick and lightweight",
    bestFor: ["Speed", "Drafts", "Chat"],
    tier: "free",
    speed: 5,
    reasoning: 3,
    context: "128K",
    color: "#0866FF",
    monogram: "L",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    provider: "DeepSeek",
    blurb: "Step-by-step maths, logic and programming",
    bestFor: ["Math", "Logic", "Code"],
    tier: "pro",
    speed: 3,
    reasoning: 5,
    context: "128K",
    color: "#4D6BFE",
    monogram: "D",
  },
  {
    id: "mistral",
    name: "Mistral",
    provider: "Mistral AI",
    blurb: "Efficient, multilingual writing assistant",
    bestFor: ["Translation", "Multilingual", "Efficiency"],
    tier: "free",
    speed: 5,
    reasoning: 4,
    context: "128K",
    color: "#FA520F",
    monogram: "M",
  },
];

export const DEFAULT_MODEL: ModelId = "echogpt";

export function getModel(id: ModelId | string | undefined): AIModel {
  return MODELS.find((m) => m.id === id) ?? MODELS[0];
}
