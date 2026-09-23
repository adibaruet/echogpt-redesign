"use client";

import Link from "next/link";
import {
  Briefcase,
  ChevronDown,
  Clapperboard,
  GitCompareArrows,
  ImageIcon,
  LayoutGrid,
  MessageSquare,
  PanelLeftClose,
  Pencil,
  Pin,
  PinOff,
  Plug,
  Search,
  Settings,
  Sparkles,
  SquarePen,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Avatar, Badge, Kbd } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { groupByDate } from "@/lib/chat/store";
import type { Conversation } from "@/lib/chat/types";

export const EXPLORE = [
  { label: "Image Studio", icon: ImageIcon, pro: true },
  { label: "Video Studio", icon: Clapperboard, pro: true },
  { label: "Compare", icon: GitCompareArrows },
  { label: "Connectors", icon: Plug },
  { label: "Store", icon: Store },
  { label: "AI Tasks", icon: LayoutGrid },
  { label: "AI Job Analysis", icon: Briefcase },
] as const;

type Props = {
  conversations: Conversation[];
  hydrated: boolean;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onExplore: (label: string) => void;
  onOpenSettings: () => void;
  onCollapse: () => void;
  /** Mobile drawer mode shows a close button instead of collapse */
  mobile?: boolean;
  modKey: string;
};

function ChatItem({
  c,
  active,
  onSelect,
  onDelete,
  onTogglePin,
  onRename,
}: {
  c: Conversation;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onRename: (t: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(c.title);

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onRename(draft.trim() || c.title);
          setEditing(false);
        }}
        className="px-1"
      >
        <label className="sr-only" htmlFor={`rename-${c.id}`}>
          Rename chat
        </label>
        <input
          id={`rename-${c.id}`}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onRename(draft.trim() || c.title);
            setEditing(false);
          }}
          onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
          className="h-9 w-full rounded-lg border border-brand bg-surface px-2.5 text-sm text-fg focus:outline-none"
        />
      </form>
    );
  }

  return (
    <div
      className={cn(
        "group/item relative flex items-center rounded-lg transition-colors",
        active ? "bg-brand-soft text-brand-soft-fg" : "text-fg/85 hover:bg-surface-2",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "page" : undefined}
        className={cn("min-w-0 flex-1 truncate py-2 pl-3 pr-2 text-left text-sm font-medium", active && "pr-24")}
        title={c.title}
      >
        {c.title}
      </button>
      <div
        className={cn(
          "absolute inset-y-0 right-0 items-center rounded-r-lg pl-3 pr-1",
          active
            ? "flex bg-brand-soft"
            : "hidden bg-gradient-to-r from-transparent via-surface-2 via-30% to-surface-2 lg:group-hover/item:flex lg:group-focus-within/item:flex",
        )}
      >
        <IconButton size="sm" label={c.pinned ? "Unpin" : "Pin"} onClick={onTogglePin} className="size-7">
          {c.pinned ? <PinOff /> : <Pin />}
        </IconButton>
        <IconButton
          size="sm"
          label="Rename"
          onClick={() => {
            setDraft(c.title);
            setEditing(true);
          }}
          className="size-7"
        >
          <Pencil />
        </IconButton>
        <IconButton size="sm" label="Delete" onClick={onDelete} className="size-7 hover:text-danger">
          <Trash2 />
        </IconButton>
      </div>
    </div>
  );
}

