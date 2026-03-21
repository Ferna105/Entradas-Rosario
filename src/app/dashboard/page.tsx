"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";
import { mpService } from "@/services/mercadopago";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const statusLabel: Record<string, { text: string; color: string }> = {
  published: { text: "Publicado", color: "bg-green-100 text-green-800" },
  draft: { text: "Borrador", color: "bg-gray-100 text-gray-800" },
  cancelled: { text: "Cancelado", color: "bg-red-100 text-red-800" },
  finished: { text: "Finalizado", color: "bg-blue-100 text-blue-800" },
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mpStatus, setMpStatus] = useState<{
    connected: boolean;
    mpUserId: string | null;
  }>({ connected: false, mpUserId: null });
  const [mpLoading, setMpLoading] = useState(false);
  const [mpMessage, setMpMessage] = useState("");

  useEffect(() => {
    const mpParam = searchParams.get("mp");
    if (mpParam === "connected") {
      setMpMessage("Cuenta de MercadoPago vinculada exitosamente");
    } else if (mpParam === "error") {
      setMpMessage("Error al vincular MercadoPago. Intentá de nuevo.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.type !== "seller" && user.type !== "admin")) {
      router.push("/");
      return;
    }

    async function loadData() {
      try {
        const [eventsData, mpStatusData] = await Promise.all([
          eventsService.getMyEvents(),
          mpService.getStatus(),
        ]);
        setEvents(eventsData);
        setMpStatus(mpStatusData);
      } catch {
        setError("No se pudieron cargar los datos.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, authLoading, router]);

  const handleConnectMp = async () => {
    setMpLoading(true);
    try {
      const { url } = await mpService.getAuthUrl();
      window.location.href = url;
    } catch {
      setMpMessage("Error al obtener el link de vinculación");
      setMpLoading(false);
    }
  };

  const handleDisconnectMp = async () => {
    if (!confirm("¿Estás seguro de que querés desvincular tu cuenta de MercadoPago?"))
      return;
    try {
      await mpService.disconnect();
      setMpStatus({ connected: false, mpUserId: null });
      setMpMessage("Cuenta de MercadoPago desvinculada");
    } catch {
      setMpMessage("Error al desvincular");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que querés cancelar este evento?")) return;
    try {
      await eventsService.deleteEvent(id);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: "cancelled" as const } : e
        )
      );
    } catch {
      alert("Error al cancelar el evento");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* MercadoPago Section */}
      <div className="bg-neutral-900 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">MercadoPago</h2>
            {mpStatus.connected ? (
              <p className="text-green-400 text-sm">
                Cuenta vinculada (ID: {mpStatus.mpUserId})
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                Vinculá tu cuenta de MercadoPago para recibir los pagos de tus
                eventos
              </p>
            )}
          </div>
          <div className="flex gap-3">
            {mpStatus.connected ? (
              <button
                onClick={handleDisconnectMp}
                className="px-5 py-2.5 bg-red-900/50 text-red-300 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors"
              >
                Desvincular
              </button>
            ) : (
              <button
                onClick={handleConnectMp}
                disabled={mpLoading}
                className="px-5 py-2.5 bg-[#009EE3] text-white rounded-lg text-sm font-semibold hover:bg-[#0087C9] transition-colors disabled:opacity-50"
              >
                {mpLoading ? "Conectando..." : "Vincular MercadoPago"}
              </button>
            )}
          </div>
        </div>
        {mpMessage && (
          <p
            className={`mt-3 text-sm ${
              mpMessage.includes("Error") || mpMessage.includes("error")
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {mpMessage}
          </p>
        )}
      </div>

      {/* Events Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Mis Eventos</h1>
          <p className="text-gray-400 mt-1">
            Gestioná tus eventos como organizador
          </p>
        </div>
        <Link
          href="/eventos/crear"
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          + Crear Evento
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-neutral-900 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">
            Todavía no tenés eventos creados
          </p>
          <Link
            href="/eventos/crear"
            className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Crear mi primer evento
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => {
            const status = statusLabel[event.status] || statusLabel.draft;
            return (
              <div
                key={event.id}
                className="bg-neutral-900 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {event.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {formatDate(event.event_date)} &middot; {event.location}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    ${Number(event.price).toLocaleString("es-AR")} &middot;{" "}
                    Capacidad: {event.capacity}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {event.status !== "cancelled" && (
                    <>
                      <Link
                        href={`/eventos/editar/${event.id}`}
                        className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-4 py-2 bg-red-900/50 text-red-300 rounded-lg text-sm font-medium hover:bg-red-900 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  <Link
                    href={`/eventos/${event.id}`}
                    className="px-4 py-2 bg-neutral-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
