import { getModel, type ModelId } from "@/lib/models";

/**
 * Offline mock responder. It produces believable, prompt-aware markdown so the UI
 * (streaming, markdown, compare mode, stop/regenerate) can be demoed without a backend.
 */

type Intent = "resume" | "captions" | "challenge" | "creative" | "summary" | "code" | "translate" | "explain" | "greeting" | "general";

function detectIntent(prompt: string): Intent {
  const p = prompt.toLowerCase();
  if (/^(hi|hello|hey|salam|yo)\b/.test(p.trim())) return "greeting";
  if (p.includes("resume") || p.includes("cv")) return "resume";
  if (p.includes("caption") || p.includes("instagram") || p.includes("social")) return "captions";
  if (p.includes("challenge") || p.includes("habit")) return "challenge";
  if (p.includes("story") || p.includes("creative") || p.includes("prompt")) return "creative";
  if (p.includes("translate") || p.includes("bangla")) return "translate";
  if (p.includes("summar") || p.includes("takeaway") || p.includes("tl;dr")) return "summary";
  if (p.includes("explain") || p.includes("what does") || p.includes("what is")) return "explain";
  if (/\b(code|function|react|component|bug|typescript|javascript|python)\b/.test(p)) return "code";
  return "general";
}

const intros: Record<ModelId, string[]> = {
  echogpt: ["Here you go!", "Sure, let's do this.", "Happy to help."],
  gpt: ["Absolutely. Here's a clear approach.", "Great question. Here's a structured answer."],
  claude: ["Good idea. I'll keep this focused and practical.", "Here's a careful take on this."],
  gemini: ["Here's an overview, with a few extra angles.", "Let's break this down."],
  llama: ["Quick answer:", "Here's a fast draft."],
  deepseek: ["Let me reason through it step by step.", "Step-by-step:"],
  mistral: ["Voilà, here's a concise version.", "Here's a compact answer."],
};

