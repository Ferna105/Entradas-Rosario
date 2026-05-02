type KPITone = "success" | "violet" | "yellow" | "neutral";

interface MiniKPIProps {
  label: string;
  value: string;
  tone?: KPITone;
  className?: string;
}

const toneColor: Record<KPITone, string> = {
  success: "text-success",
  violet:  "text-violet-300",
  yellow:  "text-yellow-300",
  neutral: "text-text-primary",
};

export function MiniKPI({ label, value, tone = "neutral", className = "" }: MiniKPIProps) {
  return (
    <div
      className={[
        "rounded-[14px] border border-ink-4 bg-ink-2 p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="text-[11px] tracking-[0.06em] text-text-tertiary">{label}</div>
      <div
        className={[
          "mt-[6px] font-mono text-[22px] font-bold tracking-snug",
          toneColor[tone],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {value}
      </div>
    </div>
  );
}
