import { ArrowRight, Puzzle } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CHROME_STORE_URL } from "@/lib/content";
import Link from "next/link";

export function CallToAction() {
  return (
    <section aria-labelledby="cta-title" className="px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#5b21d6] via-[#6a3de8] to-[#9b3ce8] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <div className="bg-grid absolute inset-0 opacity-15 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative">
          <h2 id="cta-title" className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Your AI toolkit, one click away
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Add EchoGPT to Chrome in seconds, or start chatting on the web. It&apos;s free to get started.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={CHROME_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("secondary", "lg", "bg-white text-[#4c1fc4] hover:bg-white/90")}
            >
              <Puzzle className="size-4" aria-hidden="true" />
              Add to Chrome, it&apos;s free
            </a>
            <Link href="/chat" className={buttonClasses("outline", "lg", "border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20")}>
              Open web app
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-5 text-sm text-white/70">
            Tip: press <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-sans text-xs">Ctrl</kbd> +{" "}
            <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-sans text-xs">Shift</kbd> +{" "}
            <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-sans text-xs">E</kbd> on any page to open the sidebar.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
