import { Icon } from "./Icon";

interface StepperProps {
  steps: string[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className = "" }: StepperProps) {
  return (
    <div
      className={[
        "flex items-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-[13px] font-semibold transition-all",
                  done
                    ? "border-violet-500 bg-violet-500 text-white"
                    : active
                      ? "border-violet-400 bg-ink-3 text-violet-300"
                      : "border-ink-4 bg-ink-2 text-text-tertiary",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {done ? <Icon name="check" size={14} strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={[
                  "hidden text-[11px] font-medium sm:block",
                  active ? "text-text-primary" : "text-text-tertiary",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={[
                  "mx-2 h-[2px] flex-1 rounded transition-all",
                  done ? "bg-violet-500" : "bg-ink-4",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
