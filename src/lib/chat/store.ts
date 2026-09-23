"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import type { ModelId } from "@/lib/models";
import { seedConversations } from "./seed";
import { type Conversation, type Message, uid, type Variant } from "./types";

const STORAGE_KEY = "echogpt.conversations.v1";

type State = { conversations: Conversation[]; hydrated: boolean };

type Action =
  | { type: "hydrate"; conversations: Conversation[] }
  | { type: "create"; conversation: Conversation }
  | { type: "delete"; id: string }
  | { type: "restore"; conversation: Conversation }
  | { type: "rename"; id: string; title: string }
  | { type: "togglePin"; id: string }
  | { type: "setModel"; id: string; model: ModelId }
  | { type: "addMessage"; id: string; message: Message }
  | { type: "appendToken"; id: string; messageId: string; model: ModelId; token: string }
  | { type: "finishVariant"; id: string; messageId: string; model: ModelId; status: Variant["status"] }
  | { type: "resetVariants"; id: string; messageId: string; models: ModelId[] }
  | { type: "feedback"; id: string; messageId: string; value: Message["feedback"] }
  | { type: "clearAll" };

function updateConv(state: State, id: string, fn: (c: Conversation) => Conversation): State {
  return { ...state, conversations: state.conversations.map((c) => (c.id === id ? fn(c) : c)) };
}

function updateMsg(c: Conversation, messageId: string, fn: (m: Message) => Message): Conversation {
  return { ...c, messages: c.messages.map((m) => (m.id === messageId ? fn(m) : m)) };
}

function reducer(state: State, a: Action): State {
  switch (a.type) {
    case "hydrate":
      return { conversations: a.conversations, hydrated: true };
    case "create":
      return { ...state, conversations: [a.conversation, ...state.conversations] };
    case "delete":
      return { ...state, conversations: state.conversations.filter((c) => c.id !== a.id) };
    case "restore":
      return { ...state, conversations: [a.conversation, ...state.conversations] };
    case "rename":
      return updateConv(state, a.id, (c) => ({ ...c, title: a.title }));
    case "togglePin":
      return updateConv(state, a.id, (c) => ({ ...c, pinned: !c.pinned }));
    case "setModel":
      return updateConv(state, a.id, (c) => ({ ...c, model: a.model }));
    case "addMessage":
      return updateConv(state, a.id, (c) => ({ ...c, updatedAt: Date.now(), messages: [...c.messages, a.message] }));
    case "appendToken":
      return updateConv(state, a.id, (c) =>
        updateMsg(c, a.messageId, (m) => ({
          ...m,
          variants: m.variants?.map((v) => (v.model === a.model ? { ...v, content: v.content + a.token } : v)),
        })),
      );
    case "finishVariant":
      return updateConv(state, a.id, (c) =>
        updateMsg(c, a.messageId, (m) => ({
          ...m,
          variants: m.variants?.map((v) => (v.model === a.model && v.status === "streaming" ? { ...v, status: a.status } : v)),
        })),
      );
    case "resetVariants":
      return updateConv(state, a.id, (c) =>
        updateMsg(c, a.messageId, (m) => ({
          ...m,
          feedback: undefined,
          variants: a.models.map((model) => ({ model, content: "", status: "streaming" as const })),
        })),
      );
    case "feedback":
      return updateConv(state, a.id, (c) => updateMsg(c, a.messageId, (m) => ({ ...m, feedback: a.value })));
    case "clearAll":
      return { ...state, conversations: [] };
  }
}

/** Conversation store: useReducer + debounced localStorage persistence. */
export function useChatStore() {
  const [state, dispatch] = useReducer(reducer, { conversations: [], hydrated: false });

  useEffect(() => {
    let convs: Conversation[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      convs = raw ? (JSON.parse(raw) as Conversation[]) : seedConversations();
    } catch {
      /* ignore corrupt storage */
    }
    // Any reply that was mid-stream when the tab closed is marked stopped
    convs = convs.map((c) => ({
      ...c,
      messages: c.messages.map((m) => ({
        ...m,
        variants: m.variants?.map((v) => (v.status === "streaming" ? { ...v, status: "stopped" as const } : v)),
      })),
    }));
    dispatch({ type: "hydrate", conversations: convs });
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!state.hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.conversations));
      } catch {
        /* quota exceeded or unavailable */
      }
    }, 400);
  }, [state]);

  const createConversation = useCallback((model: ModelId, title = "New chat") => {
    const now = Date.now();
    const conversation: Conversation = { id: uid(), title, model, pinned: false, createdAt: now, updatedAt: now, messages: [] };
    dispatch({ type: "create", conversation });
    return conversation;
  }, []);

  return { ...state, dispatch, createConversation };
}

export type ChatDispatch = ReturnType<typeof useChatStore>["dispatch"];

/** Short title from the first prompt */
export function titleFrom(prompt: string) {
  const clean = prompt.replace(/\s+/g, " ").trim();
  return clean.length > 42 ? clean.slice(0, 40).trimEnd() + "…" : clean || "New chat";
}

export function groupByDate(convs: Conversation[]) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const t = startOfToday.getTime();
  const day = 86_400_000;
  const groups: { label: string; items: Conversation[] }[] = [
    { label: "Pinned", items: [] },
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 days", items: [] },
    { label: "Older", items: [] },
  ];
  for (const c of [...convs].sort((a, b) => b.updatedAt - a.updatedAt)) {
    if (c.pinned) groups[0].items.push(c);
    else if (c.updatedAt >= t) groups[1].items.push(c);
    else if (c.updatedAt >= t - day) groups[2].items.push(c);
    else if (c.updatedAt >= t - 7 * day) groups[3].items.push(c);
    else groups[4].items.push(c);
  }
  return groups.filter((g) => g.items.length);
}
