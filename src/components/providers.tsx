"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** App-wide client providers. Framer Motion respects the OS "reduce motion" setting. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
