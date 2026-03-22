"use client";

import { use, useEffect, useState } from "react";
import EventDetail from "@/components/EventDetail";
import { PageContainer } from "@/components/ui";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";

type Params = Promise<{ id: string }>;

export default function EventPage(props: { params: Params }) {
  const params = use(props.params);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const data = await eventsService.getEvent(params.id);
        setEvent(data);
      } catch {
        setError("No se pudo cargar el evento");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <PageContainer className="flex flex-1 flex-col py-10">
        <div className="animate-pulse space-y-4">
          <div className="aspect-video w-full rounded-2xl bg-zinc-800" />
          <div className="h-8 w-2/3 rounded-lg bg-zinc-800" />
          <div className="h-4 w-1/2 rounded bg-zinc-800/80" />
          <div className="h-32 w-full rounded-2xl bg-zinc-800/60" />
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">Cargando evento…</p>
      </PageContainer>
    );
  }

  if (error || !event) {
    return (
      <PageContainer className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-950/30 px-6 py-8">
          <p className="text-red-300">{error || "Evento no encontrado"}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1">
        <EventDetail event={event} />
      </main>
    </div>
  );
}
