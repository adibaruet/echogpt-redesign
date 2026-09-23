"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  GitCompareArrows,
  Keyboard,
  Menu,
  Moon,
  PanelLeftOpen,
  Settings,
  Share2,
  SquarePen,
  Sun,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ModelAvatar } from "@/components/ui/model-avatar";
import { Kbd } from "@/components/ui/primitives";
import { ThemeSegmented, ThemeToggle } from "@/components/ui/theme-toggle";
import { Toast, useToast } from "@/components/ui/toast";
import { useHotkey, useIsMac } from "@/hooks/use-hotkey";
import { streamChat } from "@/lib/ai/client";
import { cn } from "@/lib/cn";
import { titleFrom, useChatStore } from "@/lib/chat/store";
import { type Attachment, type Message, uid } from "@/lib/chat/types";
import { DEFAULT_MODEL, getModel, MODELS, type ModelId } from "@/lib/models";
import { saveThemePreference } from "@/lib/theme";
import { type Command, CommandPalette } from "./command-palette";
import { Composer, type ComposerHandle } from "./composer";
import { EmptyState } from "./empty-state";
import { ChatMessage } from "./message";
import { ModelPicker } from "./model-picker";
import { Sidebar } from "./sidebar";

const PREFS_KEY = "echogpt.prefs.v1";
type Prefs = { defaultModel: ModelId; sidebarOpen: boolean };

function readPrefs(): Prefs {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") as Partial<Prefs>;
    return { defaultModel: p.defaultModel ?? DEFAULT_MODEL, sidebarOpen: p.sidebarOpen ?? true };
  } catch {
    return { defaultModel: DEFAULT_MODEL, sidebarOpen: true };
  }
}

