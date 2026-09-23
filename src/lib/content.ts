import {
  BookOpenText,
  Briefcase,
  FileText,
  GitCompareArrows,
  Globe,
  Highlighter,
  Keyboard,
  Languages,
  Lightbulb,
  type LucideIcon,
  MessagesSquare,
  PenLine,
  ScanText,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react";

export const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj";

/* ---------- Chat starters (the four from the current app, now with full text + icons) ---------- */
export type Suggestion = { title: string; description: string; prompt: string; icon: LucideIcon; tint: string };

export const SUGGESTIONS: Suggestion[] = [
  {
    title: "Unlock your creative flow",
    description: "Prompts that match your writing style and get you past a block.",
    prompt: "Give me 5 creative writing prompts for a short story about a city that remembers everything.",
    icon: Lightbulb,
    tint: "#f59e0b",
  },
  {
    title: "Build a resume that shines",
    description: "Tailor your experience to the job you actually want.",
    prompt: "Help me write a resume summary for a frontend developer internship. I know React, TypeScript and Tailwind.",
    icon: Briefcase,
    tint: "#6a3de8",
  },
  {
    title: "Set a challenge that transforms you",
    description: "A personal plan built around your goals and habits.",
    prompt: "Create a 30-day challenge to help me build a consistent morning reading habit.",
    icon: Target,
    tint: "#12805c",
  },
  {
    title: "Write irresistible social content",
    description: "Catchy captions that start conversations.",
    prompt: "Write 3 Instagram captions for a photo of a rainy evening in Dhaka with a cup of tea.",
    icon: PenLine,
    tint: "#e8467c",
  },
];

/* ---------- Landing: features ---------- */
export type Feature = { title: string; description: string; icon: LucideIcon };

export const FEATURES: Feature[] = [
  {
    title: "Every top model, one chat",
    description: "Switch between EchoGPT, GPT, Claude, Gemini and more mid-conversation. Your context comes with you.",
    icon: MessagesSquare,
  },
  {
    title: "Compare answers side by side",
    description: "Send one prompt to two models and pick the best answer instead of guessing which AI to trust.",
    icon: GitCompareArrows,
  },
  {
    title: "Summarize any page",
    description: "Articles, docs, long threads. One click in the sidebar turns them into key takeaways.",
    icon: ScanText,
  },
  {
    title: "Explain what you highlight",
    description: "Select any text on the web and get a plain-language explanation, translation or rewrite.",
    icon: Highlighter,
  },
  {
    title: "Writing that sounds like you",
    description: "Draft emails, captions and resumes, then polish tone and length with quick actions.",
    icon: Wand2,
  },
  {
    title: "Keyboard-first",
    description: "Ctrl + Shift + E opens the sidebar anywhere. Ctrl + K jumps to any chat, model or setting.",
    icon: Keyboard,
  },
];

/* ---------- Landing: why choose ---------- */
export const WHY: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "One subscription, many models", description: "Stop paying for and juggling separate AI apps.", icon: Sparkles },
  { title: "Works where you already are", description: "A side panel on every tab, so you never lose your place.", icon: Globe },
  { title: "Private by design", description: "Page content is read only when you ask. No third-party trackers in the extension.", icon: ShieldCheck },
  { title: "Fast and light", description: "The extension is under 100 KB and opens instantly.", icon: Zap },
];

export const COMPARISON_ROWS: { label: string; echo: boolean; others: boolean | "partial" }[] = [
  { label: "Multiple AI models in one place", echo: true, others: false },
  { label: "Side-by-side model comparison", echo: true, others: false },
  { label: "Browser sidebar on any website", echo: true, others: "partial" },
  { label: "Summarize page & explain selection", echo: true, others: "partial" },
  { label: "Shared history across web and extension", echo: true, others: false },
  { label: "Free plan", echo: true, others: true },
];

/* ---------- Landing: pricing ---------- */
export type Plan = {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "For trying things out and everyday questions.",
    features: ["EchoGPT, GPT, Llama and Mistral", "Chrome sidebar", "Page summaries", "7-day chat history"],
    cta: "Start for free",
  },
  {
    name: "Pro",
    priceMonthly: 12,
    priceYearly: 9,
    description: "For people who use AI every day.",
    features: [
      "Every model, including Claude, Gemini and DeepSeek",
      "Compare mode",
      "Image & Video Studio",
      "Unlimited history and search",
      "Priority speed",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    priceMonthly: 24,
    priceYearly: 19,
    description: "Per seat. For teams sharing prompts and knowledge.",
    features: ["Everything in Pro", "Shared prompt library", "Admin controls & SSO", "Usage analytics"],
    cta: "Contact sales",
  },
];

/* ---------- Landing: FAQ ---------- */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "What is EchoGPT?",
    a: "EchoGPT is an AI assistant that gives you several leading AI models in one place. Use it on the web or as a Chrome side panel to chat, compare answers, summarize pages and write faster.",
  },
  {
    q: "Which AI models can I use?",
    a: "The free plan includes EchoGPT plus a selection of popular models. Pro unlocks every model we support, including Claude, Gemini and DeepSeek, and lets you compare two models side by side.",
  },
  {
    q: "Does the Chrome extension read every page I visit?",
    a: "No. The extension only reads a page when you use a page feature like Summarize or Explain, or when you turn on page context for a message. You can switch page context off entirely in settings.",
  },
  {
    q: "Is my chat history shared between the web app and the extension?",
    a: "Yes. Sign in with the same account and your conversations sync, so you can start in the sidebar and continue on the web.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes. Cancel from Settings and you keep Pro until the end of your billing period. No questions asked.",
  },
  {
    q: "Which browsers are supported?",
    a: "The extension works in Chrome and Chromium-based browsers such as Edge, Brave and Arc. The web app works in any modern browser, on desktop and mobile.",
  },
];

/* ---------- Landing: testimonials (illustrative placeholders, replace with real quotes before launch) ---------- */
export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote: "Compare mode changed how I research. I ask two models and keep whichever answer holds up.",
    name: "Graduate student",
    role: "Research & thesis writing",
  },
  {
    quote: "The sidebar summary saves me from reading 40-page docs twice. I use it every single day.",
    name: "Product manager",
    role: "B2B SaaS",
  },
  {
    quote: "I highlight a confusing paragraph, hit Explain, done. It feels built into the browser.",
    name: "Junior developer",
    role: "Learning on the job",
  },
];

/* ---------- Extension quick actions ---------- */
export type QuickAction = { id: string; label: string; icon: LucideIcon; prompt: string; command: string };

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "summarize", label: "Summarize page", icon: FileText, prompt: "Summarize this page", command: "/summarize" },
  { id: "takeaways", label: "Key takeaways", icon: Sparkles, prompt: "List the key takeaways from this page", command: "/takeaways" },
  { id: "explain", label: "Explain simply", icon: BookOpenText, prompt: "Explain this page like I'm new to the topic", command: "/explain" },
  { id: "translate", label: "Translate", icon: Languages, prompt: "Translate the main points of this page into Bangla", command: "/translate" },
  { id: "reply", label: "Draft a reply", icon: PenLine, prompt: "Draft a short reply to this post", command: "/reply" },
];
