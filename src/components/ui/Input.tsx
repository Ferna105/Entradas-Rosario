"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Icon, IconName } from "./Icon";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName;
  suffix?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, suffix, wrapperClassName = "", className = "", ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const input = (
      <div
        className={[
          "flex h-[46px] items-center gap-[10px] rounded-[12px] border px-[14px]",
          "bg-ink-2 transition-all duration-[180ms]",
          error
            ? "border-danger"
            : focused
              ? "border-violet-400 shadow-[0_0_0_3px_rgba(139,92,255,0.15)]"
              : "border-ink-4",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon && <Icon name={icon} size={18} className="text-text-tertiary shrink-0" />}
        <input
          ref={ref}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={[
            "flex-1 border-none bg-transparent text-[15px] text-text-primary outline-none",
            "placeholder:text-text-tertiary",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {suffix && (
          <span className="shrink-0 text-[13px] text-text-tertiary">{suffix}</span>
        )}
      </div>
    );

    if (!label && !hint && !error) return input;

    return (
      <div className={["flex flex-col gap-[6px] w-full", wrapperClassName].filter(Boolean).join(" ")}>
        {label && (
          <span className="text-[13px] font-medium text-text-secondary">{label}</span>
        )}
        {input}
        {error && (
          <span className="text-[12px] text-danger">{error}</span>
        )}
        {hint && !error && (
          <span className="text-[12px] text-text-tertiary">{hint}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
