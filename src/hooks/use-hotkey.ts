import { useEffect, useRef } from "react";

type Combo = { key: string; mod?: boolean; shift?: boolean };

/** Registers a global shortcut. `mod` = Cmd on macOS, Ctrl elsewhere. */
export function useHotkey(combo: Combo, handler: (e: KeyboardEvent) => void, enabled = true) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (e.key.toLowerCase() !== combo.key.toLowerCase()) return;
      if (!!combo.mod !== mod || !!combo.shift !== e.shiftKey) return;
      ref.current(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [combo.key, combo.mod, combo.shift, enabled]);
}

export function useIsMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}
