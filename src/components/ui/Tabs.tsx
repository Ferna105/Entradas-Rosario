"use client";

import { Icon, IconName } from "./Icon";

interface TabItem {
  value: string;
  label: string;
  icon?: IconName;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: "underline" | "pills";
  className?: string;
}

export function Tabs({ items, value, onChange, variant = "underline", className = "" }: TabsProps) {
  if (variant === "pills") {
    return (
      <div
        className={[
          "inline-flex rounded-full border border-ink-4 bg-ink-2 p-1",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={[
              "flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-[180ms]",
              value === item.value
                ? "bg-violet-500 text-white"
                : "bg-transparent text-text-secondary hover:text-text-primary",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.icon && <Icon name={item.icon} size={14} />}
            {item.label}
            {item.count !== undefined && (
              <span
                className={[
                  "rounded-full px-[7px] py-[1px] text-[11px]",
                  value === item.value ? "bg-white/20 text-white" : "bg-ink-3 text-text-tertiary",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={[
        "flex gap-1 border-b border-ink-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={[
            "flex items-center gap-2 border-b-2 px-4 py-3 text-[14px] font-medium transition-all duration-[180ms]",
            "-mb-px",
            value === item.value
              ? "border-violet-400 text-text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {item.icon && <Icon name={item.icon} size={16} />}
          {item.label}
          {item.count !== undefined && (
            <span
              className={[
                "rounded-full px-[7px] py-[1px] text-[11px]",
                value === item.value ? "bg-violet-500 text-white" : "bg-ink-3 text-text-tertiary",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
