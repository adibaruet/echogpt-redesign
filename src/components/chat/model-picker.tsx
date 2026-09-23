"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useId, useRef, useState, type KeyboardEvent } from "react";
import { ModelAvatar } from "@/components/ui/model-avatar";
import { Badge } from "@/components/ui/primitives";
import { useDismiss } from "@/hooks/use-click-outside";
import { cn } from "@/lib/cn";
import { getModel, MODELS, type ModelId } from "@/lib/models";

type Props = {
  value: ModelId;
  onChange: (id: ModelId) => void;
  /** Hide a model (e.g. the one already chosen on the other side of Compare) */
  exclude?: ModelId;
  size?: "sm" | "md";
  align?: "left" | "right";
  label?: string;
  className?: string;
};

/** Accessible listbox-style model selector with keyboard navigation. */
export function ModelPicker({ value, onChange, exclude, size = "md", align = "left", label = "Choose model", className }: Props) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const current = getModel(value);
  const options = MODELS.filter((m) => m.id !== exclude);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(wrap, open, close);

  const focusOption = (idx: number) => {
    const items = listRef.current?.querySelectorAll<HTMLButtonElement>("[role=option]");
    if (!items?.length) return;
    items[(idx + items.length) % items.length].focus();
  };

  const onListKey = (e: KeyboardEvent) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("[role=option]") ?? []);
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusOption(i + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusOption(i - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusOption(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusOption(-1);
    } else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${current.name}`}
        onClick={() => {
          setOpen((o) => !o);
          requestAnimationFrame(() => focusOption(Math.max(0, options.findIndex((m) => m.id === value))));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => focusOption(0));
          }
        }}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl font-semibold text-fg transition-colors hover:bg-surface-2",
          size === "md" ? "h-10 px-2.5 text-[0.95rem]" : "h-8 px-2 text-sm",
          open && "bg-surface-2",
        )}
      >
        <ModelAvatar id={current.id} size={size === "md" ? "md" : "sm"} />
        <span className="truncate">{current.name}</span>
        <ChevronDown className={cn("size-4 text-faint transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className={cn(
              "absolute top-full z-50 mt-2 max-h-[70vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-lift",
              align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            )}
          >
            {options.map((m) => {
              const selected = m.id === value;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(m.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl p-2.5 text-left outline-none transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none",
                      selected && "bg-brand-soft/60",
                    )}
                  >
                    <ModelAvatar id={m.id} size="md" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-fg">
                        {m.name}
                        {m.tier === "pro" && <Badge>Pro</Badge>}
                      </span>
                      <span className="block text-xs leading-5 text-muted">{m.blurb}</span>
                    </span>
                    {selected && <Check className="size-4 shrink-0 text-brand" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
