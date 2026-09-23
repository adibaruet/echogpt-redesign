"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpenText, Languages, Lock, MessageCircleQuestion, PanelRight, RotateCw, Wand2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/cn";
import { SidePanel, type SidePanelHandle } from "./side-panel";

const SITE = "blog.example.com";
const TITLE = "Why small teams are shipping faster with AI";

const PARAGRAPHS = [
  "Two years ago, a five-person product team needed weeks to research a market, write the copy and ship a landing page. Today, many small teams do it in days. The difference is not headcount. It is how they use AI for the first draft of almost everything.",
  "The pattern is consistent: AI handles the repetitive 80 percent, such as summarizing research, drafting emails and generating variations, while people focus on judgment, taste and the final 20 percent that makes work feel considered.",
  "One surprising finding is that switching between tools costs more than the tools themselves. Teams that keep AI inside the browser, next to the page they are reading, report far less context switching than teams that copy and paste between tabs.",
  "Asynchronous communication also plays a role. When decisions are written down, AI can summarize the thread for anyone who missed it, and meetings shrink from an hour to fifteen minutes.",
  "There are limits. Models still make confident mistakes, so the best teams compare answers from more than one model when stakes are high and always keep a human in the loop before anything ships.",
];

type Sel = { text: string; x: number; y: number } | null;

export function BrowserDemo() {
  const panel = useRef<SidePanelHandle>(null);
  const article = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<Sel>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [toolbarEnabled, setToolbarEnabled] = useState(true);

  const readSelection = useCallback(() => {
    if (!toolbarEnabled) return;
    const s = window.getSelection();
    const text = s?.toString().trim() ?? "";
    if (!s || s.rangeCount === 0 || text.length < 4 || !article.current?.contains(s.anchorNode)) {
      setSel(null);
      return;
    }
    const r = s.getRangeAt(0).getBoundingClientRect();
    const box = article.current.getBoundingClientRect();
    setSel({ text, x: Math.min(Math.max(r.left + r.width / 2 - box.left, 120), box.width - 120), y: r.top - box.top + article.current.scrollTop });
  }, [toolbarEnabled]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest("[data-sel-toolbar]")) setSel(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // Ctrl/Cmd + Shift + E toggles the panel, just like the real extension
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setPanelOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const act = (verb: string) => {
    if (!sel) return;
    const quote = sel.text;
    setSel(null);
    window.getSelection()?.removeAllRanges();
    setPanelOpen(true);
    const prompts: Record<string, string> = {
      Explain: "Explain this in simple words",
      Translate: "Translate this into Bangla",
      Rewrite: "Rewrite this to be clearer and shorter",
      Ask: "What does this mean for a small team?",
    };
    // wait a frame so the panel is mounted if it was closed
    requestAnimationFrame(() => panel.current?.ask(prompts[verb], quote));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-surface-2/70 px-3 py-2">
        <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-1 hidden items-center gap-1 text-faint sm:flex" aria-hidden="true">
          <ArrowLeft className="size-4" />
          <ArrowRight className="size-4" />
          <RotateCw className="size-3.5" />
        </div>
        <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg bg-surface px-3 text-xs text-muted">
          <Lock className="size-3 shrink-0 text-success" aria-hidden="true" />
          <span className="truncate">{SITE}/ai-small-teams</span>
        </div>
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          aria-pressed={panelOpen}
          aria-label={panelOpen ? "Close EchoGPT side panel" : "Open EchoGPT side panel"}
          title="EchoGPT (Ctrl + Shift + E)"
          className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition-colors", panelOpen ? "bg-brand-soft text-brand-soft-fg" : "text-muted hover:bg-surface")}
        >
          <LogoMark className="size-5" />
          <PanelRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex h-[1040px] flex-col md:h-[640px] md:flex-row">
        {/* Page */}
        <div
          ref={article}
          onMouseUp={readSelection}
          onKeyUp={readSelection}
          onTouchEnd={() => setTimeout(readSelection, 50)}
          className="relative h-[400px] shrink-0 overflow-y-auto bg-bg p-5 md:h-auto md:flex-1 md:p-10"
        >
          <article className="mx-auto max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Productivity · 6 min read</p>
            <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-fg md:text-3xl">{TITLE}</h3>
            <p className="mt-2 text-sm text-muted">By the Example Blog team</p>
            <div className="mt-6 space-y-4 text-[0.95rem] leading-7 text-fg/85">
              {PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>

          <AnimatePresence>
            {sel && (
              <motion.div
                data-sel-toolbar
                role="toolbar"
                aria-label="Selection actions"
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                style={{ left: sel.x, top: Math.max(sel.y - 52, 4) }}
                className="absolute z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-line bg-surface p-1 shadow-lift"
              >
                <LogoMark className="mx-1 size-5" />
                {(
                  [
                    ["Explain", BookOpenText],
                    ["Translate", Languages],
                    ["Rewrite", Wand2],
                    ["Ask", MessageCircleQuestion],
                  ] as const
                ).map(([label, Icon]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => act(label)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-fg hover:bg-surface-2"
                  >
                    <Icon className="size-3.5 text-brand" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side panel */}
        <AnimatePresence initial={false}>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.2 }}
              className="min-h-0 flex-1 border-t border-line md:w-[380px] md:flex-none md:border-l md:border-t-0"
            >
              <SidePanel
                ref={panel}
                pageTitle={TITLE}
                site={SITE}
                selectionToolbar={toolbarEnabled}
                onSelectionToolbarChange={setToolbarEnabled}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
