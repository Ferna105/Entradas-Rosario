import { LabelHTMLAttributes } from "react";

export function Label({
  className = "",
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={["block text-sm font-medium text-zinc-300", className].join(" ")}
      {...props}
    >
      {children}
    </label>
  );
}
