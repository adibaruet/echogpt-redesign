import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Providers } from "@/components/providers";
import { themeInitScript } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL("https://echogpt.live"),
  title: {
    default: "EchoGPT: Every top AI model in one place",
    template: "%s · EchoGPT",
  },
  description:
    "Chat with multiple AI models side by side, summarize any webpage and get writing help without leaving your tab. On the web and in Chrome.",
  keywords: ["EchoGPT", "AI chat", "multi-model AI", "Chrome extension", "summarize webpage", "AI assistant"],
  authors: [{ name: "AppifyDevs" }],
  openGraph: {
    title: "EchoGPT: Every top AI model in one place",
    description: "Chat, compare and summarize with multiple AI models, on the web and in your browser sidebar.",
    type: "website",
    siteName: "EchoGPT",
  },
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a10" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/* Runs before first paint so the correct theme is applied with no flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-fg"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