export function ChatApp() {
  const store = useChatStore();
  const { conversations, dispatch, hydrated } = store;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftModel, setDraftModel] = useState<ModelId>(DEFAULT_MODEL);
  const [defaultModel, setDefaultModel] = useState<ModelId>(DEFAULT_MODEL);
  const [compare, setCompare] = useState(false);
  const [compareModel, setCompareModel] = useState<ModelId>("claude");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [streamingIds, setStreamingIds] = useState<Set<string>>(new Set());

  const composer = useRef<ComposerHandle>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const controllers = useRef(new Map<string, AbortController>());
  const { toast, show: showToast, dismiss } = useToast();
  const isMac = useIsMac();
  const modKey = isMac ? "⌘" : "Ctrl";

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const model = active?.model ?? draftModel;
  const streaming = active ? streamingIds.has(active.id) : false;

  /* ---------- init from prefs + URL (?model=claude&compare=1) ---------- */
  useEffect(() => {
    const prefs = readPrefs();
    const params = new URLSearchParams(window.location.search);
    const urlModel = params.get("model");
    const m = MODELS.some((x) => x.id === urlModel) ? (urlModel as ModelId) : prefs.defaultModel;
    /* eslint-disable react-hooks/set-state-in-effect */
    setDefaultModel(prefs.defaultModel);
    setDraftModel(m);
    setSidebarOpen(prefs.sidebarOpen);
    if (params.get("compare") === "1") {
      setCompare(true);
      setCompareModel(m === "claude" ? "gpt" : "claude");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const savePrefs = (p: Partial<Prefs>) => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ ...readPrefs(), ...p }));
    } catch {
      /* ignore */
    }
  };

  /* ---------- scrolling ---------- */
  const scrollToBottom = useCallback((smooth = true) => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    if (atBottom) scrollToBottom(false);
  }, [active?.messages, atBottom, scrollToBottom]);

  useEffect(() => {
    // Jump to the end whenever a different chat is opened
    requestAnimationFrame(() => scrollToBottom(false));
  }, [activeId, scrollToBottom]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  /* ---------- streaming ---------- */
  const runStream = useCallback(
    async (convId: string, messageId: string, models: ModelId[], prompt: string) => {
      const ctrl = new AbortController();
      controllers.current.set(convId, ctrl);
      setStreamingIds((s) => new Set(s).add(convId));
      await Promise.all(
        models.map(async (m) => {
          for await (const token of streamChat({ prompt, model: m, signal: ctrl.signal })) {
            dispatch({ type: "appendToken", id: convId, messageId, model: m, token });
          }
          dispatch({ type: "finishVariant", id: convId, messageId, model: m, status: ctrl.signal.aborted ? "stopped" : "done" });
        }),
      );
      controllers.current.delete(convId);
      setStreamingIds((s) => {
        const n = new Set(s);
        n.delete(convId);
        return n;
      });
    },
    [dispatch],
  );

  const stop = useCallback(() => {
    if (active) controllers.current.get(active.id)?.abort();
  }, [active]);

  const send = useCallback(
    (text: string, attachments: Attachment[]) => {
      const prompt = text || `Please review the attached file${attachments.length > 1 ? "s" : ""}.`;
      const conv = active ?? store.createConversation(model, titleFrom(prompt));
      if (!active) setActiveId(conv.id);
      const models: ModelId[] = compare ? [model, compareModel] : [model];
      const userMsg: Message = { id: uid(), role: "user", content: text, attachments, createdAt: Date.now() };
      const botMsg: Message = {
        id: uid(),
        role: "assistant",
        createdAt: Date.now(),
        variants: models.map((m) => ({ model: m, content: "", status: "streaming" })),
      };
      dispatch({ type: "addMessage", id: conv.id, message: userMsg });
      dispatch({ type: "addMessage", id: conv.id, message: botMsg });
      setAtBottom(true);
      runStream(conv.id, botMsg.id, models, prompt);
    },
    [active, compare, compareModel, dispatch, model, runStream, store],
  );

  const regenerate = useCallback(() => {
    if (!active || streaming) return;
    const msgs = active.messages;
    const last = msgs[msgs.length - 1];
    const prevUser = [...msgs].reverse().find((m) => m.role === "user");
    if (!last || last.role !== "assistant" || !prevUser) return;
    const models = last.variants?.map((v) => v.model) ?? [model];
    dispatch({ type: "resetVariants", id: active.id, messageId: last.id, models });
    runStream(active.id, last.id, models, prevUser.content || "Review the attached files");
  }, [active, dispatch, model, runStream, streaming]);

  /* ---------- chat management ---------- */
  const newChat = useCallback(() => {
    setActiveId(null);
    setDraftModel(defaultModel);
    setMobileOpen(false);
    requestAnimationFrame(() => composer.current?.focus());
  }, [defaultModel]);

  const selectChat = (id: string) => {
    setActiveId(id);
    setMobileOpen(false);
  };

  const deleteChat = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (!conv) return;
    controllers.current.get(id)?.abort();
    dispatch({ type: "delete", id });
    if (activeId === id) setActiveId(null);
    showToast(`Deleted “${conv.title}”`, { label: "Undo", onClick: () => dispatch({ type: "restore", conversation: conv }) });
  };

  const changeModel = (m: ModelId) => {
    if (active) dispatch({ type: "setModel", id: active.id, model: m });
    else setDraftModel(m);
    if (m === compareModel) setCompareModel(MODELS.find((x) => x.id !== m)!.id);
  };

  const toggleCompare = () => {
    setCompare((c) => {
      const next = !c;
      if (next && compareModel === model) setCompareModel(MODELS.find((x) => x.id !== model)!.id);
      showToast(next ? "Compare mode on. Each prompt goes to two models." : "Compare mode off");
      return next;
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen((o) => {
      savePrefs({ sidebarOpen: !o });
      return !o;
    });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Couldn't copy the link");
    }
  };

  /* ---------- shortcuts ---------- */
  useHotkey({ key: "k", mod: true }, (e) => {
    e.preventDefault();
    setPaletteOpen((o) => !o);
  });
  useHotkey({ key: "o", mod: true, shift: true }, (e) => {
    e.preventDefault();
    newChat();
  });
  useHotkey({ key: "b", mod: true }, (e) => {
    e.preventDefault();
    toggleSidebar();
  });
  useEffect(() => {
    // "/" focuses the composer when not typing elsewhere
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        composer.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands: Command[] = useMemo(
    () => [
      { id: "new", group: "Actions", label: "New chat", icon: <SquarePen />, hint: `${modKey} ⇧ O`, run: newChat },
      { id: "compare", group: "Actions", label: compare ? "Turn off Compare mode" : "Turn on Compare mode", icon: <GitCompareArrows />, run: toggleCompare },
      { id: "settings", group: "Actions", label: "Open settings", icon: <Settings />, run: () => setSettingsOpen(true) },
      { id: "light", group: "Theme", label: "Switch to light theme", icon: <Sun />, run: () => saveThemePreference("light") },
      { id: "dark", group: "Theme", label: "Switch to dark theme", icon: <Moon />, run: () => saveThemePreference("dark") },
      ...MODELS.map((m) => ({
        id: `model-${m.id}`,
        group: "Switch model",
        label: `Use ${m.name}`,
        icon: <ModelAvatar id={m.id} size="sm" />,
        hint: m.provider,
        run: () => changeModel(m.id),
      })),
      ...conversations.slice(0, 20).map((c) => ({ id: `chat-${c.id}`, group: "Chats", label: c.title, run: () => selectChat(c.id) })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conversations, compare, modKey, model, compareModel, activeId],
  );

  /* ---------- render ---------- */
  const sidebar = (mobile: boolean) => (
    <Sidebar
      conversations={conversations}
      hydrated={hydrated}
      activeId={activeId}
      onSelect={selectChat}
      onNew={newChat}
      onDelete={deleteChat}
      onTogglePin={(id) => dispatch({ type: "togglePin", id })}
      onRename={(id, title) => dispatch({ type: "rename", id, title })}
      onExplore={(label) => {
        setMobileOpen(false);
        if (label === "Compare") {
          if (!compare) toggleCompare();
        } else showToast(`${label} isn't part of this demo yet`);
      }}
      onOpenSettings={() => setSettingsOpen(true)}
      onCollapse={mobile ? () => setMobileOpen(false) : toggleSidebar}
      mobile={mobile}
      modKey={modKey}
    />
  );

  const messages = active?.messages ?? [];

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 288 : 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="hidden shrink-0 overflow-hidden border-r border-line lg:block"
        aria-label="Sidebar"
        aria-hidden={!sidebarOpen}
        inert={!sidebarOpen}
      >
        <div className="h-full w-72">{sidebar(false)}</div>
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 left-0 w-[85%] max-w-80 border-r border-line shadow-lift"
            >
              {sidebar(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-1 border-b border-line/70 px-2 sm:px-4">
          <IconButton label="Open sidebar" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu />
          </IconButton>
          {!sidebarOpen && (
            <>
              <IconButton label={`Expand sidebar (${modKey} B)`} className="hidden lg:inline-flex" onClick={toggleSidebar}>
                <PanelLeftOpen />
              </IconButton>
              <IconButton label="New chat" className="hidden lg:inline-flex" onClick={newChat}>
                <SquarePen />
              </IconButton>
            </>
          )}
          <div className="flex min-w-0 items-center gap-1">
            <ModelPicker value={model} onChange={changeModel} />
            <AnimatePresence>
              {compare && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="flex items-center gap-1"
                >
                  <span className="text-xs font-semibold text-faint">vs</span>
                  <ModelPicker value={compareModel} onChange={setCompareModel} exclude={model} label="Compare with" className="max-sm:[&_button>span]:hidden" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={toggleCompare}
              aria-pressed={compare}
              title="Send each prompt to two models"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold transition-colors",
                compare ? "bg-brand-soft text-brand-soft-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
              )}
            >
              <GitCompareArrows className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Compare</span>
            </button>
            <IconButton label="Share chat" onClick={share} className="hidden sm:inline-flex" disabled={!active}>
              <Share2 />
            </IconButton>
            <ThemeToggle />
          </div>
        </header>

        <main id="main" className="relative flex min-h-0 flex-1 flex-col">
          <div ref={scroller} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <EmptyState model={model} compareWith={compare ? compareModel : undefined} onPick={(p) => composer.current?.setText(p)} />
            ) : (
              <div className={cn("mx-auto w-full space-y-8 px-4 py-8", compare ? "max-w-5xl" : "max-w-3xl")} aria-live="off">
                {messages.map((m, i) => (
                  <ChatMessage
                    key={m.id}
                    message={m}
                    isLast={i === messages.length - 1}
                    onRegenerate={regenerate}
                    onFeedback={(v) => active && dispatch({ type: "feedback", id: active.id, messageId: m.id, value: v })}
                    onPrefer={(pm) => {
                      changeModel(pm);
                      setCompare(false);
                      showToast(`Continuing with ${getModel(pm).name}`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {!atBottom && messages.length > 0 && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                onClick={() => scrollToBottom()}
                aria-label="Scroll to latest message"
                className="absolute bottom-36 left-1/2 z-10 inline-flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-lift hover:text-fg"
              >
                <ArrowDown className="size-4" />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="shrink-0 bg-gradient-to-t from-bg via-bg to-transparent px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
            <Composer
              ref={composer}
              className={cn("mx-auto", compare ? "max-w-5xl" : "max-w-3xl")}
              onSubmit={send}
              onStop={stop}
              streaming={streaming}
              placeholder={compare ? `Ask ${getModel(model).name} and ${getModel(compareModel).name}…` : `Message ${getModel(model).name}…`}
            />
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <div className="space-y-6 p-5">
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-fg">Appearance</h3>
              <p className="text-xs text-muted">Light, dark or follow your system.</p>
            </div>
            <ThemeSegmented />
          </section>
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-fg">Default model</h3>
              <p className="text-xs text-muted">Used for every new chat.</p>
            </div>
            <ModelPicker
              value={defaultModel}
              align="right"
              label="Default model"
              onChange={(m) => {
                setDefaultModel(m);
                savePrefs({ defaultModel: m });
                if (!active) setDraftModel(m);
              }}
            />
          </section>
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Keyboard className="size-4" aria-hidden="true" /> Keyboard shortcuts
            </h3>
            <dl className="mt-3 grid gap-2 text-sm">
              {[
                ["Command menu", [modKey, "K"]],
                ["New chat", [modKey, "⇧", "O"]],
                ["Toggle sidebar", [modKey, "B"]],
                ["Focus message box", ["/"]],
                ["New line", ["⇧", "Enter"]],
              ].map(([label, keys]) => (
                <div key={label as string} className="flex items-center justify-between">
                  <dt className="text-muted">{label as string}</dt>
                  <dd className="flex gap-1">
                    {(keys as string[]).map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4">
            <div>
              <h3 className="text-sm font-semibold text-fg">Clear chat history</h3>
              <p className="text-xs text-muted">Deletes all conversations stored in this browser.</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                const snapshot = conversations;
                controllers.current.forEach((c) => c.abort());
                dispatch({ type: "clearAll" });
                setActiveId(null);
                setSettingsOpen(false);
                showToast("All chats cleared", {
                  label: "Undo",
                  onClick: () => dispatch({ type: "hydrate", conversations: snapshot }),
                });
              }}
            >
              <Trash2 className="size-4" aria-hidden="true" /> Clear all
            </Button>
          </section>
        </div>
      </Dialog>

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
