"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ticketsService, MyEventSummary } from "@/services/tickets";
import { Card, PageContainer } from "@/components/ui";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MisEntradasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<MyEventSummary[]>([]);
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

    async function loadEvents() {
      try {
        const data = await ticketsService.getMyEvents();
        setEvents(data);
      } catch {
        setError("No se pudieron cargar tus entradas.");
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <p className="text-sm text-zinc-500">Cargando…</p>
      </div>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-6 py-6 sm:py-10">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
          Mis entradas
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Eventos para los que comprás entradas
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <Card className="p-10 text-center sm:p-12">
          <p className="mb-4 text-base text-zinc-400 sm:text-lg">
            Todavía no compraste entradas
          </p>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Ver eventos disponibles
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/mis-entradas/${event.id}`}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-2xl"
            >
              <Card className="overflow-hidden p-0 transition-colors hover:border-white/15">
                <div className="relative aspect-video w-full">
                  <Image
                    src={
                      event.image ||
                      "https://placehold.co/600x400/27272a/a1a1aa/png?text=Sin+imagen"
                    }
                    alt={event.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-black/30">
                    {event.ticketCount}{" "}
                    {event.ticketCount === 1 ? "entrada" : "entradas"}
                  </span>
                </div>
                <div className="space-y-2 p-4 sm:p-5">
                  <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">
                    {event.name}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    <span className="font-medium text-zinc-300">
                      {formatDate(event.event_date)}
                    </span>
                    <span className="text-zinc-500"> · </span>
                    {formatTime(event.event_date)}
                  </p>
                  {event.location && (
                    <p className="line-clamp-2 text-sm text-zinc-500">
                      {event.location}
                    </p>
                  )}
                  <p className="pt-2 text-sm font-semibold text-violet-400">
                    Ver entradas →
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
