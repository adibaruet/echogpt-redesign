"use client";

import { motion } from "framer-motion";
import { ArrowUp, FileText, GitCompareArrows, Highlighter, Languages, Search, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/ui/logo";
import { ModelAvatar } from "@/components/ui/model-avatar";
import { cn } from "@/lib/cn";
import type { ModelId } from "@/lib/models";

/** Decorative product mockups built in HTML/CSS: crisp at any size, themeable, zero image weight. */

export function WindowFrame({ children, url, className }: { children: ReactNode; url?: string; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-surface shadow-lift", className)}>
      <div className="flex items-center gap-3 border-b border-line bg-surface-2/70 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        {url && (
          <div className="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-md bg-surface text-[0.7rem] text-faint">
            {url}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Lines({ widths, className }: { widths: string[]; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {widths.map((w, i) => (
        <div key={i} className="h-2 rounded-full bg-surface-3" style={{ width: w }} />
      ))}
    </div>
  );
}

function AnswerCard({ model, name, delay, lines }: { model: ModelId; name: string; delay: number; lines: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-xl border border-line bg-surface p-3"
    >
      <div className="mb-2.5 flex items-center gap-2">
        <ModelAvatar id={model} size="sm" />
        <span className="text-xs font-semibold text-fg">{name}</span>
        <span className="ml-auto rounded bg-surface-2 px-1.5 text-[0.6rem] font-medium text-faint">1.2s</span>
      </div>
      <Lines widths={lines} />
    </motion.div>
  );
}

/** Hero visual: the redesigned web app in compare mode. */
export function HeroAppMock() {
  return (
    <WindowFrame url="echogpt.live/chat">
      <div className="grid grid-cols-[150px_1fr] sm:grid-cols-[180px_1fr]">
        <aside className="hidden flex-col gap-2 border-r border-line bg-bg-subtle p-3 min-[480px]:flex" aria-hidden="true">
          <div className="flex items-center gap-2">
            <LogoMark className="size-6" />
            <span className="text-xs font-bold text-fg">EchoGPT</span>
          </div>
          <div className="mt-1 flex h-7 items-center justify-center rounded-lg bg-brand text-[0.65rem] font-semibold text-white">
            + New chat
          </div>
          <div className="flex h-7 items-center gap-1.5 rounded-lg border border-line bg-surface px-2 text-[0.6rem] text-faint">
            <Search className="size-3" /> Search
          </div>
          <p className="mt-2 text-[0.55rem] font-semibold uppercase tracking-wider text-faint">Today</p>
          {["Launch plan ideas", "Resume summary", "Explain React hooks"].map((t, i) => (
            <div key={t} className={cn("truncate rounded-md px-2 py-1.5 text-[0.65rem]", i === 0 ? "bg-brand-soft text-brand-soft-fg" : "text-muted")}>
              {t}
            </div>
          ))}
          <p className="mt-2 text-[0.55rem] font-semibold uppercase tracking-wider text-faint">Explore</p>
          {["Image Studio", "Compare", "AI Tasks"].map((t) => (
            <div key={t} className="rounded-md px-2 py-1 text-[0.65rem] text-muted">
              {t}
            </div>
          ))}
        </aside>
        <div className="col-span-2 flex min-h-[320px] flex-col p-3 min-[480px]:col-span-1 sm:p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-[0.65rem] font-semibold text-fg">
              <ModelAvatar id="gpt" size="sm" /> GPT
            </span>
            <span className="text-[0.65rem] text-faint">vs</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-[0.65rem] font-semibold text-fg">
              <ModelAvatar id="claude" size="sm" /> Claude
            </span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-brand-soft px-1.5 py-0.5 text-[0.6rem] font-bold text-brand-soft-fg">
              <GitCompareArrows className="size-3" /> Compare
            </span>
          </div>
          <div className="mt-4 ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-brand px-3 py-2 text-[0.7rem] text-white">
            Write a launch tweet for our new Chrome extension
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <AnswerCard model="gpt" name="GPT" delay={0.5} lines={["92%", "100%", "78%", "60%"]} />
            <AnswerCard model="claude" name="Claude" delay={0.8} lines={["100%", "86%", "94%", "40%"]} />
          </div>
          <div className="mt-auto flex items-center gap-2 rounded-xl border border-line bg-surface p-1.5 pl-3 shadow-soft">
            <span className="text-[0.7rem] text-faint">Ask anything…</span>
            <span className="ml-auto inline-flex size-6 items-center justify-center rounded-lg bg-brand text-white">
              <ArrowUp className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}

/** Extension visual: a page with the EchoGPT side panel docked. */
export function ExtensionMock() {
  return (
    <WindowFrame url="blog.example.com/remote-work">
      <div className="grid grid-cols-[1fr_190px] sm:grid-cols-[1fr_230px]">
        <div className="p-4 sm:p-5" aria-hidden="true">
          <div className="h-3 w-2/3 rounded-full bg-surface-3" />
          <div className="mt-2 h-3 w-1/2 rounded-full bg-surface-3" />
          <Lines className="mt-5" widths={["100%", "96%", "88%", "100%"]} />
          <p className="mt-3 rounded bg-brand-soft px-1 text-[0.6rem] leading-4 text-brand-soft-fg">
            asynchronous communication reduces meeting load
          </p>
          <div className="mt-1 inline-flex gap-1 rounded-lg border border-line bg-surface p-1 shadow-soft">
            <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.55rem] font-semibold text-fg">
              <Sparkles className="size-2.5 text-brand" />
              Explain
            </span>
            <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[0.55rem] text-muted">
              <Languages className="size-2.5" />
              Translate
            </span>
          </div>
          <Lines className="mt-4" widths={["94%", "100%", "72%"]} />
        </div>
        <div className="flex flex-col border-l border-line bg-bg-subtle p-3">
          <div className="flex items-center gap-1.5">
            <LogoMark className="size-5" />
            <span className="text-[0.65rem] font-bold text-fg">EchoGPT</span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-line px-1.5 py-0.5 text-[0.55rem] text-muted">
              <ModelAvatar id="gemini" size="sm" className="size-3.5 text-[0.45rem]" />
              Gemini
            </span>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 self-start rounded-full bg-surface-2 px-2 py-0.5 text-[0.55rem] text-muted">
            <FileText className="size-2.5" />
            Using this page
          </div>
          <div className="mt-2 rounded-xl border border-line bg-surface p-2">
            <p className="text-[0.6rem] font-semibold text-fg">Summary</p>
            <Lines className="mt-1.5" widths={["100%", "90%", "96%", "70%"]} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {["Key takeaways", "Translate", "Reply"].map((c) => (
              <span key={c} className="rounded-full border border-line bg-surface px-1.5 py-0.5 text-[0.55rem] text-muted">
                {c}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-1 rounded-lg border border-line bg-surface p-1 pl-2 pt-1">
            <Highlighter className="size-3 text-faint" />
            <span className="text-[0.55rem] text-faint">Ask about this page</span>
            <span className="ml-auto inline-flex size-5 items-center justify-center rounded-md bg-brand text-white">
              <ArrowUp className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
