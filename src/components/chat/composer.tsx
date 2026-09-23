"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, FileText, Mic, Paperclip, Square, X } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import { IconButton } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { cn } from "@/lib/cn";
import type { Attachment } from "@/lib/chat/types";

export type ComposerHandle = { focus: () => void; setText: (t: string) => void };

type Props = {
  onSubmit: (text: string, attachments: Attachment[]) => void;
  onStop: () => void;
  streaming: boolean;
  placeholder?: string;
  /** Slot rendered on the left of the toolbar (e.g. compare toggle) */
  toolbar?: ReactNode;
  className?: string;
};

const MAX = 4000;

function formatSize(n: number) {
  return n > 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1000))} KB`;
}

export const Composer = forwardRef<ComposerHandle, Props>(function Composer(
  { onSubmit, onStop, streaming, placeholder = "Ask anything…", toolbar, className },
  ref,
) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const ta = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const speech = useSpeech((t) => setText((prev) => (prev ? prev.trimEnd() + " " : "") + t));

  useImperativeHandle(ref, () => ({
    focus: () => ta.current?.focus(),
    setText: (t: string) => {
      setText(t);
      requestAnimationFrame(() => {
        ta.current?.focus();
        ta.current?.setSelectionRange(t.length, t.length);
      });
    },
  }));

  // Auto-grow
  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [text]);

  const canSend = (text.trim().length > 0 || files.length > 0) && !streaming && text.length <= MAX;

  const submit = () => {
    if (!canSend) return;
    onSubmit(text.trim(), files);
    setText("");
    setFiles([]);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "rounded-3xl border border-line bg-surface shadow-soft transition-[border-color,box-shadow] focus-within:border-brand/60 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_14%,transparent)]",
        )}
      >
        <AnimatePresence initial={false}>
          {files.length > 0 && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap gap-2 overflow-hidden px-3 pt-3"
              aria-label="Attachments"
            >
              {files.map((f, i) => (
                <li key={f.name + i} className="flex items-center gap-2 rounded-xl border border-line bg-surface-2 py-1.5 pl-2 pr-1 text-xs">
                  <FileText className="size-4 text-brand" aria-hidden="true" />
                  <span className="max-w-[10rem] truncate font-medium text-fg">{f.name}</span>
                  <span className="text-faint">{formatSize(f.size)}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}
                    className="rounded-md p-0.5 text-faint hover:bg-surface-3 hover:text-fg"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <label htmlFor="composer-input" className="sr-only">
          Message EchoGPT
        </label>
        <textarea
          id="composer-input"
          ref={ta}
          rows={1}
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          className="block max-h-[220px] w-full resize-none bg-transparent px-4 pt-4 pb-2 text-[0.98rem] leading-6 text-fg placeholder:text-faint focus:outline-none focus-visible:outline-none"
        />

        <div className="flex items-center gap-1 px-2 pb-2">
          <input
            ref={fileInput}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const list = Array.from(e.target.files ?? []).map((f) => ({ name: f.name, size: f.size, type: f.type }));
              setFiles((fs) => [...fs, ...list].slice(0, 5));
              e.target.value = "";
            }}
          />
          <IconButton label="Attach files" onClick={() => fileInput.current?.click()}>
            <Paperclip />
          </IconButton>
          {toolbar}
          <div className="ml-auto flex items-center gap-1.5">
            {text.length > MAX * 0.8 && (
              <span className={cn("text-xs tabular-nums", text.length > MAX ? "text-danger" : "text-faint")}>
                {text.length}/{MAX}
              </span>
            )}
            {speech.supported && (
              <IconButton
                label={speech.listening ? "Stop voice input" : "Voice input"}
                onClick={speech.toggle}
                active={speech.listening}
                className={cn(speech.listening && "animate-pulse")}
              >
                <Mic />
              </IconButton>
            )}
            {streaming ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                title="Stop generating"
                className="inline-flex size-10 items-center justify-center rounded-full bg-fg text-bg transition-transform active:scale-95"
              >
                <Square className="size-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                aria-label="Send message"
                title="Send (Enter)"
                className="inline-flex size-10 items-center justify-center rounded-full bg-brand text-white transition-[background-color,transform,opacity] hover:bg-brand-hover active:scale-95 disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-faint"
              >
                <ArrowUp className="size-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="mt-2 hidden text-center text-xs text-faint sm:block">
        <kbd className="font-sans font-semibold">Enter</kbd> to send · <kbd className="font-sans font-semibold">Shift + Enter</kbd> for a new line · AI can make mistakes, check important info.
      </p>
    </div>
  );
});
