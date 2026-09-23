import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "neutral" | "success" | "accent";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-soft text-brand-soft-fg",
    neutral: "bg-surface-2 text-muted",
    success: "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success",
    accent: "bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-accent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-line bg-surface px-1 font-sans text-[0.68rem] font-semibold text-faint",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f59e0b] to-[#e8467c] text-xs font-bold text-white",
        className,
      )}
    >
      {initials}
    </span>
  );
}
