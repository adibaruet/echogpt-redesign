import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { FEATURES } from "@/lib/content";
import { cn } from "@/lib/cn";

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title="Everything you need from AI, nothing you don't"
          description="EchoGPT brings the best models into one focused interface, so you spend time on the answer, not on switching apps."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <li key={f.title}>
              <Reveal delay={i * 0.05} className="h-full">
                <div
                  className={cn(
                    "group h-full rounded-2xl border border-line bg-surface p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift",
                  )}
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand-soft-fg transition-colors group-hover:bg-brand group-hover:text-white">
                    <f.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-fg">{f.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-7 text-muted">{f.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
