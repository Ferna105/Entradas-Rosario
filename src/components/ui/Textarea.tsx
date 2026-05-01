"use client";

import { TextareaHTMLAttributes, forwardRef, useState } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, wrapperClassName = "", className = "", ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const textarea = (
      <textarea
        ref={ref}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className={[
          "w-full rounded-[12px] border bg-ink-2 px-[14px] py-[12px]",
          "text-[15px] text-text-primary placeholder:text-text-tertiary",
          "outline-none resize-vertical transition-all duration-[180ms]",
          error
            ? "border-danger"
            : focused
              ? "border-violet-400 shadow-[0_0_0_3px_rgba(139,92,255,0.15)]"
              : "border-ink-4",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );

    if (!label && !hint && !error) return textarea;

    return (
      <div className={["flex flex-col gap-[6px] w-full", wrapperClassName].filter(Boolean).join(" ")}>
        {label && (
          <span className="text-[13px] font-medium text-text-secondary">{label}</span>
        )}
        {textarea}
        {error && <span className="text-[12px] text-danger">{error}</span>}
        {hint && !error && <span className="text-[12px] text-text-tertiary">{hint}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
