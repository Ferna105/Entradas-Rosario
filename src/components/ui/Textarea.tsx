import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={[
      "w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-base text-zinc-100",
      "placeholder:text-zinc-500",
      "focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30",
      "resize-none",
      className,
    ].join(" ")}
    {...props}
  />
));

Textarea.displayName = "Textarea";