function pick<T>(arr: T[], seed: number) {
  return arr[Math.abs(seed) % arr.length];
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function body(intent: Intent, prompt: string, context?: string): string {
  switch (intent) {
    case "greeting":
      return "Hi! I'm your EchoGPT assistant. I can brainstorm ideas, summarize text, draft emails or explain tricky concepts.\n\nTry asking me to:\n- **Summarize** an article you paste\n- **Rewrite** a message in a friendlier tone\n- **Compare** two approaches to a problem\n\nWhat would you like to work on?";
    case "resume":
      return "### Resume summary\n\nFrontend developer focused on building **fast, accessible interfaces** with React, TypeScript and Tailwind CSS. Comfortable turning Figma designs into responsive, component-driven UIs and writing clean, reusable code.\n\n### Tips to make it stand out\n1. Lead with **one measurable result**, e.g. *\"cut page load time by 40%\"*.\n2. Link a live project, not just a repo.\n3. Mirror 3 or 4 keywords from the job post.\n4. Keep it to 3 lines. Recruiters skim.\n\nWant me to tailor it to a specific job description?";
    case "captions":
      return "Here are three options with different vibes:\n\n1. **Cozy:** *Rain on the window, tea in my hands. Dhaka, you know how to slow me down.* ☔\n2. **Playful:** *Forecast: 100% chance of cha.* 🍵\n3. **Poetic:** *Some evenings are written in raindrops and steam.*\n\nAdd a question like *\"Tea or coffee on rainy days?\"* to boost comments.";
    case "challenge":
      return "### 30-day reading habit challenge\n\n**Week 1: Start tiny**\n- Read 5 pages right after waking up\n- Keep the book next to your phone charger\n\n**Week 2: Build the streak**\n- Increase to 10 pages\n- Track each day with a simple ✔ in your notes\n\n**Week 3: Make it yours**\n- Read one chapter, then write one sentence about it\n\n**Week 4: Lock it in**\n- 20 minutes a day, phone in another room\n- Pick your next book before you finish this one\n\n> Rule: never miss two days in a row.";
    case "creative":
      return "Here are 5 prompts to get you writing:\n\n1. A city that remembers everything loses one memory each night. Tonight it's **you**.\n2. The city's walls replay conversations. Someone keeps erasing one of them.\n3. A courier delivers memories the city no longer wants.\n4. Two strangers discover the city remembers them as a married couple.\n5. The city finally forgets something on purpose. Why?\n\nWant me to expand one into an opening paragraph?";
    case "summary":
      return `### Summary\n${context ? `Based on **${context}**:\n\n` : ""}- **Main idea:** small teams ship faster when AI handles first drafts and repetitive research.\n- **Key evidence:** teams report less time spent context-switching between tools.\n- **Caveat:** human review is still essential for accuracy and tone.\n\n### Key takeaways\n1. Use AI for the first 80%, people for the last 20%.\n2. Keep prompts and outputs close to where you work.\n3. Compare models when the stakes are high.`;
    case "translate":
      return "### Bangla translation (main points)\n\n- **মূল ধারণা:** এআই প্রথম খসড়া ও গবেষণার কাজ করলে ছোট দলগুলো দ্রুত কাজ শেষ করতে পারে।\n- **প্রমাণ:** বিভিন্ন টুলের মধ্যে যাওয়া-আসায় সময় কম নষ্ট হয়।\n- **সতর্কতা:** নির্ভুলতার জন্য মানুষের পর্যালোচনা এখনও জরুরি।";
    case "explain":
      return `${context ? `**In plain words:** "${context.slice(0, 120)}${context.length > 120 ? "…" : ""}"\n\n` : ""}Think of it like this: instead of one expert answering every question, you have a small panel. You ask once, pick the most useful answer, and move on.\n\n**Why it matters**\n- Fewer blind spots, since different models are good at different things\n- Less time copying text between apps\n\nWant a real-world example?`;
    case "code":
      return "Here's a small, reusable React hook:\n\n```tsx\nimport { useEffect, useState } from \"react\";\n\nexport function useDebounce<T>(value: T, delay = 300) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}\n```\n\n**How it works:** every change restarts the timer, so the value only updates after the user stops typing for `delay` ms. Great for search inputs.";
    default:
      return `Good question. Here's how I'd approach **"${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}"**:\n\n1. **Clarify the goal.** What does a great result look like?\n2. **List the options.** Two or three realistic paths are enough.\n3. **Pick and test.** Try the simplest option first and learn from it.\n\nIf you share a bit more context, I can make this much more specific.`;
  }
}

export function composeMockReply(prompt: string, model: ModelId, context?: string) {
  const intent = detectIntent(prompt);
  const intro = pick(intros[model], hash(prompt + model));
  const text = intent === "greeting" ? body(intent, prompt) : `${intro}\n\n${body(intent, prompt, context)}`;
  const m = getModel(model);
  // Give compare mode a visible difference between models
  const outro = model === "deepseek" && intent !== "greeting" ? "\n\n*Confidence: high. Let me know if you'd like the reasoning expanded.*" : "";
  return { text: text + outro, speed: m.speed };
}

/** Streams a reply token-by-token. Respects AbortSignal for the Stop button. */
export async function* streamMockReply(opts: {
  prompt: string;
  model: ModelId;
  context?: string;
  signal?: AbortSignal;
}): AsyncGenerator<string> {
  const { text, speed } = composeMockReply(opts.prompt, opts.model, opts.context);
  // "Thinking" delay, then word-ish chunks
  await sleep(350 + (5 - speed) * 180, opts.signal);
  const tokens = text.match(/\S+\s*|\s+/g) ?? [text];
  const base = 34 - speed * 4;
  for (const t of tokens) {
    if (opts.signal?.aborted) return;
    yield t;
    await sleep(base + Math.random() * 18, opts.signal);
  }
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal?.aborted) return resolve();
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      resolve();
    });
  });
}
