"use client";

import { useEffect, useState } from "react";
import EventDetail from "@/components/EventDetail";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";
import Footer from "@/components/Footer";

export default function EventPage({ params }: { params: { id: string } }) {
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
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">Cargando evento...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center text-red-500">
            {error || "Evento no encontrado"}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <EventDetail event={event} />
      </main>
      <Footer />
    </div>
  );
}
