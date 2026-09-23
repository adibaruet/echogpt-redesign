import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/cn";
import { getModel, type ModelId } from "@/lib/models";

/** Monogram avatar for a model. EchoGPT uses the real brand mark. */
export function ModelAvatar({ id, size = "md", className }: { id: ModelId; size?: "sm" | "md" | "lg"; className?: string }) {
  const m = getModel(id);
  const dims = { sm: "size-5 text-[0.6rem] rounded-md", md: "size-7 text-xs rounded-lg", lg: "size-10 text-sm rounded-xl" }[size];
  if (m.id === "echogpt") return <LogoMark className={cn(dims, className)} />;
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center font-bold text-white", dims, className)}
      style={{ background: `linear-gradient(135deg, ${m.color}, color-mix(in oklab, ${m.color} 70%, black))` }}
    >
      {m.monogram}
    </span>
  );
}
