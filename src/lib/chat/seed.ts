import { composeMockReply } from "@/lib/ai/mock";
import type { ModelId } from "@/lib/models";
import { type Conversation, uid } from "./types";

/** A few example chats on first visit so history, grouping and pinning are visible in the demo. */
export function seedConversations(): Conversation[] {
  const now = Date.now();
  const day = 86_400_000;
  const mk = (title: string, prompt: string, model: ModelId, ago: number, pinned = false): Conversation => {
    const t = now - ago;
    return {
      id: uid(),
      title,
      model,
      pinned,
      createdAt: t,
      updatedAt: t,
      messages: [
        { id: uid(), role: "user", content: prompt, createdAt: t },
        {
          id: uid(),
          role: "assistant",
          createdAt: t + 2000,
          variants: [{ model, content: composeMockReply(prompt, model).text, status: "done" }],
        },
      ],
    };
  };
  return [
    mk("Reusable debounce hook", "Write a reusable React hook to debounce a search input", "claude", 2 * 3600_000, true),
    mk("Instagram captions for rainy Dhaka", "Write 3 Instagram captions for a photo of a rainy evening in Dhaka with a cup of tea.", "echogpt", day + 3600_000),
    mk("30-day reading challenge", "Create a 30-day challenge to help me build a consistent morning reading habit.", "gpt", 3 * day),
  ];
}
