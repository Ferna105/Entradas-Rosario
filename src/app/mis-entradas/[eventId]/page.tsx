"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ticketsService, MyEventTickets } from "@/services/tickets";
import { Card, PageContainer } from "@/components/ui";

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusBadge: Record<string, { text: string; className: string }> = {
  valid: {
    text: "Válida",
    className:
      "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25",
  },
  used: {
    text: "Utilizada",
    className: "bg-zinc-500/15 text-zinc-400 ring-1 ring-white/10",
  },
  cancelled: {
    text: "Cancelada",
    className: "bg-red-500/15 text-red-300 ring-1 ring-red-500/25",
  },
};

export default function MiEventoEntradasPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<MyEventTickets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.type !== "buyer") {
      router.push("/");
      return;
    }

    const id = Number(eventId);
    if (!Number.isFinite(id)) {
      setError("Evento inválido");
      setLoading(false);
      return;
    }

    async function loadTickets() {
      try {
        const result = await ticketsService.getMyEventTickets(id);
        setData(result);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las entradas";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, [eventId, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <p className="text-sm text-zinc-500">Cargando…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <PageContainer className="flex flex-col gap-6 py-6 sm:py-10">
        <Link
          href="/mis-entradas"
          className="text-sm text-zinc-400 hover:text-violet-400"
        >
          ← Volver a mis entradas
        </Link>
        <Card className="p-8 text-center sm:p-10">
          <p className="text-base text-zinc-300">
            {error || "No se encontraron entradas para este evento"}
          </p>
        </Card>
      </PageContainer>
    );
  }

  const { event, tickets } = data;

  return (
    <PageContainer className="flex flex-col gap-6 py-6 sm:py-10">
      <Link
        href="/mis-entradas"
        className="self-start text-sm text-zinc-400 transition-colors hover:text-violet-400"
      >
        ← Volver a mis entradas
      </Link>

      <Card className="overflow-hidden p-0">
        <div className="relative aspect-[16/7] w-full">
          <Image
            src={
              event.image ||
              "https://placehold.co/1200x525/27272a/a1a1aa/png?text=Sin+imagen"
            }
            alt={event.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
        <div className="space-y-2 p-5 sm:p-6">
          <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
            {event.name}
          </h1>
          <p className="text-sm text-zinc-300">
            {formatDateTime(event.event_date)}
          </p>
          {event.location && (
            <p className="text-sm text-zinc-400">{event.location}</p>
          )}
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-bold text-white sm:text-xl">
          {tickets.length === 1
            ? "Tu entrada"
            : `Tus ${tickets.length} entradas`}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Presentá{" "}
          {tickets.length === 1 ? "este código QR" : "estos códigos QR"} en la
          entrada del evento
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tickets.map((ticket, index) => {
          const badge = statusBadge[ticket.status] || statusBadge.valid;
          return (
            <Card key={ticket.id} className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="mx-auto shrink-0 rounded-2xl bg-white p-3 md:mx-0">
                  {ticket.qr_code ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- data URL del QR */
                    <img
                      src={ticket.qr_code}
                      alt={`QR Entrada ${index + 1}`}
                      className="h-56 w-56 sm:h-64 sm:w-64"
                    />
                  ) : (
                    <div className="flex h-56 w-56 items-center justify-center text-xs text-zinc-500 sm:h-64 sm:w-64">
                      QR no disponible
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-zinc-500">
                      Entrada {index + 1} de {tickets.length}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                    >
                      {badge.text}
                    </span>
                  </div>

                  {ticket.ticket_type_name && (
                    <p className="text-base font-semibold text-white">
                      {ticket.ticket_type_name}
                    </p>
                  )}

                  {ticket.buyer_name && (
                    <p className="text-sm text-zinc-300">
                      A nombre de:{" "}
                      <span className="text-white">{ticket.buyer_name}</span>
                    </p>
                  )}

                  {ticket.scanned_at && (
                    <p className="text-sm text-zinc-400">
                      Escaneada el {formatDateTime(ticket.scanned_at)}
                    </p>
                  )}

                  <p className="break-all font-mono text-xs text-zinc-500">
                    {ticket.qr_data}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
