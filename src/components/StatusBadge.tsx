import { cn } from "@/lib/utils";
import { statusTone } from "@/lib/status";

const toneClass: Record<string, string> = {
  success: "bg-[oklch(0.95_0.05_155)] text-[oklch(0.35_0.12_155)] ring-1 ring-inset ring-[oklch(0.65_0.16_155)]/30",
  info: "bg-[oklch(0.96_0.04_240)] text-[oklch(0.32_0.12_245)] ring-1 ring-inset ring-[oklch(0.7_0.18_240)]/30",
  warn: "bg-[oklch(0.97_0.06_75)] text-[oklch(0.42_0.14_60)] ring-1 ring-inset ring-[oklch(0.78_0.16_75)]/30",
  danger: "bg-[oklch(0.96_0.06_25)] text-[oklch(0.42_0.18_25)] ring-1 ring-inset ring-[oklch(0.6_0.22_27)]/30",
  muted: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  const tone = statusTone[value] ?? "muted";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full",
        tone === "success" && "bg-[oklch(0.6_0.18_155)]",
        tone === "info" && "bg-[oklch(0.55_0.18_240)]",
        tone === "warn" && "bg-[oklch(0.7_0.18_70)]",
        tone === "danger" && "bg-[oklch(0.6_0.22_27)]",
        tone === "muted" && "bg-muted-foreground/50",
      )} />
      {value}
    </span>
  );
}