"use client";

import { useEffect, useState } from "react";
import EventCarousel from "@/components/EventCarousel";
import EventList from "@/components/EventList";
import { PageContainer } from "@/components/ui";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await eventsService.getUpcomingEvents();
        setEvents(data);
      } catch {
        setError("No se pudieron cargar los eventos.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="flex-1">
        {loading ? (
          <PageContainer className="py-12">
            <div className="space-y-6">
              <div className="h-[min(70vw,420px)] min-h-[280px] animate-pulse rounded-2xl bg-zinc-800/80 md:h-[420px]" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80"
                  >
                    <div className="aspect-video animate-pulse bg-zinc-800" />
                    <div className="space-y-3 p-5">
                      <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-800" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-800/80" />
                      <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-800/60" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-zinc-500">Cargando eventos…</p>
          </PageContainer>
        ) : error ? (
          <PageContainer className="py-16 text-center">
            <div className="mx-auto max-w-md rounded-2xl border border-red-500/20 bg-red-950/30 px-6 py-8">
              <p className="text-red-300">{error}</p>
              <p className="mt-2 text-sm text-zinc-400">
                Revisá tu conexión e intentá de nuevo más tarde.
              </p>
            </div>
          </PageContainer>
        ) : (
          <>
            <EventCarousel events={events.slice(0, 3)} />
            <PageContainer className="pb-16 pt-4 sm:pt-6">
              <h2 className="mb-6 text-center text-xl font-bold tracking-tight text-white sm:mb-8 sm:text-left md:text-2xl lg:text-3xl">
                Próximos eventos
              </h2>
              <EventList events={events} />
            </PageContainer>
          </>
        )}
      </main>
    </div>
  );
}
