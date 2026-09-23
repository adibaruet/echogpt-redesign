"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Monitor, PanelRight } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { ExtensionMock, HeroAppMock } from "./mocks";

const TABS = [
  {
    id: "web",
    label: "Web app",
    icon: Monitor,
    title: "A chat app that gets out of your way",
    points: [
      "Model picker right where you type, not hidden in a menu",
      "Searchable history grouped by date, with pinning",
      "Compare mode, voice input and Ctrl + K command palette",
    ],
    href: "/chat",
    cta: "Open the web app",
  },
  {
    id: "extension",
    label: "Chrome sidebar",
    icon: PanelRight,
    title: "AI on every tab, without leaving the page",
    points: [
      "One-click Summarize, Key takeaways and Translate",
      "Highlight any text to Explain, Translate or Rewrite",
      "Clear “Using this page” indicator, so you know what's shared",
    ],
    href: "/extension",
    cta: "Try the extension demo",
  },
] as const;

export function ProductPreview() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("web");
  const current = TABS.find((t) => t.id === tab)!;

  return (
    <section id="preview" aria-labelledby="preview-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="preview-title"
          eyebrow="Product preview"
          title="One assistant, two places to use it"
          description="Your chats sync between the web app and the Chrome side panel. Both demos below are fully interactive."
        />

        <Reveal className="mt-10 flex justify-center">
          <div role="tablist" aria-label="Product surfaces" className="inline-flex rounded-xl border border-line bg-surface-2 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="preview-panel"
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
                  tab === t.id ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {tab === t.id && (
                  <motion.span layoutId="preview-pill" className="absolute inset-0 rounded-lg bg-surface shadow-soft" transition={{ type: "spring", duration: 0.4 }} />
                )}
                <t.icon className="relative size-4" aria-hidden="true" />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div id="preview-panel" role="tabpanel" className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-copy"}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{current.title}</h3>
              <ul className="mt-6 space-y-4">
                {current.points.map((p) => (
                  <li key={p} className="flex gap-3 text-muted">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-soft-fg">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="leading-7">{p}</span>
                  </li>
                ))}
              </ul>
              <ButtonLink href={current.href} variant="outline" className="mt-8">
                {current.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + "-visual"}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
            >
              {current.id === "web" ? <HeroAppMock /> : <ExtensionMock />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
