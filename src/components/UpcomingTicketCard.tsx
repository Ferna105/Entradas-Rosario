"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MyEventSummary } from "@/services/tickets";
import { Badge, Button, Icon } from "@/components/ui";
import { Ticket } from "@/components/Ticket";

interface UpcomingTicketCardProps {
  summary: MyEventSummary;
  /** Ticket individual para expandir QR (opcional, se carga bajo demanda). */
  ticket?: {
    id: number;
    qr_code: string;
    ticket_type_name: string | null;
    buyer_name: string | null;
    status: string;
  };
  onExpand?: () => void;
}

const GRADIENTS = [
  "linear-gradient(135deg, #7338f5 0%, #ff5470 60%, #ffd91f 100%)",
  "linear-gradient(135deg, #1a0744 0%, #7338f5 50%, #4dabff 100%)",
  "linear-gradient(135deg, #ff5470 0%, #7338f5 50%, #2e0e6e 100%)",
  "linear-gradient(135deg, #2e0e6e 0%, #7338f5 50%, #ffd91f 100%)",
  "linear-gradient(135deg, #ffd91f 0%, #ff5470 50%, #7338f5 100%)",
];

function getGradient(id: number) {
  return GRADIENTS[id % GRADIENTS.length];
}

function countdown(dateString: string): string {
  const diff = new Date(dateString).getTime() - Date.now();
  if (diff <= 0) return "hoy";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "hoy";
  if (days === 1) return "en 1 día";
  return `en ${days} días`;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UpcomingTicketCard({ summary, ticket, onExpand }: UpcomingTicketCardProps) {
  const [open, setOpen] = useState(false);
  const gradient = getGradient(summary.id);
  const cd = countdown(summary.event_date);

  const handleToggle = () => {
    if (!open && onExpand) onExpand();
    setOpen((v) => !v);
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-ink-4 bg-ink-2">
      {/* Row principal */}
      <div className="grid grid-cols-[200px_1fr_auto] items-center gap-6 p-5 max-sm:grid-cols-1 max-sm:gap-4">
        {/* Thumb */}
        <div
          className="relative h-[130px] overflow-hidden rounded-[12px] max-sm:h-[160px]"
          style={{ background: gradient }}
        >
          {summary.image && (
            <Image
              src={summary.image}
              alt={summary.name}
              fill
              className="object-cover"
              unoptimized
            />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <Badge tone="yellow" icon="sparkle" size="sm">{cd}</Badge>
          <h3 className="text-[22px] font-semibold leading-snug tracking-snug max-sm:text-[18px]">
            {summary.name}
          </h3>
          <div className="flex flex-wrap gap-4 text-[13px] text-text-secondary">
            <span className="flex items-center gap-[6px]">
              <Icon name="calendar" size={14} />
              {formatDate(summary.event_date)}
            </span>
            {summary.location && (
              <span className="flex items-center gap-[6px]">
                <Icon name="pin" size={14} />
                {summary.location}
              </span>
            )}
            <Badge tone="violet" size="sm">
              {summary.ticketCount} {summary.ticketCount === 1 ? "entrada" : "entradas"}
            </Badge>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2 max-sm:flex-row max-sm:w-full">
          {ticket ? (
            <Button
              variant={open ? "outline" : "primary"}
              size="lg"
              icon="qr"
              onClick={handleToggle}
              className="max-sm:flex-1"
            >
              {open ? "Ocultar QR" : "Mostrar QR"}
            </Button>
          ) : (
            <Link href={`/mis-entradas/${summary.id}`} className="max-sm:flex-1">
              <Button variant="primary" size="lg" icon="ticket" full>
                Ver entradas
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* QR expandido */}
      {open && ticket && (
        <div className="flex justify-center border-t border-ink-4 p-6">
          <Ticket
            event={{
              title: summary.name,
              venue: summary.location ?? "",
              date: formatDate(summary.event_date),
            }}
            ticketType={ticket.ticket_type_name ?? "General"}
            code={`EVA-${ticket.id}`}
            holder={ticket.buyer_name ?? ""}
            qrCode={ticket.qr_code}
            used={ticket.status === "used"}
          />
        </div>
      )}
    </div>
  );
}
