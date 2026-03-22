import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={[
        "min-h-[44px] w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-base text-zinc-100",
        "placeholder:text-zinc-500",
        "focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30",
        className,
      ].join(" ")}
      {...props}
    />
  )
);

Input.displayName = "Input";
