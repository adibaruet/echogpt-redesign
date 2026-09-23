"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { PLANS } from "@/lib/content";

export function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="pricing-title"
          eyebrow="Pricing"
          title="Start free. Upgrade when it clicks."
          description="Simple plans with no hidden limits on the basics. Cancel anytime."
        />

        <Reveal className="mt-10 flex items-center justify-center gap-3 text-sm font-medium">
          <span className={cn(!yearly ? "text-fg" : "text-muted")}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label="Bill yearly"
            onClick={() => setYearly((y) => !y)}
            className={cn("relative h-7 w-12 rounded-full transition-colors", yearly ? "bg-brand" : "bg-surface-3")}
          >
            <span
              className={cn(
                "absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform",
                yearly && "translate-x-5",
              )}
            />
          </button>
          <span className={cn(yearly ? "text-fg" : "text-muted")}>
            Yearly <span className="ml-1 rounded-full bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand-soft-fg">Save 25%</span>
          </span>
        </Reveal>

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => {
            const price = yearly ? p.priceYearly : p.priceMonthly;
            return (
              <li key={p.name}>
                <Reveal
                  delay={i * 0.06}
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border p-6 sm:p-7",
                    p.highlighted
                      ? "border-brand bg-surface shadow-lift ring-1 ring-brand"
                      : "border-line bg-surface",
                  )}
                >
                  {p.highlighted && (
                    <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-fg">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted">{p.description}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-fg">${price}</span>
                    <span className="text-sm text-muted">{price === 0 ? "forever" : "/ month"}</span>
                  </p>
                  <p className="h-5 text-xs text-faint">{price > 0 && yearly ? `Billed $${price * 12} yearly` : ""}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-fg/90">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="/chat" variant={p.highlighted ? "primary" : "outline"} className="mt-8 w-full">
                    {p.cta}
                  </ButtonLink>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
