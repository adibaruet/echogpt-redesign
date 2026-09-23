"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { applyTheme, readThemePreference, saveThemePreference, type ThemePreference } from "@/lib/theme";

const order: ThemePreference[] = ["light", "dark", "system"];
const icons = { light: Sun, dark: Moon, system: Monitor } as const;
const labels = { light: "Light theme", dark: "Dark theme", system: "System theme" } as const;

export function useThemePreference() {
  const [pref, setPref] = useState<ThemePreference>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read the persisted preference once on mount (client only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPref(readThemePreference());
    setMounted(true);
  }, []);

  // Follow OS changes while in "system" mode
  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const update = (p: ThemePreference) => {
    setPref(p);
    saveThemePreference(p);
  };

  return { pref, setPref: update, mounted };
}

/** Compact cycling button: light → dark → system. */
export function ThemeToggle({ className }: { className?: string }) {
  const { pref, setPref, mounted } = useThemePreference();
  const next = order[(order.indexOf(pref) + 1) % order.length];
  const Icon = icons[pref];
  return (
    <button
      type="button"
      onClick={() => setPref(next)}
      aria-label={`${labels[pref]}. Switch to ${labels[next].toLowerCase()}`}
      title={`${labels[pref]} (click for ${labels[next].toLowerCase()})`}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg",
        className,
      )}
    >
      <Icon className={cn("size-[1.15rem] transition-opacity", mounted ? "opacity-100" : "opacity-0")} />
    </button>
  );
}

/** Segmented control version used in settings screens. */
export function ThemeSegmented({ className }: { className?: string }) {
  const { pref, setPref } = useThemePreference();
  return (
    <div role="radiogroup" aria-label="Theme" className={cn("inline-flex rounded-xl bg-surface-2 p-1", className)}>
      {order.map((p) => {
        const Icon = icons[p];
        const active = pref === p;
        return (
          <button
            key={p}
            role="radio"
            aria-checked={active}
            type="button"
            onClick={() => setPref(p)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold capitalize transition-colors",
              active ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {p}
          </button>
        );
      })}
    </div>
  );
}
