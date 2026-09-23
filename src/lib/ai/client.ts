import type { ModelId } from "@/lib/models";
import { streamMockReply } from "./mock";

export type StreamRequest = {
  prompt: string;
  model: ModelId;
  /** Optional page title / selected text passed along by the extension */
  context?: string;
  signal?: AbortSignal;
};

/**
 * Single integration point for AI responses.
 *
 * The demo uses an offline mock. To connect the real EchoGPT API, replace the body with a
 * `fetch` to the streaming endpoint and yield decoded chunks. No UI code needs to change.
 */
export function streamChat(req: StreamRequest): AsyncGenerator<string> {
  return streamMockReply(req);
}
