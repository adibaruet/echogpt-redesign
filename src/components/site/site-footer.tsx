import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { CHROME_STORE_URL } from "@/lib/content";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Web app", href: "/chat" },
      { label: "Chrome extension", href: "/extension" },
      { label: "Models", href: "/#models" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Support", href: "https://echogpt.live/support", external: true },
      { label: "Chrome Web Store", href: CHROME_STORE_URL, external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "AppifyDevs", href: "https://echogpt.live", external: true },
      { label: "Privacy policy", href: "https://echogpt.live/privacy-policy", external: true },
      { label: "Terms of use", href: "https://echogpt.live", external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg-subtle">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-6 text-muted">
            Every top AI model in one calm workspace. On the web and right inside your browser.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h3 className="text-sm font-semibold text-fg">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  {"external" in l && l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-fg">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-muted hover:text-fg">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} EchoGPT by AppifyDevs. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
}
