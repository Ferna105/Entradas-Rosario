import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, action, children, className = "" }: FormSectionProps) {
  return (
    <div className={["flex flex-col gap-[14px]", className].filter(Boolean).join(" ")}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[0.1em] text-text-tertiary uppercase">
          {title}
        </span>
        {action}
      </div>
      {children}
    </div>
  );
}
