import { ButtonLink } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <LogoMark className="size-14" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-fg">This page echoed into the void</h1>
      <p className="mt-2 text-muted">We couldn&apos;t find what you were looking for.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/chat" variant="outline">
          Open chat
        </ButtonLink>
      </div>
    </main>
  );
}
