"use client";

import { FC, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AttendeesResponse,
  Event,
  EVENT_CATEGORIES,
  EventCategory,
} from "@/types/event";
import { Avatar, Badge, Button, Card, Icon, useToast } from "@/components/ui";
import { eventsService } from "@/services/events";
import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";

interface EventDetailProps {
  event: Event;
}

const GRADIENTS = [
  "linear-gradient(135deg, #7338f5 0%, #ff5470 60%, #ffd91f 100%)",
  "linear-gradient(135deg, #1a0744 0%, #7338f5 50%, #4dabff 100%)",
  "linear-gradient(135deg, #ff5470 0%, #7338f5 50%, #2e0e6e 100%)",
  "linear-gradient(135deg, #2e0e6e 0%, #7338f5 50%, #ffd91f 100%)",
  "linear-gradient(135deg, #ffd91f 0%, #ff5470 50%, #7338f5 100%)",
];
const getGradient = (id: number) => GRADIENTS[id % GRADIENTS.length];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
function formatCategory(category: EventCategory) {
  return EVENT_CATEGORIES.find((c) => c.value === category)?.label || category;
}

function formatAttendee(name: string, initial: string) {
  return initial ? `${name} ${initial}` : name;
}

const EventDetail: FC<EventDetailProps> = ({ event }) => {
  const sortedTypes = useMemo(
    () => [...event.ticketTypes].sort((a, b) => a.sort_order - b.sort_order),
    [event.ticketTypes]
  );
  const hasTypes = sortedTypes.length > 0;
  const isSoldOut = !hasTypes || sortedTypes.every((t) => t.isSoldOut || t.remaining <= 0);
  const gradient = getGradient(event.id);

  const firstAvailableId = useMemo(() => {
    const t = sortedTypes.find((x) => !x.isSoldOut && x.remaining > 0);
    return t?.id ?? sortedTypes[0]?.id ?? 0;
  }, [sortedTypes]);

  const router = useRouter();
  const { isFavorited, toggle } = useFavorites();
  const { user } = useAuth();
  const { addToast } = useToast();
  const favorited = isFavorited(event.id);

  const [attendees, setAttendees] = useState<AttendeesResponse | null>(null);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  useEffect(() => {
    if (!event.show_attendees) return;
    let cancelled = false;
    setAttendeesLoading(true);
    eventsService
      .getAttendees(event.id)
      .then((res) => {
        if (!cancelled) setAttendees(res);
      })
      .catch(() => {
        if (!cancelled) setAttendees({ total: 0, attendees: [] });
      })
      .finally(() => {
        if (!cancelled) setAttendeesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [event.id, event.show_attendees]);

  const handleCheckout = () => {
    router.push(`/eventos/${event.id}/checkout?type=${firstAvailableId}&qty=1`);
  };

  const handleFavorite = async () => {
    if (!user) {
      addToast({ title: "Iniciá sesión para guardar favoritos", tone: "info" });
      return;
    }
    await toggle(event.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.name, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-col">
      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(280px, 45vw, 420px)", background: gradient }}
      >
        {event.image && (
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, var(--ink-1) 100%)" }} />

        <div className="relative mx-auto flex h-full max-w-[1180px] flex-col justify-end px-6 pb-8 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge tone="violet">{formatCategory(event.category)}</Badge>
            <Badge tone="yellow" icon="flame">Trending</Badge>
          </div>
          <h1 className="text-[clamp(28px,5vw,64px)] font-bold leading-[1.0] tracking-tight text-white max-w-[800px]">
            {event.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-[15px] text-white/85">
            <span className="flex items-center gap-2"><Icon name="calendar" size={18} />{formatDate(event.event_date)} · {formatTime(event.event_date)}</span>
            {event.location && <span className="flex items-center gap-2"><Icon name="pin" size={18} />{event.location}</span>}
            <span className="flex items-center gap-2"><Icon name="user" size={18} />+1k confirmados</span>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO ── */}
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 pt-8 lg:grid-cols-[1fr_400px]">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="space-y-8">
            {/* Organizador */}
            <div className="flex items-center gap-4 rounded-[16px] border border-ink-4 bg-ink-2 p-5">
              <Avatar name="Organizador" size={48} ring="var(--violet-500)" />
              <div className="flex-1">
                <div className="text-[11px] tracking-[0.08em] text-text-tertiary">ORGANIZA</div>
                <div className="mt-[2px] text-[16px] font-semibold">Organizador del evento</div>
                <div className="text-[12px] text-text-secondary">Eventos publicados · MercadoPago vinculado</div>
              </div>
              <Button variant="outline" size="sm">Seguir</Button>
            </div>

            {/* Descripción */}
            {event.description && (
              <div>
                <h2 className="mb-3 text-[24px] font-semibold tracking-snug">Sobre el evento</h2>
                <p className="text-[15px] leading-[1.7] text-text-secondary">{event.description}</p>
              </div>
            )}

            {/* Ubicación */}
            {event.location && (
              <div>
                <h2 className="mb-4 text-[24px] font-semibold tracking-snug">Ubicación</h2>
                <Card className="overflow-hidden p-0">
                  <div className="relative flex h-[180px] items-center justify-center bg-ink-3">
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
                      <g stroke="var(--ink-4)" fill="none" strokeWidth="1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <line key={`h${i}`} x1="0" y1={i * 20} x2="100%" y2={i * 20} />
                        ))}
                        {Array.from({ length: 20 }).map((_, i) => (
                          <line key={`v${i}`} x1={i * 22} y1="0" x2={i * 22} y2="100%" />
                        ))}
                      </g>
                      <path d="M0 80 Q200 60 400 100 T800 90" stroke="var(--violet-500)" strokeWidth="2" fill="none" opacity="0.4" />
                    </svg>
                    <div className="relative flex flex-col items-center gap-2">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-300"
                        style={{ boxShadow: "0 0 0 8px rgba(255,217,31,0.2), 0 0 0 16px rgba(255,217,31,0.1)" }}
                      >
                        <Icon name="pin" size={22} color="var(--violet-900)" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="font-semibold">{event.location}</div>
                    <Button variant="outline" size="sm" iconRight="arrowRight">Cómo llegar</Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Quiénes van — opcional, configurable por el organizador */}
            {event.show_attendees && (
              <AttendeesBlock
                loading={attendeesLoading}
                data={attendees}
              />
            )}
          </div>

          {/* ── PANEL LATERAL (desktop) ── */}
          <div className="hidden lg:block">
            <TicketsPanel
              sortedTypes={sortedTypes}
              isSoldOut={isSoldOut}
              hasTypes={hasTypes}
              onCheckout={handleCheckout}
              handleShare={handleShare}
              favorited={favorited}
              onToggleFavorite={handleFavorite}
            />
          </div>
        </div>
      </div>

      {/* ── STICKY BOTTOM BAR (mobile) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-4 bg-ink-1/95 backdrop-blur-md px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex-1">
            <div className="text-[11px] text-text-tertiary">DESDE</div>
            <div className="text-[22px] font-bold text-yellow-300 tracking-snug">
              ${event.minPrice.toLocaleString("es-AR")}
            </div>
          </div>
          <Button
            variant="primary"
            size="lg"
            iconRight="arrowRight"
            disabled={isSoldOut}
            onClick={() =>
              document.querySelector("#tickets-panel-mobile")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {isSoldOut ? "Agotado" : "Ver entradas"}
          </Button>
        </div>
      </div>

      {/* ── PANEL DE ENTRADAS mobile (inline) ── */}
      <div id="tickets-panel-mobile" className="mx-auto w-full max-w-[1180px] px-6 pb-32 lg:hidden lg:px-8">
        <TicketsPanel
          sortedTypes={sortedTypes}
          isSoldOut={isSoldOut}
          hasTypes={hasTypes}
          onCheckout={handleCheckout}
          handleShare={handleShare}
          favorited={favorited}
          onToggleFavorite={handleFavorite}
        />
      </div>
    </div>
  );
};

/* ── TicketsPanel ────────────────────────────────────────────────────────── */
interface TicketsPanelProps {
  sortedTypes: Event["ticketTypes"];
  isSoldOut: boolean;
  hasTypes: boolean;
  onCheckout: () => void;
  handleShare: () => void;
  favorited: boolean;
  onToggleFavorite: () => void;
}

function TicketsPanel({ sortedTypes, isSoldOut, hasTypes, onCheckout, handleShare, favorited, onToggleFavorite }: TicketsPanelProps) {
  return (
    <div className="sticky top-6 self-start space-y-3">
      <div className="rounded-[20px] border border-ink-4 bg-ink-2 p-6">
        <div className="mb-4 text-[11px] tracking-[0.08em] text-text-tertiary">ENTRADAS DISPONIBLES</div>

        {hasTypes ? (
          <div className="mb-5 flex flex-col gap-2">
            {sortedTypes.map((tt) => {
              const soldOut = tt.isSoldOut || tt.remaining <= 0;
              return (
                <div
                  key={tt.id}
                  className={[
                    "flex items-center justify-between rounded-[12px] border border-ink-4 bg-ink-3 px-4 py-3",
                    soldOut ? "opacity-50" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[14px] font-semibold truncate">{tt.name}</span>
                    {soldOut ? (
                      <Badge tone="neutral" size="sm">Agotada</Badge>
                    ) : tt.remaining > 0 && tt.remaining <= 20 ? (
                      <Badge tone="yellow" size="sm">Quedan {tt.remaining}</Badge>
                    ) : null}
                  </div>
                  <span className={[
                    "ml-3 flex-shrink-0 text-[17px] font-bold",
                    soldOut ? "text-text-tertiary" : "text-yellow-300",
                  ].join(" ")}>
                    ${Number(tt.price).toLocaleString("es-AR")}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mb-5 text-[14px] text-text-tertiary">
            No hay entradas disponibles para este evento.
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          full
          iconRight="arrowRight"
          disabled={isSoldOut || !hasTypes}
          onClick={onCheckout}
        >
          {isSoldOut ? "Entradas agotadas" : "Comprar entradas"}
        </Button>

        <div className="mt-3 flex items-center justify-center gap-2 text-[12px] text-text-tertiary">
          <Icon name="check" size={14} />
          Pago seguro · Entradas llegan al email
        </div>
      </div>

      {/* Acciones secundarias */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          full
          icon="heart"
          onClick={onToggleFavorite}
          className={favorited ? "text-danger" : ""}
        >
          {favorited ? "Guardado" : "Guardar"}
        </Button>
        <Button variant="outline" size="sm" full icon="share" onClick={handleShare}>Compartir</Button>
      </div>
    </div>
  );
}

/* ── AttendeesBlock ──────────────────────────────────────────────────────── */
const MAX_PREVIEW = 5;

interface AttendeesBlockProps {
  loading: boolean;
  data: AttendeesResponse | null;
}

function AttendeesBlock({ loading, data }: AttendeesBlockProps) {
  const [showAll, setShowAll] = useState(false);
  const list = data?.attendees ?? [];
  const total = data?.total ?? 0;
  const preview = showAll ? list : list.slice(0, MAX_PREVIEW);
  const remaining = Math.max(0, list.length - MAX_PREVIEW);

  return (
    <div>
      <h2 className="mb-4 text-[24px] font-semibold tracking-snug">
        Quiénes van
      </h2>
      <div className="rounded-[16px] border border-ink-4 bg-ink-2 p-5">
        {loading ? (
          <p className="text-[13px] text-text-tertiary">Cargando asistentes…</p>
        ) : list.length === 0 ? (
          <p className="text-[13px] text-text-tertiary">
            Todavía nadie confirmó. Sé el primero en sumarte.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap">
                {preview.map((a, i) => (
                  <div
                    key={`${a.name}-${i}`}
                    style={{ marginLeft: i === 0 ? 0 : -10 }}
                    title={formatAttendee(a.name, a.initial)}
                  >
                    <Avatar
                      name={formatAttendee(a.name, a.initial)}
                      size={42}
                      ring="var(--ink-2)"
                    />
                  </div>
                ))}
                {!showAll && remaining > 0 && (
                  <div
                    className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 border-ink-2 bg-ink-3 text-[12px] font-semibold text-text-secondary"
                    style={{ marginLeft: -10 }}
                  >
                    +{remaining}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-[20px] font-bold tracking-snug text-yellow-300">
                  {total.toLocaleString("es-AR")}
                </div>
                <div className="text-[11px] uppercase tracking-[0.06em] text-text-tertiary">
                  Confirmados
                </div>
              </div>
            </div>
            {list.length > MAX_PREVIEW && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {showAll &&
                  list.map((a, i) => (
                    <Badge key={`tag-${i}`} tone="neutral" size="sm">
                      {formatAttendee(a.name, a.initial)}
                    </Badge>
                  ))}
                <Button
                  variant="ghost"
                  size="sm"
                  iconRight={showAll ? undefined : "arrowRight"}
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? "Ocultar lista" : "Ver lista"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EventDetail;
