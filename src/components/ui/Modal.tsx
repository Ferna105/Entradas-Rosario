"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[560px]",
  lg: "max-w-[800px]",
};

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={[
          "relative z-10 w-full rounded-[20px] border border-ink-4 bg-ink-2 shadow-xl",
          sizeClasses[size],
          "animate-in zoom-in-95 fade-in duration-200",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {(title || true) && (
          <div className="flex items-center justify-between border-b border-ink-4 px-6 py-4">
            {title && (
              <h2 className="text-[18px] font-semibold tracking-tight text-text-primary">
                {title}
              </h2>
            )}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto text-text-tertiary hover:text-text-primary transition-colors"
              aria-label="Cerrar"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
