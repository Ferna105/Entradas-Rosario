"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventList from "@/components/EventList";
import { Ticket } from "@/components/Ticket";
import { Badge, Button, EmptyState, Icon, PageContainer, Skeleton } from "@/components/ui";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";

const CATEGORIES = ["todos", "música", "trap", "rock", "electrónica", "festival"];

const PLACEHOLDER_TICKETS = [
  { title: "Festival Sónico 2026", venue: "Costanera Sur · CABA", date: "Sáb 1 Nov · 14:00", type: "VIP", code: "EVA-7H2K9P", holder: "Vos" },
  { title: "Bizarrap Sessions Live", venue: "Tecnópolis · CABA", date: "Sáb 27 Sep · 22:00", type: "GENERAL", code: "EVA-X4LM02", holder: "Vos" },
];

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-[28px] font-bold tracking-snug">{value}</div>
      <div className="text-[13px] text-text-tertiary">{label}</div>
    </div>
  );
}

function HomeSkeletons() {
  return (
    <PageContainer className="py-12">
      <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Skeleton height={24} width={200} />
          <Skeleton height={80} width="90%" />
          <Skeleton height={20} width="70%" />
          <Skeleton height={20} width="60%" />
          <div className="flex gap-3 pt-2">
            <Skeleton height={52} width={180} />
            <Skeleton height={52} width={160} />
          </div>
        </div>
        <Skeleton height={420} className="hidden lg:block" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden rounded-[16px] border border-ink-4">
            <Skeleton height={180} className="rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton height={14} width="40%" />
              <Skeleton height={20} width="80%" />
              <Skeleton height={14} width="60%" />
              <Skeleton height={42} />
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    eventsService.getUpcomingEvents()
      .then(setEvents)
      .catch(() => setError("No se pudieron cargar los eventos."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    const matchesSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || (e.location ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === "todos" || e.name.toLowerCase().includes(filter);
    return matchesSearch && matchesCategory;
  });

  if (loading) return <HomeSkeletons />;

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16 lg:px-8 lg:pt-20">
        {/* Blobs decorativos */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(115,56,245,0.5), transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-[400px] w-[400px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(255,217,31,0.3), transparent 70%)", filter: "blur(40px)" }}
        />

        <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Texto */}
          <div>
            <Badge tone="yellow" icon="sparkle">Nuevo · vendé tus propias entradas</Badge>

            <h1 className="mt-5 text-[clamp(42px,7vw,76px)] font-bold leading-[0.98] tracking-tight">
              La fiesta<br />empieza<br />con un{" "}
              <em className="not-italic text-yellow-300">click.</em>
            </h1>

            <p className="mt-4 max-w-[460px] text-[18px] leading-relaxed text-text-secondary">
              Comprá entradas en segundos, o creá tu evento y empezá a vender hoy mismo. Sin vueltas, con MercadoPago.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" variant="primary" iconRight="arrowRight">
                Explorar eventos
              </Button>
              <Link href="/eventos/crear">
                <Button size="lg" variant="outline" icon="plus">
                  Crear mi evento
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 flex gap-8 border-t border-ink-4 pt-7">
              <StatItem value="2.4k+" label="Eventos publicados" />
              <StatItem value="180k" label="Entradas vendidas" />
              <StatItem value="6%" label="Comisión, sin sorpresas" />
            </div>
          </div>

          {/* Tickets flotantes decorativos */}
          <div className="relative hidden h-[460px] lg:block">
            <div className="absolute right-0 top-10" style={{ transform: "rotate(-6deg)", transformOrigin: "center" }}>
              <Ticket event={PLACEHOLDER_TICKETS[0]} ticketType={PLACEHOLDER_TICKETS[0].type} code={PLACEHOLDER_TICKETS[0].code} holder={PLACEHOLDER_TICKETS[0].holder} />
            </div>
            <div className="absolute bottom-0 left-0 opacity-60" style={{ transform: "rotate(4deg)", transformOrigin: "center" }}>
              <Ticket event={PLACEHOLDER_TICKETS[1]} ticketType={PLACEHOLDER_TICKETS[1].type} code={PLACEHOLDER_TICKETS[1].code} holder={PLACEHOLDER_TICKETS[1].holder} />
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH + FILTROS + GRID ── */}
      <PageContainer className="pb-20">
        {/* Search bar segmentada */}
        <div className="mb-8 overflow-hidden rounded-full border border-ink-4 bg-ink-2 p-2">
          <div className="flex flex-col gap-0 sm:grid sm:grid-cols-[1.5fr_1px_1fr_1px_1fr_auto] sm:items-center">
            <div className="flex items-center gap-3 px-5 py-3 sm:py-0">
              <Icon name="search" size={18} className="shrink-0 text-text-tertiary" />
              <input
                placeholder="¿A qué evento querés ir?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-none bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-tertiary"
              />
            </div>
            <div className="hidden h-6 w-px bg-ink-4 sm:block" />
            <div className="flex items-center gap-3 border-t border-ink-4 px-5 py-3 sm:border-none sm:py-0">
              <Icon name="pin" size={18} className="shrink-0 text-text-tertiary" />
              <span className="text-[14px] text-text-secondary">Buenos Aires</span>
            </div>
            <div className="hidden h-6 w-px bg-ink-4 sm:block" />
            <div className="flex items-center gap-3 border-t border-ink-4 px-5 py-3 sm:border-none sm:py-0">
              <Icon name="calendar" size={18} className="shrink-0 text-text-tertiary" />
              <span className="text-[14px] text-text-secondary">Este mes</span>
            </div>
            <div className="px-2 pt-2 sm:pt-0">
              <Button variant="primary" size="md" className="w-full sm:w-auto">Buscar</Button>
            </div>
          </div>
        </div>

        {/* Header sección + filtros */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4" id="esta-semana">
          <h2 className="text-[32px] font-semibold tracking-snug max-sm:text-[24px]">
            Lo que se viene
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={[
                  "rounded-full border px-[14px] py-2 text-[13px] font-medium capitalize transition-all",
                  filter === cat
                    ? "border-violet-400 bg-[rgba(139,92,255,0.15)] text-violet-200"
                    : "border-ink-4 bg-ink-2 text-text-secondary hover:border-ink-5",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de eventos */}
        {error ? (
          <EmptyState
            icon="info"
            title="No se pudieron cargar los eventos"
            description="Revisá tu conexión e intentá de nuevo."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="Sin resultados"
            description="Probá con otro término o cambiá los filtros."
            action={
              <Button variant="outline" size="sm" onClick={() => { setFilter("todos"); setSearch(""); }}>
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <EventList events={filtered} />
        )}
      </PageContainer>

      {/* ── CTA ORGANIZADORES ── */}
      <section className="px-6 pb-20 lg:px-8">
        <div
          className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-8 overflow-hidden rounded-[24px] p-10 sm:p-12 lg:grid-cols-[1fr_auto]"
          style={{ background: "linear-gradient(135deg, var(--violet-900), var(--violet-700))" }}
        >
          {/* Blob amarillo decorativo */}
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-[300px] w-[300px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(255,217,31,0.4), transparent 70%)", filter: "blur(40px)" }}
          />
          <div className="relative">
            <Badge tone="yellow" icon="flame">Organizadores</Badge>
            <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-bold leading-[1.05] tracking-tight">
              Tu evento, tus reglas.<br />Tu plata, en MercadoPago.
            </h2>
            <p className="mt-3 max-w-[580px] text-[16px] leading-relaxed text-white/75">
              Vinculás tu cuenta, publicás el evento, y la guita cae directo en tu MP cuando alguien compra. Nosotros nos quedamos con un 6%, listo.
            </p>
          </div>
          <div className="relative flex flex-col gap-2">
            <Link href="/registro">
              <Button variant="primary" size="lg" iconRight="arrowRight" full>
                Empezar a vender
              </Button>
            </Link>
            <Link href="/nosotros">
              <Button variant="ghost" size="md" full>
                Ver cómo funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
