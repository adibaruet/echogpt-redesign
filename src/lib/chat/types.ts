import type { ModelId } from "@/lib/models";

export type Attachment = { name: string; size: number; type: string };

export type Variant = {
  model: ModelId;
  content: string;
  status: "streaming" | "done" | "stopped";
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  createdAt: number;
  /** user text */
  content?: string;
  attachments?: Attachment[];
  /** assistant replies: one per model (two in Compare mode) */
  variants?: Variant[];
  feedback?: "up" | "down";
};

export type Conversation = {
  id: string;
  title: string;
  model: ModelId;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
};

export const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
