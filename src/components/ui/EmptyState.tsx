import { Icon, IconName } from "./Icon";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = "sparkle",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center gap-4 rounded-[16px] border border-ink-4 bg-ink-2 py-12 px-6 text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-3 text-text-tertiary">
        <Icon name={icon} size={24} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[16px] font-semibold text-text-primary">{title}</p>
        {description && (
          <p className="max-w-[320px] text-[14px] text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
