"use client";

import { motion } from "framer-motion";
import { Check, Copy, FileText, RefreshCw, ThumbsDown, ThumbsUp, Trophy } from "lucide-react";
import { memo, useState } from "react";
import { IconButton } from "@/components/ui/button";
import { ModelAvatar } from "@/components/ui/model-avatar";
import { cn } from "@/lib/cn";
import type { Message, Variant } from "@/lib/chat/types";
import { getModel } from "@/lib/models";
import { Markdown } from "./markdown";

function Typing() {
  return (
    <span className="inline-flex items-center gap-1 py-2" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-brand"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <IconButton
      size="sm"
      label={copied ? "Copied" : "Copy"}
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check /> : <Copy />}
    </IconButton>
  );
}

function VariantView({
  v,
  compact,
  showHeader,
  onPrefer,
}: {
  v: Variant;
  compact: boolean;
  showHeader: boolean;
  onPrefer?: () => void;
}) {
  const m = getModel(v.model);
  return (
    <div className={cn("min-w-0", compact && "rounded-2xl border border-line bg-surface p-4")}>
      {showHeader && (
        <div className="mb-2 flex items-center gap-2">
          <ModelAvatar id={v.model} size="sm" />
          <span className="text-sm font-semibold text-fg">{m.name}</span>
          {v.status === "stopped" && <span className="text-xs text-faint">· stopped</span>}
          {compact && onPrefer && v.status === "done" && (
            <button
              type="button"
              onClick={onPrefer}
              className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-muted hover:bg-surface-2 hover:text-fg"
            >
              <Trophy className="size-3.5" aria-hidden="true" /> Prefer this
            </button>
          )}
        </div>
      )}
      {v.content ? (
        <div aria-live={v.status === "streaming" ? "polite" : undefined}>
          <Markdown text={v.content} />
          {v.status === "streaming" && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-brand" aria-hidden="true" />}
        </div>
      ) : v.status === "streaming" ? (
        <Typing />
      ) : (
        <p className="text-sm italic text-faint">Stopped before responding.</p>
      )}
    </div>
  );
}

type Props = {
  message: Message;
  isLast: boolean;
  onRegenerate: () => void;
  onFeedback: (v: Message["feedback"]) => void;
  onPrefer: (model: Variant["model"]) => void;
};

export const ChatMessage = memo(function ChatMessage({ message, isLast, onRegenerate, onFeedback, onPrefer }: Props) {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-end gap-2"
      >
        {message.attachments?.length ? (
          <ul className="flex flex-wrap justify-end gap-2">
            {message.attachments.map((a) => (
              <li key={a.name} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-medium text-fg">
                <FileText className="size-4 text-brand" aria-hidden="true" />
                {a.name}
              </li>
            ))}
          </ul>
        ) : null}
        {message.content && (
          <div className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-lg bg-brand px-4 py-2.5 text-[0.95rem] leading-6 text-white sm:max-w-[75%]">
            {message.content}
          </div>
        )}
      </motion.div>
    );
  }

  const variants = message.variants ?? [];
  const compare = variants.length > 1;
  const streaming = variants.some((v) => v.status === "streaming");
  const allText = variants.map((v) => (compare ? `${getModel(v.model).name}:\n${v.content}` : v.content)).join("\n\n");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
      {compare ? (
        <div className="grid gap-3 md:grid-cols-2">
          {variants.map((v) => (
            <VariantView key={v.model} v={v} compact showHeader onPrefer={() => onPrefer(v.model)} />
          ))}
        </div>
      ) : (
        variants.map((v) => <VariantView key={v.model} v={v} compact={false} showHeader />)
      )}

      {!streaming && (
        <div
          className={cn(
            "mt-2 flex items-center gap-0.5 transition-opacity",
            isLast ? "opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100",
          )}
        >
          <CopyButton text={allText} />
          <IconButton size="sm" label="Good response" active={message.feedback === "up"} onClick={() => onFeedback(message.feedback === "up" ? undefined : "up")}>
            <ThumbsUp />
          </IconButton>
          <IconButton size="sm" label="Bad response" active={message.feedback === "down"} onClick={() => onFeedback(message.feedback === "down" ? undefined : "down")}>
            <ThumbsDown />
          </IconButton>
          {isLast && (
            <IconButton size="sm" label="Regenerate" onClick={onRegenerate}>
              <RefreshCw />
            </IconButton>
          )}
        </div>
      )}
    </motion.div>
  );
});
