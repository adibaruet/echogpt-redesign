"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Clock,
  ExternalLink,
  FileText,
  History,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  Square,
  SquarePen,
  X,
} from "lucide-react";
import { forwardRef, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import { Markdown } from "@/components/chat/markdown";
import { ModelPicker } from "@/components/chat/model-picker";
import { IconButton } from "@/components/ui/button";
import { ModelAvatar } from "@/components/ui/model-avatar";
import { Avatar, Kbd } from "@/components/ui/primitives";
import { ThemeSegmented } from "@/components/ui/theme-toggle";
import { streamChat } from "@/lib/ai/client";
import { uid } from "@/lib/chat/types";
import { cn } from "@/lib/cn";
import { QUICK_ACTIONS, type QuickAction } from "@/lib/content";
import { getModel, type ModelId } from "@/lib/models";

type PanelMsg = { id: string; role: "user" | "assistant"; text: string; model?: ModelId; streaming?: boolean; quote?: string };
type Tab = "chat" | "history" | "settings";

export type SidePanelHandle = { ask: (prompt: string, quote?: string) => void };

const HISTORY = [
  { title: "Summary: Async communication guide", site: "blog.example.com", when: "2h ago", model: "echogpt" as ModelId },
  { title: "Explain: What is a vector database?", site: "docs.example.dev", when: "Yesterday", model: "claude" as ModelId },
  { title: "Translate product page to Bangla", site: "shop.example.com", when: "Yesterday", model: "mistral" as ModelId },
  { title: "Draft reply to hiring post", site: "social.example.com", when: "Mon", model: "gpt" as ModelId },
  { title: "Key takeaways: Q3 market report", site: "news.example.org", when: "Last week", model: "gemini" as ModelId },
];

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-medium text-fg">{label}</p>
        {description && <p className="mt-0.5 text-xs leading-5 text-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn("relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors", checked ? "bg-brand" : "bg-surface-3")}
      >
        <span className={cn("absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-4")} />
      </button>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface px-4 py-1">
      <h3 className="pt-3 text-[0.7rem] font-semibold uppercase tracking-wider text-faint">{title}</h3>
      <div className="divide-y divide-line">{children}</div>
    </section>
  );
}

export const SidePanel = forwardRef<
  SidePanelHandle,
  { pageTitle: string; site: string; selectionToolbar: boolean; onSelectionToolbarChange: (v: boolean) => void; className?: string }
