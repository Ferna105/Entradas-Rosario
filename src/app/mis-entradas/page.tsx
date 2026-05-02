"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ticketsService, MyEventSummary } from "@/services/tickets";
import { Button, EmptyState, PageContainer, Skeleton, Tabs } from "@/components/ui";
import { UpcomingTicketCard } from "@/components/UpcomingTicketCard";

function isPast(dateString: string) {
  return new Date(dateString).getTime() < Date.now();
}

function MisEntradasSkeleton() {
  return (
    <PageContainer className="py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton height={40} width={220} />
          <Skeleton height={16} width={300} />
        </div>
        <Skeleton height={38} width={200} className="hidden sm:block" />
      </div>
      <div className="flex flex-col gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-[20px] border border-ink-4">
            <div className="grid grid-cols-[200px_1fr_auto] gap-6 p-5">
              <Skeleton height={130} />
              <div className="space-y-3">
                <Skeleton height={16} width="40%" />
                <Skeleton height={24} width="80%" />
                <Skeleton height={14} width="60%" />
              </div>
              <Skeleton height={52} width={140} />
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

export default function MisEntradasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<MyEventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.type !== "buyer") { router.push("/"); return; }

    ticketsService.getMyEvents()
      .then(setEvents)
      .catch(() => setError("No se pudieron cargar tus entradas."))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) return <MisEntradasSkeleton />;

  const upcoming = events.filter((e) => !isPast(e.event_date));
  const past = events.filter((e) => isPast(e.event_date));
  const shown = tab === "upcoming" ? upcoming : past;

  return (
    <PageContainer className="py-10 pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-bold tracking-tight max-sm:text-[28px]">Mis entradas</h1>
          <p className="mt-[6px] text-text-secondary">
            Mostrá el QR en la puerta y entrás directo.
          </p>
        </div>
        <Tabs
          variant="pills"
          value={tab}
          onChange={(v) => setTab(v as "upcoming" | "past")}
          items={[
            { value: "upcoming", label: `Próximas${upcoming.length ? ` (${upcoming.length})` : ""}` },
            { value: "past", label: "Pasadas" },
          ]}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-[12px] border border-danger/30 bg-danger-bg px-4 py-3 text-[14px] text-danger" role="alert">
          {error}
        </div>
      )}

      {/* Contenido */}
      {shown.length === 0 ? (
        <EmptyState
          icon="ticket"
          title={tab === "upcoming" ? "No tenés entradas próximas" : "No tenés entradas pasadas"}
          description={
            tab === "upcoming"
              ? "Cuando comprés entradas para un evento aparecerán acá."
              : "Los eventos que ya pasaron aparecerán acá."
          }
          action={
            tab === "upcoming" ? (
              <Link href="/">
                <Button variant="primary" size="md" iconRight="arrowRight">
                  Explorar eventos
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="flex flex-col gap-6">
          {shown.map((summary) => (
            <UpcomingTicketCard key={summary.id} summary={summary} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
