import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  width?: string | number;
  rounded?: boolean;
}

export function Skeleton({
  className = "",
  height,
  width,
  rounded = false,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={[
        "animate-pulse bg-ink-3",
        rounded ? "rounded-full" : "rounded-[8px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        width: typeof width === "number" ? `${width}px` : width,
        ...style,
      }}
      {...props}
    />
  );
}