>(function SidePanel({ pageTitle, site, selectionToolbar, onSelectionToolbarChange, className }, ref) {
  const [tab, setTab] = useState<Tab>("chat");
  const [model, setModel] = useState<ModelId>("echogpt");
  const [defaultModel, setDefaultModel] = useState<ModelId>("echogpt");
  const [usePage, setUsePage] = useState(true);
  const [pageDefault, setPageDefault] = useState(true);
  const [messages, setMessages] = useState<PanelMsg[]>([]);
  const [text, setText] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [historyQuery, setHistoryQuery] = useState("");
  const [lang, setLang] = useState("English");
  const ctrl = useRef<AbortController | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  const streaming = messages.some((m) => m.streaming);
  const slashOpen = text.startsWith("/") && !text.includes(" ");
  const slashMatches = slashOpen ? QUICK_ACTIONS.filter((a) => a.command.startsWith(text.toLowerCase())) : [];

  const scrollDown = () => requestAnimationFrame(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight }));

  const ask = async (prompt: string, quote?: string) => {
    if (streaming) ctrl.current?.abort();
    setTab("chat");
    const c = new AbortController();
    ctrl.current = c;
    const botId = uid();
    setMessages((ms) => [
      ...ms,
      { id: uid(), role: "user", text: prompt, quote },
      { id: botId, role: "assistant", text: "", model, streaming: true },
    ]);
    scrollDown();
    const context = quote ?? (usePage ? pageTitle : undefined);
    for await (const t of streamChat({ prompt, model, context, signal: c.signal })) {
      setMessages((ms) => ms.map((m) => (m.id === botId ? { ...m, text: m.text + t } : m)));
      const el = scroller.current;
      if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight;
    }
    setMessages((ms) => ms.map((m) => (m.id === botId ? { ...m, streaming: false } : m)));
  };

  useImperativeHandle(ref, () => ({ ask }));

  const runAction = (a: QuickAction) => {
    setText("");
    ask(a.prompt);
  };

  const submit = () => {
    if (slashOpen && slashMatches[slashIndex]) return runAction(slashMatches[slashIndex]);
    const t = text.trim();
    if (!t || streaming) return;
    setText("");
    ask(t);
  };

  const filteredHistory = HISTORY.filter((h) => h.title.toLowerCase().includes(historyQuery.toLowerCase()));

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-bg-subtle", className)}>
      {/* Header */}
      <div className="flex h-13 shrink-0 items-center gap-1 border-b border-line bg-surface px-2">
        <ModelPicker value={model} onChange={setModel} size="sm" label="Model" className="min-w-0" />
        <div className="ml-auto flex items-center">
          <IconButton
            size="sm"
            label="New chat"
            onClick={() => {
              ctrl.current?.abort();
              setMessages([]);
              setTab("chat");
              requestAnimationFrame(() => input.current?.focus());
            }}
          >
            <SquarePen />
          </IconButton>
          <a
            href="/chat"
            target="_blank"
            aria-label="Open in full web app"
            title="Open in full web app"
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Side panel sections" className="flex shrink-0 gap-1 border-b border-line bg-surface px-2">
        {(
          [
            ["chat", "Chat", MessageSquare],
            ["history", "History", History],
            ["settings", "Settings", Settings],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "relative inline-flex h-10 flex-1 items-center justify-center gap-1.5 text-xs font-semibold transition-colors",
              tab === id ? "text-brand" : "text-muted hover:text-fg",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
            {tab === id && <motion.span layoutId="panel-tab" className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand" />}
          </button>
        ))}
      </div>

      {/* Body */}
      {tab === "chat" && (
        <>
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-3 py-4" aria-live="polite">
            {messages.length === 0 ? (
              <div>
                <p className="text-base font-bold text-fg">What can I do with this page?</p>
                <p className="mt-1 text-xs leading-5 text-muted">Pick an action or ask anything. Tip: type / for commands.</p>
                <ul className="mt-4 space-y-1.5">
                  {QUICK_ACTIONS.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => runAction(a)}
                        className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 text-left text-sm font-medium text-fg transition-colors hover:border-brand/50 hover:bg-brand-soft/40"
                      >
                        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-soft text-brand-soft-fg">
                          <a.icon className="size-3.5" aria-hidden="true" />
                        </span>
                        {a.label}
                        <span className="ml-auto font-mono text-[0.68rem] text-faint">{a.command}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-center text-[0.7rem] text-faint">
                  Highlight text on the page to Explain, Translate or Rewrite it.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="flex flex-col items-end gap-1.5">
                      {m.quote && (
                        <p className="max-w-[90%] rounded-xl border-l-2 border-brand bg-surface px-2.5 py-1.5 text-xs italic leading-5 text-muted">
                          “{m.quote.length > 140 ? m.quote.slice(0, 140) + "…" : m.quote}”
                        </p>
                      )}
                      <p className="max-w-[90%] rounded-2xl rounded-br-md bg-brand px-3 py-2 text-sm text-white">{m.text}</p>
                    </div>
                  ) : (
                    <div key={m.id}>
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-fg">
                        <ModelAvatar id={m.model ?? "echogpt"} size="sm" />
                        {getModel(m.model).name}
                      </div>
                      {m.text ? (
                        <Markdown text={m.text} className="space-y-2 text-sm leading-6" />
                      ) : (
                        <p className="animate-pulse text-sm text-muted">Reading the page…</p>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="relative shrink-0 border-t border-line bg-surface p-2.5">
            <AnimatePresence>
              {slashOpen && slashMatches.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  role="listbox"
                  id="slash-menu"
                  aria-label="Commands"
                  className="absolute inset-x-2.5 bottom-full mb-2 rounded-xl border border-line bg-surface p-1 shadow-lift"
                >
                  {slashMatches.map((a, i) => (
                    <li key={a.id} role="option" aria-selected={i === slashIndex}>
                      <button
                        type="button"
                        onMouseEnter={() => setSlashIndex(i)}
                        onClick={() => runAction(a)}
                        className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm", i === slashIndex && "bg-surface-2")}
                      >
                        <a.icon className="size-4 text-brand" aria-hidden="true" />
                        <span className="font-mono text-xs text-muted">{a.command}</span>
                        <span className="text-fg">{a.label}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="mb-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setUsePage((u) => !u)}
                aria-pressed={usePage}
                title={usePage ? "This page is shared with EchoGPT. Click to stop." : "Click to include this page"}
                className={cn(
                  "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-1 text-[0.7rem] font-medium transition-colors",
                  usePage ? "border-brand/40 bg-brand-soft text-brand-soft-fg" : "border-dashed border-line-strong text-muted hover:text-fg",
                )}
              >
                <FileText className="size-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{usePage ? `Using: ${site}` : "Page not shared"}</span>
                {usePage && <X className="size-3 shrink-0" aria-hidden="true" />}
              </button>
            </div>
            <div className="flex items-end gap-1.5 rounded-2xl border border-line bg-bg-subtle p-1.5 focus-within:border-brand/60">
              <label htmlFor="panel-input" className="sr-only">
                Ask about this page
              </label>
              <textarea
                id="panel-input"
                ref={input}
                rows={1}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setSlashIndex(0);
                }}
                onKeyDown={(e) => {
                  if (slashOpen && slashMatches.length) {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      return setSlashIndex((i) => (i + 1) % slashMatches.length);
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      return setSlashIndex((i) => (i - 1 + slashMatches.length) % slashMatches.length);
                    }
                    if (e.key === "Escape") return setText("");
                  }
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    submit();
                  }
                }}
                aria-controls={slashOpen ? "slash-menu" : undefined}
                placeholder={usePage ? "Ask about this page, or type /" : "Ask anything, or type /"}
                className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-fg placeholder:text-faint focus:outline-none focus-visible:outline-none"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={() => ctrl.current?.abort()}
                  aria-label="Stop generating"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-fg text-bg"
                >
                  <Square className="size-3 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!text.trim()}
                  aria-label="Send"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-brand text-white disabled:bg-surface-3 disabled:text-faint"
                >
                  <ArrowUp className="size-4" />
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "history" && (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search history"
              placeholder="Search history"
              value={historyQuery}
              onChange={(e) => setHistoryQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-faint focus:border-brand/60 focus:outline-none"
            />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[0.7rem] text-faint">
            <Clock className="size-3" aria-hidden="true" /> Synced with your web app history
          </p>
          <ul className="mt-2 space-y-1.5">
            {filteredHistory.map((h) => (
              <li key={h.title}>
                <button
                  type="button"
                  onClick={() => ask(h.title)}
                  className="flex w-full items-start gap-3 rounded-xl border border-line bg-surface p-3 text-left hover:border-line-strong"
                >
                  <ModelAvatar id={h.model} size="sm" className="mt-0.5" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{h.title}</span>
                    <span className="block truncate text-xs text-muted">
                      {h.site} · {h.when}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            {filteredHistory.length === 0 && <li className="py-8 text-center text-sm text-muted">No matching chats</li>}
          </ul>
        </div>
      )}

      {tab === "settings" && (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          <SettingsGroup title="Assistant">
            <div className="flex items-center justify-between gap-3 py-3">
              <p className="text-sm font-medium text-fg">Default model</p>
              <ModelPicker
                value={defaultModel}
                onChange={(m) => {
                  setDefaultModel(m);
                  setModel(m);
                }}
                size="sm"
                align="right"
                label="Default model"
              />
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <label htmlFor="reply-lang" className="text-sm font-medium text-fg">
                Reply language
              </label>
              <select
                id="reply-lang"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="h-8 rounded-lg border border-line bg-surface px-2 text-sm text-fg"
              >
                {["English", "বাংলা", "Español", "Français", "العربية", "हिन्दी"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </SettingsGroup>
          <SettingsGroup title="Privacy">
            <Toggle
              label="Share page context by default"
              description="When off, the page is only read when you pick an action."
              checked={pageDefault}
              onChange={(v) => {
                setPageDefault(v);
                setUsePage(v);
              }}
            />
            <Toggle
              label="Selection toolbar"
              description="Show Explain / Translate / Rewrite when you highlight text."
              checked={selectionToolbar}
              onChange={onSelectionToolbarChange}
            />
          </SettingsGroup>
          <SettingsGroup title="Appearance">
            <div className="py-3">
              <ThemeSegmented className="w-full [&>button]:flex-1 [&>button]:justify-center" />
            </div>
          </SettingsGroup>
          <SettingsGroup title="Shortcuts">
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-fg">Open side panel</span>
              <span className="flex gap-1">
                <Kbd>Ctrl</Kbd>
                <Kbd>⇧</Kbd>
                <Kbd>E</Kbd>
              </span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-fg">Commands</span>
              <Kbd>/</Kbd>
            </div>
          </SettingsGroup>
          <SettingsGroup title="Account">
            <div className="flex items-center gap-3 py-3">
              <Avatar name="Demo User" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-fg">Demo User</p>
                <p className="text-xs text-muted">Free plan · <Link href="/#pricing" className="font-semibold text-brand hover:underline">Upgrade</Link></p>
              </div>
              <IconButton size="sm" label="Sign out">
                <LogOut />
              </IconButton>
            </div>
          </SettingsGroup>
          <p className="pb-2 text-center text-[0.7rem] text-faint">EchoGPT extension · v2.0 concept</p>
        </div>
      )}
    </div>
  );
});
