"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import EventForm from "@/components/EventForm";
import { eventsService } from "@/services/events";
import { Event, CreateEventData } from "@/types/event";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.type !== "seller" && user.type !== "admin")) {
      router.push("/");
      return;
    }

    async function fetchEvent() {
      try {
        const data = await eventsService.getEvent(id);
        if (data.seller_id !== user!.id) {
          router.push("/dashboard");
          return;
        }
        setEvent(data);
      } catch {
        setError("No se pudo cargar el evento.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <p className="text-sm text-zinc-500">Cargando…</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <p className="text-center text-red-400">{error || "Evento no encontrado"}</p>
      </div>
    );
  }

  const handleUpdate = async (data: CreateEventData) => {
    await eventsService.updateEvent(event.id, data);
    router.push("/dashboard");
  };

  const formInitial: Partial<CreateEventData> = {
    ...event,
    image: event.image ?? undefined,
    ticketTypes: event.ticketTypes.map((t) => ({
      id: t.id,
      name: t.name,
      price: t.price,
      capacity: t.capacity,
      sortOrder: t.sort_order,
    })),
  };

  return (
    <EventForm
      title="Editar Evento"
      submitLabel="Guardar Cambios"
      initialData={formInitial}
      onSubmit={handleUpdate}
    />
  );
}
