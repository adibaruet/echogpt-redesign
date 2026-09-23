"use client";

import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/cn";

/** EchoGPT mark: a speech bubble emitting echo waves. Pure SVG, scales crisply. */
export function LogoMark({ className }: { className?: string }) {
  // Unique gradient id per instance: a shared id breaks when the first copy sits in a display:none subtree
  const gid = useId();
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C4DFF" />
          <stop offset="1" stopColor="#5B21D6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />
      <path
        d="M14 12h8a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5h-5l-4.5 3.5V25.6A5 5 0 0 1 9 21v-4a5 5 0 0 1 5-5Z"
        fill="#fff"
      />
      <path d="M30.5 15.5c1.4 2.6 1.4 6.4 0 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".9" />
      <path d="M33.8 13c2.2 4.1 2.2 9.9 0 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".55" />
      <circle cx="15.5" cy="19" r="1.4" fill="#6A3DE8" />
      <circle cx="20.5" cy="19" r="1.4" fill="#6A3DE8" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 font-bold tracking-tight text-fg", className)}
      aria-label="EchoGPT home"
    >
      <LogoMark />
      <span className="text-[1.15rem]">
        Echo<span className="text-brand">GPT</span>
      </span>
    </Link>
  );
}
