"use client";

import { useEffect, useState } from "react";
import EventCarousel from "@/components/EventCarousel";
import EventList from "@/components/EventList";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {loading ? (
          <div className="text-center py-12">Cargando eventos...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <>
            <EventCarousel events={events.slice(0, 3)} />
            <div className="container mx-auto py-12">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Próximos Eventos
              </h2>
              <EventList events={events} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
