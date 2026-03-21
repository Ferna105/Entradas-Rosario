"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import EventForm from "@/components/EventForm";
import { eventsService } from "@/services/events";
import { CreateEventData } from "@/types/event";

export default function CreateEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || (user.type !== "seller" && user.type !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  const handleCreate = async (data: CreateEventData) => {
    await eventsService.createEvent(data);
    router.push("/dashboard");
  };

  return (
    <EventForm
      title="Crear Evento"
      submitLabel="Publicar Evento"
      onSubmit={handleCreate}
    />
  );
}
