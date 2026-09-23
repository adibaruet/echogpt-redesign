import { Quote } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="testimonials-title" eyebrow="Loved by busy people" title="Built for how you actually work" />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.name}>
              <Reveal delay={i * 0.07} className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
                <Quote className="size-7 text-brand/60" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-[1.02rem] leading-7 text-fg">“{t.quote}”</blockquote>
                <footer className="mt-6 border-t border-line pt-4">
                  <p className="font-semibold text-fg">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </footer>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-faint">Illustrative quotes for this design concept. Replace with real customer feedback before launch.</p>
      </div>
    </section>
  );
}
