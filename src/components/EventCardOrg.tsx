"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/types/event";
import { Avatar, Badge, Button, Icon, Input } from "@/components/ui";

const GRADIENTS = [
  "linear-gradient(135deg, #7338f5 0%, #ff5470 60%, #ffd91f 100%)",
  "linear-gradient(135deg, #1a0744 0%, #7338f5 50%, #4dabff 100%)",
  "linear-gradient(135deg, #ff5470 0%, #7338f5 50%, #2e0e6e 100%)",
  "linear-gradient(135deg, #2e0e6e 0%, #7338f5 50%, #ffd91f 100%)",
  "linear-gradient(135deg, #ffd91f 0%, #ff5470 50%, #7338f5 100%)",
];
function getGradient(id: number) { return GRADIENTS[id % GRADIENTS.length]; }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export interface ScannerInfo {
  id: number;
  name: string;
  email: string;
}

export interface PendingInvitation {
  id: number;
  email: string;
  expires_at: string;
}

interface EventCardOrgProps {
  event: Event;
  scanners: ScannerInfo[];
  pending: PendingInvitation[];
  onInvite: (email: string) => Promise<void>;
  onRemove: (scannerId: number) => Promise<void>;
  onResend?: (invitationId: number) => Promise<void>;
  onCancel?: () => Promise<void>;
}

const statusBadge: Record<string, React.ReactNode> = {
  published: <Badge tone="success" dot size="sm">Publicado</Badge>,
  draft:     <Badge tone="neutral" size="sm">Borrador</Badge>,
  cancelled: <Badge tone="danger" size="sm">Cancelado</Badge>,
  finished:  <Badge tone="violet" size="sm">Finalizado</Badge>,
};

export function EventCardOrg({ event, scanners, pending, onInvite, onRemove, onResend, onCancel }: EventCardOrgProps) {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);
  const [resending, setResending] = useState<number | null>(null);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await onInvite(inviteEmail.trim());
      setInviteEmail("");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (id: number) => {
    setRemoving(id);
    try { await onRemove(id); } finally { setRemoving(null); }
  };

  return (
    <div className="overflow-hidden rounded-[16px] border border-ink-4 bg-ink-2">
      {/* Fila principal */}
      <div className="grid grid-cols-[72px_1fr_auto] items-center gap-5 p-4 max-sm:grid-cols-[56px_1fr]">
        {/* Thumb */}
        <div
          className="relative h-[72px] w-[72px] overflow-hidden rounded-[12px] max-sm:h-[56px] max-sm:w-[56px]"
          style={{ background: getGradient(event.id) }}
        >
          {event.image && (
            <Image src={event.image} alt={event.name} fill className="object-cover" unoptimized />
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-[6px]">
            <h3 className="text-[17px] font-semibold">{event.name}</h3>
            {statusBadge[event.status]}
          </div>
          <div className="text-[13px] text-text-secondary">
            {formatDate(event.event_date)}{event.location ? ` · ${event.location}` : ""}
          </div>
          <div className="mt-1 text-[12px] text-text-tertiary">
            Desde{" "}
            <span className="font-semibold text-yellow-300">
              ${Number(event.minPrice).toLocaleString("es-AR")}
            </span>
            {" · "}
            {event.ticketTypes.length} {event.ticketTypes.length === 1 ? "tipo de entrada" : "tipos de entrada"}
          </div>
        </div>

        {/* Acciones — ocultas en mobile-xs, ajustadas en sm */}
        <div className="flex flex-wrap justify-end gap-[6px] max-sm:col-span-2">
          {event.status !== "cancelled" && (
            <>
              <Link href={`/eventos/editar/${event.id}`}>
                <Button variant="outline" size="sm">Editar</Button>
              </Link>
              <Button
                variant={scannerOpen ? "primary" : "outline"}
                size="sm"
                onClick={() => setScannerOpen((v) => !v)}
              >
                Escaneadores
              </Button>
              {onCancel && (
                <Button variant="danger" size="sm" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </>
          )}
          <Link href={`/eventos/${event.id}`}>
            <Button variant="ghost" size="sm">Ver</Button>
          </Link>
        </div>
      </div>

      {/* Panel de escaneadores */}
      {scannerOpen && (
        <div className="border-t border-ink-4 bg-ink-1 p-5">
          <div className="mb-[14px] flex items-center gap-2 text-[13px] font-semibold">
            <Icon name="qr" size={14} />
            Escaneadores
          </div>

          {/* Invitaciones pendientes */}
          {pending.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 text-[10px] font-semibold tracking-[0.1em] text-text-tertiary uppercase">
                Invitaciones pendientes
              </div>
              <div className="flex flex-col gap-2">
                {pending.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-[12px] border border-[rgba(255,181,71,0.25)] bg-[rgba(255,181,71,0.08)] px-[14px] py-[10px]"
                  >
                    <div>
                      <div className="text-[13px] text-warning">{inv.email}</div>
                      <div className="mt-[2px] text-[11px] text-text-tertiary">
                        Expira: {new Date(inv.expires_at).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      loading={resending === inv.id}
                      disabled={!onResend}
                      onClick={async () => {
                        if (!onResend) return;
                        setResending(inv.id);
                        try { await onResend(inv.id); } finally { setResending(null); }
                      }}
                    >
                      Reenviar invitación
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activos */}
          <div className="mb-[10px] text-[10px] font-semibold tracking-[0.1em] text-text-tertiary uppercase">
            Activos
          </div>
          {scanners.length > 0 ? (
            <div className="mb-4 flex flex-col gap-2">
              {scanners.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-[12px] border border-ink-4 bg-ink-2 px-[14px] py-[10px]"
                >
                  <div className="flex items-center gap-[10px]">
                    <Avatar name={s.name} size={32} />
                    <div>
                      <div className="text-[13px] font-semibold">{s.name}</div>
                      <div className="text-[11px] text-text-tertiary">{s.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(s.id)}
                    disabled={removing === s.id}
                    className="text-[12px] text-danger hover:text-danger/80 disabled:opacity-40 transition-colors"
                  >
                    {removing === s.id ? "Removiendo…" : "Remover"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 px-[14px] py-[12px] text-[13px] text-text-tertiary">
              Ningún escaneador activo todavía.
            </div>
          )}

          <div className="mb-[10px] text-[12px] text-text-tertiary">
            Enviá una invitación por correo. La persona crea su cuenta y queda vinculada al evento.
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="email@ejemplo.com"
                icon="user"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleInvite(); }}
              />
            </div>
            <Button variant="primary" onClick={handleInvite} loading={inviting}>
              Invitar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
