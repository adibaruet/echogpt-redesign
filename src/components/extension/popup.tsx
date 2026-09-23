"use client";

import { ArrowRight, PanelRight, Search, Settings } from "lucide-react";
import { useState } from "react";
import { IconButton } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { ModelAvatar } from "@/components/ui/model-avatar";
import { Kbd } from "@/components/ui/primitives";
import { QUICK_ACTIONS } from "@/lib/content";
import { cn } from "@/lib/cn";
import { MODELS, type ModelId } from "@/lib/models";

/** The toolbar popup: a fast launcher, not a cramped chat. Full conversations live in the side panel. */
export function ExtensionPopup() {
  const [model, setModel] = useState<ModelId>("echogpt");
  const [q, setQ] = useState("");

  return (
    <div className="w-full max-w-[380px] overflow-hidden rounded-2xl border border-line bg-surface shadow-lift">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <LogoMark className="size-7" />
        <span className="font-bold text-fg">EchoGPT</span>
        <span className="ml-auto" />
        <IconButton size="sm" label="Settings">
          <Settings />
        </IconButton>
      </div>

      <div className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQ("");
          }}
          className="flex items-center gap-2 rounded-xl border border-line bg-bg-subtle px-3 focus-within:border-brand/60"
        >
          <Search className="size-4 text-faint" aria-hidden="true" />
          <label htmlFor="popup-q" className="sr-only">
            Ask EchoGPT
          </label>
          <input
            id="popup-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask anything…"
            className="h-11 flex-1 bg-transparent text-sm text-fg placeholder:text-faint focus:outline-none focus-visible:outline-none"
          />
          <Kbd>↵</Kbd>
        </form>

        <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-wider text-faint">Model</p>
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1" role="radiogroup" aria-label="Model">
          {MODELS.slice(0, 5).map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={model === m.id}
              onClick={() => setModel(m.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
                model === m.id ? "border-brand bg-brand-soft text-brand-soft-fg" : "border-line text-muted hover:text-fg",
              )}
            >
              <ModelAvatar id={m.id} size="sm" className="size-4 text-[0.5rem]" />
              {m.name}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-wider text-faint">On this page</p>
        <ul className="mt-2 grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.slice(0, 4).map((a) => (
            <li key={a.id}>
              <button type="button" className="flex w-full items-center gap-2 rounded-xl border border-line p-2.5 text-left text-xs font-semibold text-fg hover:border-brand/50 hover:bg-brand-soft/40">
                <a.icon className="size-4 text-brand" aria-hidden="true" />
                {a.label}
              </button>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-wider text-faint">Recent</p>
        <ul className="mt-1">
          {["Summary: Async communication guide", "Explain: vector databases"].map((r) => (
            <li key={r}>
              <button type="button" className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm text-fg hover:bg-surface-2">
                <span className="truncate">{r}</span>
                <ArrowRight className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-line bg-bg-subtle px-4 py-3">
        <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
          <PanelRight className="size-4" aria-hidden="true" /> Open side panel
        </button>
        <span className="flex gap-1">
          <Kbd>Ctrl</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>E</Kbd>
        </span>
      </div>
    </div>
  );
}
