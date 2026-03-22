import { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/[0.08] bg-zinc-900/80 shadow-lg shadow-black/20 backdrop-blur-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
