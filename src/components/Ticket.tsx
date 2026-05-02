"use client";

import { useId, useMemo } from "react";
import { Badge } from "@/components/ui";

/* ===== QrPattern — decorativo (cuando no hay qr_code real) ===== */
export function QrPattern({ size = 100, seed = 12345 }: { size?: number; seed?: number }) {
  const cells = 21;
  const cellSize = size / cells;
  const pattern = useMemo(() => {
    const arr: { x: number; y: number; on: boolean }[] = [];
    let s = seed;
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        s = (s * 9301 + 49297) % 233280;
        arr.push({ x, y, on: s / 233280 > 0.5 });
      }
    }
    return arr;
  }, [seed, cells]);

  const inCorner = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);

  const corner = (cx: number, cy: number) => (
    <g key={`c-${cx}-${cy}`}>
      <rect x={cx * cellSize} y={cy * cellSize} width={7 * cellSize} height={7 * cellSize} fill="black" />
      <rect x={(cx + 1) * cellSize} y={(cy + 1) * cellSize} width={5 * cellSize} height={5 * cellSize} fill="white" />
      <rect x={(cx + 2) * cellSize} y={(cy + 2) * cellSize} width={3 * cellSize} height={3 * cellSize} fill="black" />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill="white" />
      {pattern
        .filter((p) => p.on && !inCorner(p.x, p.y))
        .map((p) => (
          <rect
            key={`${p.x}-${p.y}`}
            x={p.x * cellSize}
            y={p.y * cellSize}
            width={cellSize}
            height={cellSize}
            fill="black"
          />
        ))}
      {corner(0, 0)}
      {corner(14, 0)}
      {corner(0, 14)}
    </svg>
  );
}

/* ===== Ticket ===== */
interface TicketProps {
  event: { title: string; venue: string; date: string };
  ticketType: string;
  code: string;
  holder: string;
  /** Base64 PNG del QR del backend (sin el prefijo data:image). */
  qrCode?: string;
  used?: boolean;
}

export function Ticket({ event, ticketType, code, holder, qrCode, used }: TicketProps) {
  const maskId = useId().replace(/:/g, "");
  const gradId = `bg-${maskId}`;

  return (
    <div
      className="relative w-full"
      style={{
        maxWidth: 480,
        filter: used ? "grayscale(0.6) opacity(0.55)" : "none",
      }}
    >
      {/* SVG structure con cutouts */}
      <svg
        width="100%"
        height="200"
        viewBox="0 0 480 200"
        style={{ display: "block" }}
      >
        <defs>
          <mask id={maskId}>
            <rect width="480" height="200" rx="20" fill="white" />
            <circle cx="340" cy="0" r="12" fill="black" />
            <circle cx="340" cy="200" r="12" fill="black" />
          </mask>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7338f5" />
            <stop offset="100%" stopColor="#2e0e6e" />
          </linearGradient>
        </defs>
        <g mask={`url(#${maskId})`}>
          <rect width="480" height="200" fill="#1a0744" />
          <rect x="0" y="0" width="340" height="200" fill={`url(#${gradId})`} />
          {/* Stub */}
          <rect x="340" y="0" width="140" height="200" fill="#111118" />
          {/* Línea perforada */}
          <line
            x1="340" y1="14" x2="340" y2="186"
            stroke="#36364a"
            strokeDasharray="2 4"
            strokeWidth="1.5"
          />
        </g>
      </svg>

      {/* Contenido superpuesto */}
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: "340px 140px" }}
      >
        {/* Lado izquierdo */}
        <div className="flex flex-col justify-between p-[20px_24px]">
          <div>
            <div className="mb-[14px] flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-yellow-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a0744" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
                </svg>
              </div>
              <span className="text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase">
                EventoAbierto
              </span>
              {used && <Badge tone="neutral" size="sm">USADA</Badge>}
            </div>
            <h3 className="m-0 text-[24px] font-bold leading-[1.1] tracking-snug text-white">
              {event.title}
            </h3>
            <div className="mt-[6px] text-[13px] text-white/70">{event.venue}</div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-[11px]">
            <div>
              <div className="mb-[2px] tracking-[0.08em] text-white/50">FECHA</div>
              <div className="text-[13px] font-medium text-white">{event.date}</div>
            </div>
            <div>
              <div className="mb-[2px] tracking-[0.08em] text-white/50">TIPO</div>
              <div className="text-[13px] font-medium text-white">{ticketType}</div>
            </div>
            <div>
              <div className="mb-[2px] tracking-[0.08em] text-white/50">TITULAR</div>
              <div className="text-[13px] font-medium text-white truncate">{holder}</div>
            </div>
          </div>
        </div>

        {/* Stub derecho */}
        <div className="flex flex-col items-center justify-between py-4 px-3">
          <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[8px] bg-white p-[6px]">
            {qrCode ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="QR entrada"
                width={78}
                height={78}
                className="block"
              />
            ) : (
              <QrPattern size={78} seed={code.split("").reduce((a, c) => a + c.charCodeAt(0), 0)} />
            )}
          </div>
          <div className="text-center">
            <div className="text-[9px] tracking-[0.08em] text-text-tertiary">CÓDIGO</div>
            <div className="font-mono text-[12px] font-semibold tracking-[0.05em] text-text-primary">
              {code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;
