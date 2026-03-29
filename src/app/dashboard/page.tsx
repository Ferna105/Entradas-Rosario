"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";
import { mpService } from "@/services/mercadopago";
import { apiClient } from "@/services/api";
import { Button, Card, Input, PageContainer } from "@/components/ui";

interface AssignedScanner {
  id: number;
  name: string;
  email: string;
  assigned_at: string;
}

interface PendingInvitation {
  id: number;
  email: string;
  created_at: string;
  expires_at: string;
}

type InviteScannerResponse =
  | {
      kind: "invited";
      message: string;
      invitationId: number;
    }
  | {
      kind: "assigned";
      message: string;
      scanner: { id: number; name: string; email: string };
    };

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const statusLabel: Record<string, { text: string; color: string }> = {
  published: { text: "Publicado", color: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25" },
  draft: { text: "Borrador", color: "bg-zinc-500/15 text-zinc-300 ring-1 ring-white/10" },
  cancelled: { text: "Cancelado", color: "bg-red-500/15 text-red-300 ring-1 ring-red-500/25" },
  finished: { text: "Finalizado", color: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25" },
};

function DashboardPageContent() {
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

  const [scannersByEvent, setScannersByEvent] = useState<Record<number, AssignedScanner[]>>({});
  const [pendingByEvent, setPendingByEvent] = useState<Record<number, PendingInvitation[]>>({});
  const [scannerEmail, setScannerEmail] = useState("");
  const [scannerEventId, setScannerEventId] = useState<number | null>(null);
  const [scannerMsg, setScannerMsg] = useState("");
  const [resendLoadingId, setResendLoadingId] = useState<number | null>(null);

  const loadScanners = async (eventId: number) => {
    try {
      const data = await apiClient.get<AssignedScanner[]>(`/scanner/event/${eventId}/scanners`);
      setScannersByEvent((prev) => ({ ...prev, [eventId]: data }));
    } catch { /* silent */ }
  };

  const loadPendingInvitations = async (eventId: number) => {
    try {
      const data = await apiClient.get<PendingInvitation[]>(
        `/scanner/event/${eventId}/invitations/pending`
      );
      setPendingByEvent((prev) => ({ ...prev, [eventId]: data }));
    } catch { /* silent */ }
  };

  const handleAssignScanner = async (eventId: number) => {
    if (!scannerEmail.trim()) return;
    setScannerMsg("");
    try {
      const res = await apiClient.post<InviteScannerResponse>("/scanner/invitations", {
        eventId,
        scannerEmail: scannerEmail.trim(),
      });
      setScannerEmail("");
      setScannerMsg(res.message);
      loadScanners(eventId);
      loadPendingInvitations(eventId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al enviar la invitación";
      setScannerMsg(msg);
    }
  };

  const handleResendInvitation = async (eventId: number, invitationId: number) => {
    setResendLoadingId(invitationId);
    setScannerMsg("");
    try {
      await apiClient.post(`/scanner/invitations/${invitationId}/resend`, {});
      setScannerMsg("Invitación reenviada por correo");
      loadPendingInvitations(eventId);
    } catch (err: unknown) {
      setScannerMsg(err instanceof Error ? err.message : "Error al reenviar");
    } finally {
      setResendLoadingId(null);
    }
  };

  const handleRemoveScanner = async (eventId: number, scannerId: number) => {
    try {
      await apiClient.delete(`/scanner/event/${eventId}/scanner/${scannerId}`);
      loadScanners(eventId);
    } catch { /* silent */ }
  };

  const toggleScannerPanel = (eventId: number) => {
    if (scannerEventId === eventId) {
      setScannerEventId(null);
    } else {
      setScannerEventId(eventId);
      if (!scannersByEvent[eventId]) loadScanners(eventId);
      if (!pendingByEvent[eventId]) loadPendingInvitations(eventId);
    }
    setScannerMsg("");
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
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <p className="text-sm text-zinc-500">Cargando…</p>
      </div>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-8 py-6 sm:py-10">
      {/* MercadoPago — primero en móvil y desktop */}
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-1 text-lg font-bold text-white sm:text-xl">MercadoPago</h2>
            {mpStatus.connected ? (
              <p className="text-sm text-emerald-400">
                Cuenta vinculada (ID: {mpStatus.mpUserId})
              </p>
            ) : (
              <p className="text-sm text-zinc-400">
                Vinculá tu cuenta de MercadoPago para recibir los pagos de tus eventos
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {mpStatus.connected ? (
              <Button type="button" variant="danger" onClick={handleDisconnectMp} className="w-full sm:w-auto">
                Desvincular
              </Button>
            ) : (
              <button
                type="button"
                onClick={handleConnectMp}
                disabled={mpLoading}
                className="min-h-[44px] rounded-xl bg-[#009EE3] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0087C9] disabled:opacity-50"
              >
                {mpLoading ? "Conectando…" : "Vincular MercadoPago"}
              </button>
            )}
          </div>
        </div>
        {mpMessage && (
          <p
            className={`mt-3 text-sm ${
              mpMessage.includes("Error") || mpMessage.includes("error")
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {mpMessage}
          </p>
        )}
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
            Mis eventos
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Gestioná tus eventos como organizador</p>
        </div>
        <Link
          href="/eventos/crear"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:w-auto"
        >
          + Crear evento
        </Link>
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
            Todavía no tenés eventos creados
          </p>
          <Link
            href="/eventos/crear"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Crear mi primer evento
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => {
            const status = statusLabel[event.status] || statusLabel.draft;
            return (
              <Card key={event.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                      >
                        {status.text}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">
                      {formatDate(event.event_date)} · {event.location}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Desde ${Number(event.minPrice).toLocaleString("es-AR")} ·{" "}
                      {event.ticketTypes?.length ?? 0}{" "}
                      {(event.ticketTypes?.length ?? 0) === 1
                        ? "tipo de entrada"
                        : "tipos de entrada"}
                    </p>
                  </div>

                  <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
                    {event.status !== "cancelled" && (
                      <>
                        <Link
                          href={`/eventos/editar/${event.id}`}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleScannerPanel(event.id)}
                          className={`inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                            scannerEventId === event.id
                              ? "bg-violet-600 text-white"
                              : "border border-white/10 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-800"
                          }`}
                        >
                          Scanners
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(event.id)}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-950/60"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    <Link
                      href={`/eventos/${event.id}`}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-center text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
                    >
                      Ver
                    </Link>
                  </div>
                </div>

                {scannerEventId === event.id && (
                  <div className="mt-4 w-full border-t border-white/10 pt-4">
                    <Card className="border-white/5 bg-zinc-950/40 p-4">
                      <h4 className="mb-3 text-sm font-semibold text-zinc-200">
                        Escaneadores
                      </h4>

                      {pendingByEvent[event.id]?.length ? (
                        <div className="mb-4">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                            Invitaciones pendientes
                          </p>
                          <div className="space-y-2">
                            {pendingByEvent[event.id].map((inv) => (
                              <div
                                key={inv.id}
                                className="flex flex-col gap-2 rounded-xl border border-amber-500/20 bg-amber-950/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-sm text-amber-100/90">{inv.email}</p>
                                  <p className="text-xs text-zinc-500">
                                    Expira{" "}
                                    {new Date(inv.expires_at).toLocaleDateString("es-AR", {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={resendLoadingId === inv.id}
                                  onClick={() => handleResendInvitation(event.id, inv.id)}
                                  className="shrink-0 rounded-lg border border-amber-500/30 bg-amber-950/40 px-3 py-1.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-950/60 disabled:opacity-50"
                                >
                                  {resendLoadingId === inv.id ? "Enviando…" : "Reenviar invitación"}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Activos
                      </p>
                      {scannersByEvent[event.id]?.length ? (
                        <div className="mb-4 space-y-2">
                          {scannersByEvent[event.id].map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-zinc-900/80 px-4 py-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm text-white">{s.name}</p>
                                <p className="truncate text-xs text-zinc-500">{s.email}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveScanner(event.id, s.id)}
                                className="shrink-0 text-xs text-red-400 hover:text-red-300"
                              >
                                Remover
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mb-4 text-sm text-zinc-500">Ningún escaneador activo todavía</p>
                      )}

                      <p className="mb-2 text-xs text-zinc-500">
                        Enviá una invitación por correo. La persona creará su cuenta y quedará vinculada a este evento.
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          type="email"
                          value={scannerEmail}
                          onChange={(e) => setScannerEmail(e.target.value)}
                          placeholder="Email del futuro escaneador"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAssignScanner(event.id);
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => handleAssignScanner(event.id)}
                          className="w-full shrink-0 sm:w-auto"
                        >
                          Invitar
                        </Button>
                      </div>

                      {scannerMsg && (
                        <p
                          className={`mt-2 text-xs ${
                            scannerMsg.includes("Error") || scannerMsg.includes("error")
                              ? "text-red-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {scannerMsg}
                        </p>
                      )}
                    </Card>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <p className="text-sm text-zinc-500">Cargando…</p>
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}