export function Sidebar(p: Props) {
  const [query, setQuery] = useState("");
  const [exploreOpen, setExploreOpen] = useState(true);
  const [promoHidden, setPromoHidden] = useState(false);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? p.conversations.filter(
          (c) => c.title.toLowerCase().includes(q) || c.messages.some((m) => (m.content ?? "").toLowerCase().includes(q)),
        )
      : p.conversations;
    return groupByDate(list);
  }, [p.conversations, query]);

  return (
    <div className="flex h-full flex-col bg-bg-subtle">
      <div className="flex h-16 shrink-0 items-center justify-between px-4">
        <Logo href="/" />
        {p.mobile ? (
          <IconButton label="Close sidebar" onClick={p.onCollapse}>
            <X />
          </IconButton>
        ) : (
          <IconButton label="Collapse sidebar" onClick={p.onCollapse}>
            <PanelLeftClose />
          </IconButton>
        )}
      </div>

      <div className="space-y-2 px-3">
        <Button onClick={p.onNew} className="w-full justify-between">
          <span className="inline-flex items-center gap-2">
            <SquarePen className="size-4" aria-hidden="true" /> New chat
          </span>
          <span className="hidden items-center gap-0.5 text-xs font-medium text-white/70 lg:inline-flex">
            {p.modKey} ⇧ O
          </span>
        </Button>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
          <label htmlFor="chat-search" className="sr-only">
            Search chats
          </label>
          <input
            id="chat-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-faint focus:border-brand/60 focus:outline-none"
          />
        </div>
      </div>

      <nav aria-label="Chat history" className="mt-3 min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {!p.hydrated ? (
          <div className="space-y-2 pt-2" aria-hidden="true">
            {[80, 65, 90, 55].map((w) => (
              <div key={w} className="h-8 animate-pulse rounded-lg bg-surface-2" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <MessageSquare className="size-6 text-faint" aria-hidden="true" />
            <p className="text-sm text-muted">{query ? "No chats match your search." : "Your chats will appear here."}</p>
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.label} className="mb-3" aria-label={g.label}>
              <h2 className="px-3 pb-1 pt-2 text-[0.7rem] font-semibold uppercase tracking-wider text-faint">{g.label}</h2>
              <ul className="space-y-0.5">
                {g.items.map((c) => (
                  <li key={c.id}>
                    <ChatItem
                      c={c}
                      active={c.id === p.activeId}
                      onSelect={() => p.onSelect(c.id)}
                      onDelete={() => p.onDelete(c.id)}
                      onTogglePin={() => p.onTogglePin(c.id)}
                      onRename={(t) => p.onRename(c.id, t)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}

        <section className="mt-2 border-t border-line pt-2">
          <h2>
            <button
              type="button"
              aria-expanded={exploreOpen}
              onClick={() => setExploreOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-wider text-faint hover:text-fg"
            >
              Explore
              <ChevronDown className={cn("size-3.5 transition-transform", !exploreOpen && "-rotate-90")} aria-hidden="true" />
            </button>
          </h2>
          {exploreOpen && (
            <ul className="space-y-0.5">
              {EXPLORE.map((e) => (
                <li key={e.label}>
                  <button
                    type="button"
                    onClick={() => p.onExplore(e.label)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-fg/85 hover:bg-surface-2"
                  >
                    <e.icon className="size-4 text-muted" aria-hidden="true" />
                    {e.label}
                    {"pro" in e && e.pro && <Badge className="ml-auto">Pro</Badge>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </nav>

      <div className="shrink-0 space-y-2 border-t border-line p-3">
        {!promoHidden && (
          <div className="relative rounded-xl bg-gradient-to-br from-brand to-[#9b3ce8] p-3.5 text-white">
            <button
              type="button"
              aria-label="Dismiss upgrade offer"
              onClick={() => setPromoHidden(true)}
              className="absolute right-2 top-2 rounded-md p-1 text-white/70 hover:bg-white/15 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Sparkles className="size-4" aria-hidden="true" /> Go Pro
            </p>
            <p className="mt-1 pr-4 text-xs leading-5 text-white/80">All models, Compare mode and Image Studio.</p>
            <Link href="/#pricing" className="mt-2.5 inline-flex h-8 items-center rounded-lg bg-white px-3 text-xs font-bold text-[#4c1fc4] hover:bg-white/90">
              Upgrade
            </Link>
          </div>
        )}
        <button
          type="button"
          onClick={p.onOpenSettings}
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-2"
        >
          <Avatar name="Demo User" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-fg">Demo User</span>
            <span className="block text-xs text-muted">Free plan</span>
          </span>
          <Settings className="size-4 text-faint" aria-hidden="true" />
          <span className="sr-only">Open settings</span>
        </button>
        <p className="hidden items-center justify-center gap-1 text-[0.7rem] text-faint lg:flex">
          <Kbd>{p.modKey}</Kbd>
          <Kbd>K</Kbd> command menu
        </p>
      </div>
    </div>
  );
}
