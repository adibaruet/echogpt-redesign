import { ArrowRight, Check, Puzzle } from "lucide-react";
import type { Metadata } from "next";
import { BrowserDemo } from "@/components/extension/browser-demo";
import { ExtensionPopup } from "@/components/extension/popup";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Kbd } from "@/components/ui/primitives";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { CHROME_STORE_URL } from "@/lib/content";

export const metadata: Metadata = {
  title: "Chrome Extension",
  description: "A redesigned EchoGPT side panel: page-aware quick actions, a selection toolbar, slash commands and synced history.",
};

const CHANGES = [
  {
    area: "Popup",
    problem: "Popups close the moment you click away, which breaks longer chats.",
    solution: "A fast launcher: ask, pick a model, run a page action or jump into the side panel.",
  },
  {
    area: "Navigation",
    problem: "Chat, history and settings compete for space in a narrow panel.",
    solution: "Three clear tabs: Chat, History, Settings. New chat and ‘Open in web app’ always in the header.",
  },
  {
    area: "Prompt input",
    problem: "A blank text box doesn't tell people what the extension can do.",
    solution: "Suggested page actions, / slash commands and a visible page-context chip you can switch off.",
  },
  {
    area: "Model selection",
    problem: "Choosing a model feels like a settings chore, not an everyday decision.",
    solution: "Model picker in the header with plain-language strengths and Pro badges.",
  },
  {
    area: "History",
    problem: "Past answers are hard to find without knowing which page they came from.",
    solution: "Searchable, shows the site and model, and syncs with the web app.",
  },
  {
    area: "Quick actions",
    problem: "Page tools hidden behind menus get forgotten.",
    solution: "Highlight text for an instant toolbar: Explain, Translate, Rewrite or Ask.",
  },
  {
    area: "Settings",
    problem: "Technical options (like an API endpoint) confuse non-technical users.",
    solution: "Grouped into Assistant, Privacy, Appearance, Shortcuts and Account, in everyday language.",
  },
  {
    area: "Consistency",
    problem: "The extension and web app should feel like one product.",
    solution: "Same tokens, components and dark mode as the web app and site.",
  },
];

export default function ExtensionPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="relative isolate overflow-hidden">
          <div className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_65%)]" />
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand">Chrome extension concept</p>
              <h1 className="mx-auto mt-3 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
                Your AI sidekick, right next to every page
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                A redesigned side panel that understands the page you&apos;re on. Try it below: pick a quick action, type{" "}
                <Kbd className="align-middle">/</Kbd> or highlight any sentence in the article.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href={CHROME_STORE_URL} external size="lg">
                  <Puzzle className="size-4" aria-hidden="true" /> Add to Chrome
                </ButtonLink>
                <ButtonLink href="/chat" variant="outline" size="lg">
                  Open web app <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </section>

        <section aria-label="Interactive side panel demo" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <Reveal>
            <BrowserDemo />
          </Reveal>
          <p className="mt-4 text-center text-sm text-muted">
            Tip: press <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>E</Kbd> to toggle the panel.
          </p>
        </section>

        <section aria-labelledby="popup-title" className="border-y border-line bg-bg-subtle py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand">Toolbar popup</p>
              <h2 id="popup-title" className="mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
                A launcher, not a cramped chat
              </h2>
              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                Popups close the moment you click away, so long conversations don&apos;t belong there. The new popup is
                built for two-second tasks, then hands off to the side panel.
              </p>
              <ul className="mt-6 space-y-3">
                {["Ask anything with one keystroke", "Switch models with a tap", "Run a page action instantly", "Resume a recent chat"].map((t) => (
                  <li key={t} className="flex items-center gap-3 text-fg">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand-soft text-brand-soft-fg">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="flex min-w-0 justify-center">
              <ExtensionPopup />
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="changes-title" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              id="changes-title"
              eyebrow="What changed"
              title="Designed around real browsing"
              description="Every change came from one question: what is the fastest path from reading something to understanding it?"
            />
            <ul className="mt-14 grid gap-4 md:grid-cols-2">
              {CHANGES.map((c, i) => (
                <li key={c.area}>
                  <Reveal delay={(i % 2) * 0.06} className="h-full rounded-2xl border border-line bg-surface p-5">
                    <h3 className="font-semibold text-fg">{c.area}</h3>
                    <dl className="mt-3 space-y-2 text-sm leading-6">
                      <div className="flex gap-2">
                        <dt className="w-16 shrink-0 font-semibold text-faint">Problem</dt>
                        <dd className="text-muted">{c.problem}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-16 shrink-0 font-semibold text-brand">Design</dt>
                        <dd className="text-fg">{c.solution}</dd>
                      </div>
                    </dl>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
