"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, IconName } from "@/components/ui";
import {
  notificationsService,
  Notification,
  NotificationType,
} from "@/services/notifications";

const POLL_MS = 60_000;

interface Props {
  className?: string;
}

const TYPE_ICON: Record<NotificationType, IconName> = {
  purchase_approved: "ticket",
  purchase_rejected: "info",
  new_sale: "ticket",
  scanner_accepted: "qr",
  event_published: "calendar",
};

const TYPE_TONE: Record<NotificationType, string> = {
  purchase_approved: "text-success",
  purchase_rejected: "text-danger",
  new_sale: "text-yellow-300",
  scanner_accepted: "text-violet-300",
  event_published: "text-violet-300",
};

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "hace un momento";
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}

function destinationFor(n: Notification): string | null {
  const data = n.data || {};
  const eventId = typeof data.event_id === "number" ? data.event_id : null;
  switch (n.type) {
    case "purchase_approved":
    case "purchase_rejected":
      return "/mis-entradas";
    case "new_sale":
    case "scanner_accepted":
      return "/dashboard";
    case "event_published":
      return eventId ? `/eventos/${eventId}` : null;
    default:
      return null;
  }
}

export default function NotificationsBell({ className }: Props) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Notification[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const refreshCount = useCallback(async () => {
    try {
      const c = await notificationsService.unreadCount();
      setCount(c);
    } catch {
      // ignored — sin sesión válida o back caído
    }
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const list = await notificationsService.list(20);
      setItems(list);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCount();
    const onFocus = () => void refreshCount();
    const id = window.setInterval(() => void refreshCount(), POLL_MS);
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshCount]);

  useEffect(() => {
    if (!open) return;
    void loadList();
  }, [open, loadList]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const handleItemClick = async (n: Notification) => {
    setOpen(false);
    if (!n.read_at) {
      setItems((prev) =>
        prev
          ? prev.map((i) =>
              i.id === n.id ? { ...i, read_at: new Date().toISOString() } : i
            )
          : prev
      );
      setCount((c) => Math.max(0, c - 1));
      try {
        await notificationsService.markRead(n.id);
      } catch {
        // ignored
      }
    }
    const dest = destinationFor(n);
    if (dest) router.push(dest);
  };

  const handleMarkAll = async () => {
    if (count === 0) return;
    const now = new Date().toISOString();
    setItems((prev) =>
      prev ? prev.map((i) => ({ ...i, read_at: i.read_at ?? now })) : prev
    );
    setCount(0);
    try {
      await notificationsService.markAllRead();
    } catch {
      void refreshCount();
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-[38px] w-[38px] items-center justify-center rounded-full border border-ink-4 bg-ink-3 text-text-secondary transition-colors hover:text-text-primary"
        aria-label="Notificaciones"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon name="bell" size={16} />
        {count > 0 && (
          <span className="absolute -right-[3px] -top-[3px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-ink-1 bg-yellow-300 px-[5px] text-[10px] font-bold leading-none text-text-on-yellow">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[360px] max-w-[calc(100vw-32px)] overflow-hidden rounded-[16px] border border-ink-4 bg-ink-2 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-ink-4 px-4 py-3">
            <p className="text-[14px] font-semibold text-text-primary">
              Notificaciones
            </p>
            {count > 0 && (
              <button
                type="button"
                onClick={() => void handleMarkAll()}
                className="text-[12px] font-medium text-violet-300 transition-colors hover:text-text-primary"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading && items === null ? (
              <div className="space-y-3 p-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-ink-3" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-ink-3" />
                      <div className="h-3 w-full animate-pulse rounded bg-ink-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items && items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-3 text-text-tertiary">
                  <Icon name="bell" size={18} />
                </div>
                <p className="text-[13px] font-medium text-text-primary">
                  No tenés notificaciones
                </p>
                <p className="text-[12px] text-text-tertiary">
                  Te avisamos cuando haya novedades
                </p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {(items ?? []).map((n) => {
                  const unread = !n.read_at;
                  const iconName = TYPE_ICON[n.type] ?? "bell";
                  const tone = TYPE_TONE[n.type] ?? "text-text-secondary";
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => void handleItemClick(n)}
                        className={`flex w-full items-start gap-3 border-b border-ink-4 px-4 py-3 text-left transition-colors hover:bg-ink-3 ${
                          unread ? "bg-ink-2" : "bg-transparent"
                        }`}
                      >
                        <div
                          className={`mt-[2px] flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ink-3 ${tone}`}
                        >
                          <Icon name={iconName} size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-[13px] font-semibold text-text-primary">
                              {n.title}
                            </p>
                            {unread && (
                              <span
                                aria-hidden
                                className="h-2 w-2 flex-shrink-0 rounded-full bg-yellow-300"
                              />
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-text-secondary">
                            {n.message}
                          </p>
                          <p className="mt-1 text-[11px] text-text-tertiary">
                            {relativeTime(n.created_at)}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
