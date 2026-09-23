"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/ui/logo";
import { SUGGESTIONS } from "@/lib/content";
import { getModel, type ModelId } from "@/lib/models";

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? "Working late?" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function EmptyState({ model, compareWith, onPick }: { model: ModelId; compareWith?: ModelId; onPick: (prompt: string) => void }) {
  const m = getModel(model);
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 pb-6 pt-8 text-center sm:pt-14">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.5 }}>
        <LogoMark className="size-14 drop-shadow-[0_10px_24px_color-mix(in_oklab,var(--brand)_40%,transparent)]" />
      </motion.div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-fg sm:text-3xl" suppressHydrationWarning>
        {greeting()}. How can I help?
      </h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        {compareWith ? (
          <>
            Comparing <strong className="text-fg">{m.name}</strong> and <strong className="text-fg">{getModel(compareWith).name}</strong>. Every
            prompt goes to both.
          </>
        ) : (
          <>
            You&apos;re chatting with <strong className="text-fg">{m.name}</strong>. {m.blurb}.
          </>
        )}
      </p>

      <ul className="mt-8 grid w-full gap-3 text-left sm:grid-cols-2">
        {SUGGESTIONS.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
            <button
              type="button"
              onClick={() => onPick(s.prompt)}
              className="group flex h-full w-full gap-3 rounded-2xl border border-line bg-surface p-4 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-soft"
            >
              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `color-mix(in oklab, ${s.tint} 14%, transparent)`, color: s.tint }}
              >
                <s.icon className="size-[1.1rem]" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-fg">{s.title}</span>
                <span className="mt-0.5 block text-sm leading-5 text-muted">{s.description}</span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
