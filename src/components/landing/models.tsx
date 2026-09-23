"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { ModelAvatar } from "@/components/ui/model-avatar";
import { Badge } from "@/components/ui/primitives";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { MODELS, type ModelId } from "@/lib/models";

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-fg">{value}/5</span>
      </div>
      <div className="mt-2 flex gap-1" role="img" aria-label={`${label}: ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={cn("h-2 flex-1 rounded-full", n <= value ? "bg-brand" : "bg-surface-3")} />
        ))}
      </div>
    </div>
  );
}

export function Models() {
  const [active, setActive] = useState<ModelId>("echogpt");
  const model = MODELS.find((m) => m.id === active)!;

  return (
    <section id="models" aria-labelledby="models-title" className="scroll-mt-20 border-y border-line bg-bg-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="models-title"
          eyebrow="AI models"
          title="The right model for every task"
          description="Different models shine at different things. Pick one, switch mid-chat, or run two at once in Compare mode."
        />

        <Reveal className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div role="tablist" aria-label="AI models" aria-orientation="vertical" className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {MODELS.map((m) => {
              const selected = m.id === active;
              return (
                <button
                  key={m.id}
                  role="tab"
                  id={`model-tab-${m.id}`}
                  aria-selected={selected}
                  aria-controls="model-panel"
                  type="button"
                  onClick={() => setActive(m.id)}
                  className={cn(
                    "flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    selected ? "border-brand bg-surface shadow-soft" : "border-transparent hover:bg-surface",
                  )}
                >
                  <ModelAvatar id={m.id} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-semibold text-fg">{m.name}</span>
                      {m.tier === "pro" && <Badge>Pro</Badge>}
                    </span>
                    <span className="block truncate text-sm text-muted">{m.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="model-panel"
            role="tabpanel"
            aria-labelledby={`model-tab-${active}`}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-8 lg:sticky lg:top-24 lg:self-start"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full opacity-20 blur-3xl transition-colors"
              style={{ background: model.color }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="flex items-center gap-4">
                  <ModelAvatar id={model.id} size="lg" className="size-14 text-lg" />
                  <div>
                    <h3 className="text-2xl font-bold text-fg">{model.name}</h3>
                    <p className="text-sm text-muted">by {model.provider}</p>
                  </div>
                  <Badge tone={model.tier === "pro" ? "brand" : "success"} className="ml-auto">
                    {model.tier === "pro" ? "Pro" : "Free"}
                  </Badge>
                </div>
                <p className="mt-6 text-lg leading-8 text-fg/90">{model.blurb}.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {model.bestFor.map((b) => (
                    <span key={b} className="rounded-full border border-line bg-surface-2 px-3 py-1 text-sm font-medium text-fg">
                      {b}
                    </span>
                  ))}
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Meter label="Speed" value={model.speed} />
                  <Meter label="Reasoning" value={model.reasoning} />
                </div>
                <dl className="mt-6 flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3 text-sm">
                  <dt className="text-muted">Context window</dt>
                  <dd className="font-semibold text-fg">{model.context} tokens</dd>
                </dl>
                <ButtonLink href={`/chat?model=${model.id}`} className="mt-6 w-full sm:w-auto">
                  Chat with {model.name}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
