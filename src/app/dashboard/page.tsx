"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";
import { mpService } from "@/services/mercadopago";
import { dashboardService, type DashboardStats } from "@/services/dashboard";
import { apiClient } from "@/services/api";
import { Button, EmptyState, PageContainer, Skeleton, useToast } from "@/components/ui";
import { EventCardOrg } from "@/components/EventCardOrg";
import { MiniKPI } from "@/components/MiniKPI";
import { MpStatusCard } from "@/components/MpStatusCard";
import type { ScannerInfo, PendingInvitation } from "@/components/EventCardOrg";

function LoadingSkeleton() {
  return (
    <PageContainer className="flex flex-col gap-8 py-6 sm:py-10">
      <Skeleton height={92} className="w-full rounded-[18px]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={76} className="rounded-[14px]" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={96} className="rounded-[16px]" />
        ))}
      </div>
    </PageContainer>
  );
}

function DashboardPageContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [mpStatus, setMpStatus] = useState<{ connected: boolean; mpUserId: string | null }>({
    connected: false,
    mpUserId: null,
  });
  const [mpLoading, setMpLoading] = useState(false);
  const [scannersByEvent, setScannersByEvent] = useState<Record<number, ScannerInfo[]>>({});
  const [pendingByEvent, setPendingByEvent] = useState<Record<number, PendingInvitation[]>>({});
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const mpParam = searchParams.get("mp");
    if (mpParam === "connected") {
      addToast({ tone: "success", title: "MercadoPago vinculado", message: "Tu cuenta está conectada." });
    } else if (mpParam === "error") {
      addToast({ tone: "danger", title: "Error al vincular MercadoPago", message: "Intentá de nuevo." });
    }
  }, [searchParams, addToast]);

  const refreshScanners = useCallback(async (eventId: number) => {
    const [s, p] = await Promise.allSettled([
      apiClient.get<ScannerInfo[]>(`/scanner/event/${eventId}/scanners`),
      apiClient.get<PendingInvitation[]>(`/scanner/event/${eventId}/invitations/pending`),
    ]);
    setScannersByEvent((prev) => ({
      ...prev,
      [eventId]: s.status === "fulfilled" ? s.value : prev[eventId] ?? [],
    }));
    setPendingByEvent((prev) => ({
      ...prev,
      [eventId]: p.status === "fulfilled" ? p.value : prev[eventId] ?? [],
    }));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || (user.type !== "seller" && user.type !== "admin")) {
      router.push("/");
      return;
    }

    async function loadData() {
      try {
        const [eventsData, mpStatusData, statsData] = await Promise.all([
          eventsService.getMyEvents(),
          mpService.getStatus(),
          dashboardService.getStats().catch(() => null),
        ]);

        const normalized = eventsData.map((e) => ({
          ...e,
          minPrice: Number(e.minPrice),
          ticketTypes: (e.ticketTypes ?? []).map((t) => ({ ...t, price: Number(t.price) })),
        }));

        setEvents(normalized);
        setMpStatus(mpStatusData);
        setStats(statsData);

        const scannersMap: Record<number, ScannerInfo[]> = {};
        const pendingMap: Record<number, PendingInvitation[]> = {};
        await Promise.allSettled(
          normalized.map(async (event) => {
            const [s, p] = await Promise.allSettled([
              apiClient.get<ScannerInfo[]>(`/scanner/event/${event.id}/scanners`),
              apiClient.get<PendingInvitation[]>(`/scanner/event/${event.id}/invitations/pending`),
            ]);
            scannersMap[event.id] = s.status === "fulfilled" ? s.value : [];
            pendingMap[event.id] = p.status === "fulfilled" ? p.value : [];
          })
        );
        setScannersByEvent(scannersMap);
        setPendingByEvent(pendingMap);
      } catch {
        addToast({ tone: "danger", title: "Error al cargar los datos" });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, authLoading, router, addToast]);

  const handleConnectMp = async () => {
    setMpLoading(true);
    try {
      const { url } = await mpService.getAuthUrl();
      window.location.href = url;
    } catch {
      addToast({ tone: "danger", title: "Error al obtener el link de vinculación" });
      setMpLoading(false);
    }
  };

  const handleDisconnectMp = async () => {
    if (!confirm("¿Desvincular tu cuenta de MercadoPago?")) return;
    try {
      await mpService.disconnect();
      setMpStatus({ connected: false, mpUserId: null });
      addToast({ tone: "success", title: "Cuenta de MercadoPago desvinculada" });
    } catch {
      addToast({ tone: "danger", title: "Error al desvincular" });
    }
  };

  const handleInvite = async (eventId: number, email: string) => {
    const res = await apiClient.post<{ message: string }>("/scanner/invitations", {
      eventId,
      scannerEmail: email,
    });
    addToast({ tone: "success", title: res.message });
    await refreshScanners(eventId);
  };

  const handleRemove = async (eventId: number, scannerId: number) => {
    await apiClient.delete(`/scanner/event/${eventId}/scanner/${scannerId}`);
    await refreshScanners(eventId);
  };

  const handleResend = async (eventId: number, invitationId: number) => {
    await apiClient.post(`/scanner/invitations/${invitationId}/resend`, {});
    addToast({ tone: "success", title: "Invitación reenviada por correo" });
    await refreshScanners(eventId);
  };

  const handleCancel = async (event: Event) => {
    if (!confirm(`¿Cancelar "${event.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await eventsService.deleteEvent(event.id);
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, status: "cancelled" as const } : e))
      );
      addToast({ tone: "success", title: "Evento cancelado" });
    } catch {
      addToast({ tone: "danger", title: "Error al cancelar el evento" });
    }
  };

  const fmtMoney = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n);
  const fmtInt = (n: number) => new Intl.NumberFormat("es-AR").format(n);

  if (authLoading || loading) return <LoadingSkeleton />;

  return (
    <PageContainer className="flex flex-col gap-8 py-6 sm:py-10">
      {/* MercadoPago */}
      <MpStatusCard
        connected={mpStatus.connected}
        mpUserId={mpStatus.mpUserId}
        onConnect={handleConnectMp}
        onDisconnect={handleDisconnectMp}
        loading={mpLoading}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniKPI
          label="INGRESOS DEL MES"
          value={stats ? fmtMoney(stats.revenueThisMonth) : "—"}
          tone="success"
        />
        <MiniKPI
          label="ENTRADAS VENDIDAS"
          value={stats ? fmtInt(stats.ticketsSold) : "—"}
          tone="violet"
        />
        <MiniKPI
          label="EVENTOS ACTIVOS"
          value={stats ? fmtInt(stats.activeEvents) : "—"}
          tone="yellow"
        />
        <MiniKPI
          label="A LIQUIDAR (MP)"
          value={stats ? fmtMoney(stats.pendingPayout) : "—"}
          tone="neutral"
        />
      </div>

      {/* Mis eventos */}
      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight">Mis eventos</h1>
            <p className="mt-1 text-[13px] text-text-secondary">
              Gestioná tus eventos como organizador
            </p>
          </div>
          <Link href="/eventos/crear">
            <Button variant="primary" icon="plus">
              Crear evento
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <EmptyState
            icon="ticket"
            title="Todavía no tenés eventos"
            description="Creá tu primer evento y empezá a vender entradas."
            action={
              <Link href="/eventos/crear">
                <Button variant="primary">Crear mi primer evento</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <EventCardOrg
                key={event.id}
                event={event}
                scanners={scannersByEvent[event.id] ?? []}
                pending={pendingByEvent[event.id] ?? []}
                onInvite={(email) => handleInvite(event.id, email)}
                onRemove={(scannerId) => handleRemove(event.id, scannerId)}
                onResend={(invitationId) => handleResend(event.id, invitationId)}
                onCancel={() => handleCancel(event)}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardPageContent />
    </Suspense>
  );
}
