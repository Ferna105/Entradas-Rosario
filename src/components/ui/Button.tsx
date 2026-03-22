import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-violet-600 text-white hover:bg-violet-500 focus-visible:ring-violet-400 shadow-sm shadow-violet-900/30",
  ghost:
    "bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white focus-visible:ring-zinc-500 border border-white/10",
  danger:
    "bg-red-600/90 text-white hover:bg-red-500 focus-visible:ring-red-400",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", disabled, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={[
        "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        "disabled:pointer-events-none disabled:opacity-45",
        variantClasses[variant],
        className,
      ].join(" ")}
      {...props}
    />
  )
);

Button.displayName = "Button";
