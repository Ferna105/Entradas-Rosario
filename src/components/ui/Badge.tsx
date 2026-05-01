import { Icon, IconName } from "./Icon";

type Tone = "neutral" | "violet" | "yellow" | "success" | "danger" | "warning" | "info" | "solid";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children?: React.ReactNode;
  tone?: Tone;
  size?: BadgeSize;
  dot?: boolean;
  icon?: IconName;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  neutral: "bg-ink-3 text-text-secondary border-ink-4",
  violet:  "bg-[rgba(139,92,255,0.15)] text-violet-300 border-[rgba(139,92,255,0.3)]",
  yellow:  "bg-[rgba(255,217,31,0.12)] text-yellow-300 border-[rgba(255,217,31,0.3)]",
  success: "bg-[rgba(34,201,140,0.15)] text-success border-[rgba(34,201,140,0.3)]",
  danger:  "bg-[rgba(255,84,112,0.12)] text-danger border-[rgba(255,84,112,0.3)]",
  warning: "bg-[rgba(255,181,71,0.12)] text-warning border-[rgba(255,181,71,0.3)]",
  info:    "bg-[rgba(77,171,255,0.12)] text-info border-[rgba(77,171,255,0.3)]",
  solid:   "bg-yellow-300 text-text-on-yellow border-yellow-300",
};

const sizeClasses: Record<BadgeSize, { container: string; iconSize: number }> = {
  sm: { container: "h-[20px] px-[8px] py-[3px] text-[11px]",  iconSize: 10 },
  md: { container: "h-[24px] px-[10px] py-[4px] text-[12px]", iconSize: 12 },
  lg: { container: "h-[28px] px-[12px] py-[6px] text-[13px]", iconSize: 13 },
};

export function Badge({
  children,
  tone = "neutral",
  size = "md",
  dot = false,
  icon,
  className = "",
}: BadgeProps) {
  const { container, iconSize } = sizeClasses[size];
  return (
    <span
      className={[
        "inline-flex items-center gap-[6px] rounded-full border font-medium tracking-[0.02em]",
        toneClasses[tone],
        container,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-current" />
      )}
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
    </span>
  );
}
