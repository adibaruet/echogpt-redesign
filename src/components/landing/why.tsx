import { Check, Minus, X } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { COMPARISON_ROWS, WHY } from "@/lib/content";

function Cell({ value }: { value: boolean | "partial" }) {
  if (value === true)
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-brand text-white">
        <Check className="size-4" aria-hidden="true" />
        <span className="sr-only">Yes</span>
      </span>
    );
  if (value === "partial")
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-surface-3 text-muted">
        <Minus className="size-4" aria-hidden="true" />
        <span className="sr-only">Partly</span>
      </span>
    );
  return (
    <span className="inline-flex size-7 items-center justify-center rounded-full bg-surface-2 text-faint">
      <X className="size-4" aria-hidden="true" />
      <span className="sr-only">No</span>
    </span>
  );
}

export function WhyChoose() {
  return (
    <section id="why" aria-labelledby="why-title" className="scroll-mt-20 border-y border-line bg-bg-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="why-title"
          eyebrow="Why EchoGPT"
          title="Stop juggling AI tabs"
          description="Most people bounce between three or four AI apps. EchoGPT puts them in one place and brings them to every page you read."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <ul className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <li key={w.title}>
                <Reveal delay={i * 0.06} className="h-full rounded-2xl border border-line bg-surface p-5">
                  <w.icon className="size-6 text-brand" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold text-fg">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted">{w.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.1} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">EchoGPT compared with single-model AI chat apps</caption>
              <thead>
                <tr className="border-b border-line bg-surface-2/60">
                  <th scope="col" className="px-4 py-3.5 font-semibold text-muted sm:px-5">
                    Capability
                  </th>
                  <th scope="col" className="px-2 py-3.5 text-center font-semibold text-fg">
                    <span className="inline-flex items-center gap-1.5">
                      <LogoMark className="size-5" />
                      <span className="hidden sm:inline">EchoGPT</span>
                    </span>
                  </th>
                  <th scope="col" className="px-2 py-3.5 pr-4 text-center font-semibold text-muted sm:pr-5">
                    Single-model apps
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((r) => (
                  <tr key={r.label} className="border-b border-line last:border-0">
                    <th scope="row" className="px-4 py-3.5 font-medium text-fg sm:px-5">
                      {r.label}
                    </th>
                    <td className="px-2 py-3.5 text-center">
                      <Cell value={r.echo} />
                    </td>
                    <td className="px-2 py-3.5 pr-4 text-center sm:pr-5">
                      <Cell value={r.others} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
