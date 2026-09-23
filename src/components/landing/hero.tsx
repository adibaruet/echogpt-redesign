"use client";

import { motion } from "framer-motion";
import { ArrowRight, Puzzle } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ModelAvatar } from "@/components/ui/model-avatar";
import { CHROME_STORE_URL } from "@/lib/content";
import { MODELS } from "@/lib/models";
import { HeroAppMock } from "./mocks";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.21, 0.6, 0.35, 1] as const },
});

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Background */}
      <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_28%,transparent),transparent)] blur-2xl" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...fade(0)}>
            <Link
              href="/chat?compare=1"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pl-1 pr-3 text-xs font-medium text-muted shadow-soft backdrop-blur hover:text-fg sm:text-sm"
            >
              <span className="rounded-full bg-brand px-2 py-0.5 text-[0.7rem] font-bold text-white">New</span>
              Compare two AI models side by side
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.h1
            id="hero-title"
            {...fade(0.08)}
            className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-fg sm:text-5xl lg:text-6xl"
          >
            Every top AI model. <span className="text-gradient">One calm workspace.</span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Chat with EchoGPT, GPT, Claude, Gemini and more in one place. Compare their answers, summarize any page
            and write faster, on the web or right inside Chrome.
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/chat" size="lg">
              Start chatting free
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={CHROME_STORE_URL} external variant="outline" size="lg">
              <Puzzle className="size-4" aria-hidden="true" />
              Add to Chrome
            </ButtonLink>
          </motion.div>

          <motion.div {...fade(0.32)} className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted">
            <div className="flex -space-x-1.5" aria-hidden="true">
              {MODELS.slice(0, 6).map((m) => (
                <ModelAvatar key={m.id} id={m.id} size="md" className="ring-2 ring-bg" />
              ))}
            </div>
            <span>{MODELS.length} models · Free plan · No credit card</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
          className="relative mx-auto mt-14 max-w-4xl"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-b from-brand/20 to-transparent blur-2xl" />
          <HeroAppMock />
        </motion.div>
      </div>
    </section>
  );
}
