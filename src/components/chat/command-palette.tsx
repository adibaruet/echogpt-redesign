"use client";

import { CornerDownLeft, MessageSquare, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";

export type Command = {
  id: string;
  label: string;
  group: string;
  icon?: ReactNode;
  hint?: string;
  run: () => void;
};

export function CommandPalette({ open, onClose, commands }: { open: boolean; onClose: () => void; commands: Command[] }) {
  return (
    <Dialog open={open} onClose={onClose} title="Command menu" hideTitle position="top" className="max-w-xl">
      {open && <PaletteBody onClose={onClose} commands={commands} />}
    </Dialog>
  );
}

function PaletteBody({ onClose, commands }: { onClose: () => void; commands: Command[] }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? commands.filter((c) => c.label.toLowerCase().includes(s) || c.group.toLowerCase().includes(s)) : commands;
  }, [q, commands]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    onClose();
    // Let the dialog close (and restore focus) before running
    setTimeout(c.run, 10);
  };

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-4 text-faint" aria-hidden="true" />
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              run(filtered[active]);
            }
          }}
          role="combobox"
          aria-expanded="true"
          aria-controls="cmd-list"
          aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
          aria-label="Search commands and chats"
          placeholder="Search chats, switch model, change theme…"
          className="h-14 flex-1 bg-transparent text-[0.95rem] text-fg placeholder:text-faint focus:outline-none focus-visible:outline-none"
        />
      </div>
      <ul id="cmd-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
        {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No results for “{q}”</li>}
        {filtered.map((c, i) => {
          const header = i === 0 || filtered[i - 1].group !== c.group ? c.group : null;
          return (
            <li key={c.id} role="presentation">
              {header && <p className="px-3 pb-1 pt-3 text-[0.7rem] font-semibold uppercase tracking-wider text-faint">{header}</p>}
              <div
                id={`cmd-${c.id}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => run(c)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg",
                  i === active && "bg-surface-2",
                )}
              >
                <span className="flex size-6 items-center justify-center text-muted [&_svg]:size-4">{c.icon ?? <MessageSquare />}</span>
                <span className="flex-1 truncate">{c.label}</span>
                {c.hint && <span className="text-xs text-faint">{c.hint}</span>}
                {i === active && <CornerDownLeft className="size-3.5 text-faint" aria-hidden="true" />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
