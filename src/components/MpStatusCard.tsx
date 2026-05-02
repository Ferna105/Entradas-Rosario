"use client";

import { Icon } from "@/components/ui";

interface MpStatusCardProps {
  connected: boolean;
  mpUserId?: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  loading?: boolean;
}

export function MpStatusCard({
  connected,
  mpUserId,
  onConnect,
  onDisconnect,
  loading = false,
}: MpStatusCardProps) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-6 rounded-[18px] border p-6",
        connected
          ? "border-[rgba(34,201,140,0.3)] bg-[linear-gradient(135deg,rgba(34,201,140,0.08),var(--ink-2))]"
          : "border-[rgba(0,158,227,0.3)] bg-[linear-gradient(135deg,rgba(0,158,227,0.1),var(--ink-2))]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-4">
        <div
          className={[
            "flex h-14 w-14 items-center justify-center rounded-[14px]",
            connected
              ? "bg-[rgba(34,201,140,0.15)] text-success"
              : "text-white",
          ]
            .filter(Boolean)
            .join(" ")}
          style={connected ? {} : { background: "#009EE3" }}
        >
          {connected ? (
            <Icon name="check" size={28} strokeWidth={2.5} />
          ) : (
            <Icon name="mp" size={26} />
          )}
        </div>
        <div>
          <div className="text-[11px] tracking-[0.08em] text-text-tertiary">MERCADOPAGO</div>
          <div className="mt-[2px] text-[18px] font-semibold">
            {connected ? "Cuenta vinculada" : "Vinculá tu cuenta de MercadoPago"}
          </div>
          <div className="mt-1 text-[13px] text-text-secondary">
            {connected
              ? mpUserId
                ? `ID: ${mpUserId} · Recibís los pagos automáticamente`
                : "Recibís los pagos automáticamente"
              : "Necesario para recibir los pagos de tus eventos"}
          </div>
        </div>
      </div>

      {connected ? (
        <button
          type="button"
          onClick={onDisconnect}
          disabled={loading}
          className="inline-flex h-[38px] items-center rounded-full border border-ink-5 bg-transparent px-5 text-[13px] font-medium text-text-primary transition-all hover:bg-ink-3 disabled:opacity-40"
        >
          Desvincular
        </button>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          disabled={loading}
          className="inline-flex h-[44px] items-center rounded-[12px] px-[22px] text-[14px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-40"
          style={{ background: "#009EE3" }}
        >
          {loading ? "Redirigiendo…" : "Vincular MercadoPago"}
        </button>
      )}
    </div>
  );
}
