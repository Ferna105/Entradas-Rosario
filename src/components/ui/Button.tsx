"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Icon, IconName } from "./Icon";

type Variant = "primary" | "violet" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  loading?: boolean;
  full?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-yellow-300 text-text-on-yellow border border-yellow-300 font-semibold hover:brightness-110",
  violet:
    "bg-violet-500 text-white border border-violet-500 font-semibold hover:brightness-110",
  secondary:
    "bg-ink-3 text-text-primary border border-ink-4 font-medium hover:brightness-110",
  ghost:
    "bg-transparent text-text-primary border border-transparent font-medium hover:bg-ink-3",
  outline:
    "bg-transparent text-text-primary border border-ink-5 font-medium hover:bg-ink-3",
  danger:
    "bg-danger text-white border border-danger font-semibold hover:brightness-110",
};

const sizeClasses: Record<Size, { container: string; iconSize: number }> = {
  sm: { container: "h-[34px] px-[14px] text-[13px] gap-[6px]", iconSize: 16 },
  md: { container: "h-[42px] px-[18px] text-[14px] gap-[8px]", iconSize: 18 },
  lg: { container: "h-[52px] px-[24px] text-[16px] gap-[10px]", iconSize: 20 },
  xl: { container: "h-[60px] px-[32px] text-[17px] gap-[12px]", iconSize: 22 },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      icon,
      iconRight,
      loading = false,
      full = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const { container, iconSize } = sizeClasses[size];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center rounded-full",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-1",
          "disabled:pointer-events-none disabled:opacity-40",
          "hover:-translate-y-px",
          variantClasses[variant],
          container,
          full ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading ? (
          <span
            className="animate-spin rounded-full border-2 border-current border-r-transparent"
            style={{ width: iconSize, height: iconSize }}
          />
        ) : (
          icon && <Icon name={icon} size={iconSize} />
        )}
        {children && <span>{children}</span>}
        {!loading && iconRight && <Icon name={iconRight} size={iconSize} />}
      </button>
    );
  }
);

Button.displayName = "Button";
