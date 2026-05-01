"use client";

import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { Icon } from "./Icon";

type ToastTone = "success" | "danger" | "warning" | "info";

interface ToastData {
  id: string;
  tone: ToastTone;
  title: string;
  message?: string;
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastData, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneConfig: Record<ToastTone, { color: string; bg: string; border: string; icon: "check" | "close" | "bell" }> = {
  success: { color: "text-success", bg: "bg-success-bg", border: "border-l-[3px] border-l-success", icon: "check" },
  danger:  { color: "text-danger",  bg: "bg-danger-bg",  border: "border-l-[3px] border-l-danger",  icon: "close" },
  warning: { color: "text-warning", bg: "bg-warning-bg", border: "border-l-[3px] border-l-warning", icon: "bell" },
  info:    { color: "text-info",    bg: "bg-info-bg",    border: "border-l-[3px] border-l-info",    icon: "bell" },
};

function ToastItem({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  const { color, bg, border, icon } = toneConfig[toast.tone];

  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={[
        "flex min-w-[320px] max-w-[400px] gap-3 rounded-[12px] border border-ink-4 p-[14px]",
        "shadow-lg bg-ink-2",
        border,
        "animate-in slide-in-from-right-4 fade-in duration-200",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]",
          bg, color,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Icon name={icon} size={16} strokeWidth={2} />
      </div>
      <div className="flex flex-1 flex-col gap-[2px]">
        <div className="text-[14px] font-semibold text-text-primary">{toast.title}</div>
        {toast.message && (
          <div className="text-[13px] text-text-secondary">{toast.message}</div>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-text-tertiary hover:text-text-secondary p-1"
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((data: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...data, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-[200] flex flex-col gap-2">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
