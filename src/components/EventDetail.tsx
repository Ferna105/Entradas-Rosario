"use client";

import { FC, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";
import { Avatar, Badge, Button, Card, Icon } from "@/components/ui";

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

const PLACEHOLDER_ATTENDEES = ["Ana L.", "Bruno S.", "Cami D.", "Diego R.", "Eli V."];

const EventDetail: FC<EventDetailProps> = ({ event }) => {
  const sortedTypes = useMemo(
    () => [...event.ticketTypes].sort((a, b) => a.sort_order - b.sort_order),
    [event.ticketTypes]
  );
  const hasTypes = sortedTypes.length > 0;

  const firstAvailableId = useMemo(() => {
    const t = sortedTypes.find((x) => !x.isSoldOut && x.remaining > 0);
    return t?.id ?? sortedTypes[0]?.id ?? 0;
  }, [sortedTypes]);

  const [selectedId, setSelectedId] = useState<number>(firstAvailableId);
  const [qty, setQty] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [emailMismatch, setEmailMismatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { setSelectedId(firstAvailableId); }, [firstAvailableId]);

  const selected = sortedTypes.find((t) => t.id === selectedId);
  const maxQty = selected ? Math.max(0, selected.remaining) : 0;
  const total = selected ? Number(selected.price) * qty : 0;
  const isSoldOut = !hasTypes || sortedTypes.every((t) => t.isSoldOut || t.remaining <= 0);
  const gradient = getGradient(event.id);

  const handlePayment = async () => {
    if (!selected || selected.isSoldOut || maxQty <= 0) return;
    if (buyerEmail !== emailConfirm) { setEmailMismatch(true); return; }
    setIsLoading(true);
    try {
      const { initPoint } = await eventsService.createPaymentPreference({
        eventId: event.id,
        ticketTypeId: selectedId,
        buyerEmail: buyerEmail.trim(),
        buyerName: buyerName.trim(),
        quantity: Math.min(qty, maxQty),
      });
      window.location.href = initPoint;
    } catch {
      alert("Hubo un error al procesar el pago. Por favor, intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
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
        {/* Overlay degradado hacia abajo */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, var(--ink-1) 100%)" }} />

        <div className="relative mx-auto flex h-full max-w-[1180px] flex-col justify-end px-6 pb-8 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge tone="violet">Música</Badge>
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

            {/* Tipos de entrada */}
            {hasTypes && (
              <div>
                <h2 className="mb-4 text-[24px] font-semibold tracking-snug">Entradas disponibles</h2>
                <div className="flex flex-col gap-2">
                  {sortedTypes.map((tt) => (
                    <div
                      key={tt.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] border border-ink-4 bg-ink-2 px-4 py-3 text-[14px]"
                    >
                      <span className="font-medium">{tt.name}</span>
                      <span className="font-bold text-yellow-300">${Number(tt.price).toLocaleString("es-AR")}</span>
                      <span className="text-[12px] text-text-tertiary">
                        {tt.isSoldOut || tt.remaining <= 0
                          ? <span className="text-warning font-medium">Agotada</span>
                          : `Quedan ${tt.remaining}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ubicación */}
            {event.location && (
              <div>
                <h2 className="mb-4 text-[24px] font-semibold tracking-snug">Ubicación</h2>
                <Card className="overflow-hidden p-0">
                  {/* Mapa stilizado decorativo */}
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
                    <div>
                      <div className="font-semibold">{event.location}</div>
                    </div>
                    <Button variant="outline" size="sm" iconRight="arrowRight">Cómo llegar</Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Quiénes van — placeholder */}
            <div>
              <h2 className="mb-4 text-[24px] font-semibold tracking-snug">Quiénes van</h2>
              <div className="flex items-center justify-between rounded-[16px] border border-ink-4 bg-ink-2 p-5">
                <div className="flex">
                  {PLACEHOLDER_ATTENDEES.map((name, i) => (
                    <div key={name} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                      <Avatar name={name} size={42} ring="var(--ink-2)" />
                    </div>
                  ))}
                  <div
                    className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 border-ink-2 bg-ink-3 text-[12px] font-semibold text-text-secondary"
                    style={{ marginLeft: -10 }}
                  >
                    +1k
                  </div>
                </div>
                <Button variant="ghost" size="sm" iconRight="arrowRight">Ver lista</Button>
              </div>
            </div>
          </div>

          {/* ── STICKY BUY PANEL (desktop) ── */}
          <div className="hidden lg:block">
            <BuyPanel
              sortedTypes={sortedTypes}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              qty={qty}
              setQty={setQty}
              maxQty={maxQty}
              total={total}
              showForm={showForm}
              setShowForm={setShowForm}
              buyerName={buyerName}
              setBuyerName={setBuyerName}
              buyerEmail={buyerEmail}
              setBuyerEmail={setBuyerEmail}
              emailConfirm={emailConfirm}
              setEmailConfirm={setEmailConfirm}
              emailMismatch={emailMismatch}
              setEmailMismatch={setEmailMismatch}
              isLoading={isLoading}
              isSoldOut={isSoldOut}
              hasTypes={hasTypes}
              handlePayment={handlePayment}
              handleShare={handleShare}
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
            onClick={() => {
              document.querySelector("#buy-panel-mobile")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {isSoldOut ? "Agotado" : "Comprar"}
          </Button>
        </div>
      </div>

      {/* Panel de compra mobile (inline) */}
      <div id="buy-panel-mobile" className="mx-auto w-full max-w-[1180px] px-6 pb-32 lg:hidden lg:px-8">
        <BuyPanel
          sortedTypes={sortedTypes}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          qty={qty}
          setQty={setQty}
          maxQty={maxQty}
          total={total}
          showForm={showForm}
          setShowForm={setShowForm}
          buyerName={buyerName}
          setBuyerName={setBuyerName}
          buyerEmail={buyerEmail}
          setBuyerEmail={setBuyerEmail}
          emailConfirm={emailConfirm}
          setEmailConfirm={setEmailConfirm}
          emailMismatch={emailMismatch}
          setEmailMismatch={setEmailMismatch}
          isLoading={isLoading}
          isSoldOut={isSoldOut}
          hasTypes={hasTypes}
          handlePayment={handlePayment}
          handleShare={handleShare}
        />
      </div>
    </div>
  );
};

/* ── BuyPanel ── */
interface BuyPanelProps {
  sortedTypes: Event["ticketTypes"];
  selectedId: number;
  setSelectedId: (id: number) => void;
  qty: number;
  setQty: (q: number) => void;
  maxQty: number;
  total: number;
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  buyerName: string; setBuyerName: (v: string) => void;
  buyerEmail: string; setBuyerEmail: (v: string) => void;
  emailConfirm: string; setEmailConfirm: (v: string) => void;
  emailMismatch: boolean; setEmailMismatch: (v: boolean) => void;
  isLoading: boolean;
  isSoldOut: boolean;
  hasTypes: boolean;
  handlePayment: () => void;
  handleShare: () => void;
}

function BuyPanel({
  sortedTypes, selectedId, setSelectedId, qty, setQty, maxQty, total,
  showForm, setShowForm, buyerName, setBuyerName, buyerEmail, setBuyerEmail,
  emailConfirm, setEmailConfirm, emailMismatch, setEmailMismatch,
  isLoading, isSoldOut, hasTypes, handlePayment, handleShare,
}: BuyPanelProps) {
  return (
    <div className="sticky top-6 self-start space-y-3">
      <div className="rounded-[20px] border border-ink-4 bg-ink-2 p-6">
        <div className="mb-3 text-[11px] tracking-[0.08em] text-text-tertiary">ELEGÍ TU ENTRADA</div>

        {hasTypes && (
          <div className="mb-5 flex flex-col gap-[10px]">
            {sortedTypes.map((tt) => {
              const disabled = tt.isSoldOut || tt.remaining <= 0;
              const active = selectedId === tt.id;
              return (
                <button
                  key={tt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => { if (!disabled) setSelectedId(tt.id); }}
                  className={[
                    "flex items-center justify-between rounded-[12px] border p-4 text-left transition-all",
                    active ? "border-violet-400 bg-[rgba(139,92,255,0.1)]" : "border-ink-4 bg-ink-3",
                    disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-ink-5",
                  ].filter(Boolean).join(" ")}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold">{tt.name}</span>
                      {tt.remaining > 0 && tt.remaining <= 20 && (
                        <Badge tone="yellow" size="sm">Quedan {tt.remaining}</Badge>
                      )}
                      {disabled && <Badge tone="neutral" size="sm">Agotada</Badge>}
                    </div>
                  </div>
                  <div className="text-[18px] font-bold text-yellow-300">
                    ${Number(tt.price).toLocaleString("es-AR")}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Cantidad */}
        <div className="flex items-center justify-between border-y border-ink-4 py-3 mb-4">
          <div>
            <div className="text-[14px] font-medium">Cantidad</div>
            <div className="text-[12px] text-text-tertiary">Máx 6 por compra</div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-ink-3 p-1">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[18px] text-text-secondary hover:text-text-primary"
            >−</button>
            <span className="min-w-[24px] text-center text-[15px] font-semibold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty(Math.min(Math.min(6, maxQty), qty + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-white text-[18px]"
            >+</button>
          </div>
        </div>

        {/* Total */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[16px] font-semibold">Total</span>
          <span className="text-[22px] font-bold text-yellow-300 tracking-snug">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>

        {/* Form de datos */}
        {showForm && (
          <div className="mb-4 flex flex-col gap-3">
            <input
              placeholder="Tu nombre completo"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="h-[46px] w-full rounded-[12px] border border-ink-4 bg-ink-1 px-4 text-[15px] text-text-primary outline-none placeholder:text-text-tertiary focus:border-violet-400"
            />
            <input
              type="email"
              placeholder="tucorreo@email.com"
              value={buyerEmail}
              onChange={(e) => { setBuyerEmail(e.target.value); setEmailMismatch(false); }}
              className="h-[46px] w-full rounded-[12px] border border-ink-4 bg-ink-1 px-4 text-[15px] text-text-primary outline-none placeholder:text-text-tertiary focus:border-violet-400"
            />
            <input
              type="email"
              placeholder="Confirmá tu correo"
              value={emailConfirm}
              onChange={(e) => { setEmailConfirm(e.target.value); setEmailMismatch(false); }}
              className={[
                "h-[46px] w-full rounded-[12px] border bg-ink-1 px-4 text-[15px] text-text-primary outline-none placeholder:text-text-tertiary focus:border-violet-400",
                emailMismatch ? "border-danger" : "border-ink-4",
              ].join(" ")}
            />
            {emailMismatch && <p className="text-[12px] text-danger">Los correos no coinciden.</p>}
          </div>
        )}

        {/* CTA */}
        {!showForm ? (
          <Button
            variant="primary"
            size="lg"
            full
            iconRight="arrowRight"
            disabled={isSoldOut || !hasTypes}
            onClick={() => setShowForm(true)}
          >
            {isSoldOut ? "Entradas agotadas" : "Comprar con MercadoPago"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="md" onClick={() => setShowForm(false)}>Volver</Button>
            <Button
              variant="primary"
              size="lg"
              full
              loading={isLoading}
              disabled={isSoldOut || maxQty <= 0 || !buyerName.trim() || !buyerEmail.trim()}
              onClick={handlePayment}
            >
              Ir al pago
            </Button>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-2 text-[12px] text-text-tertiary">
          <Icon name="check" size={14} />
          Pago seguro · Entradas llegan al email
        </div>
      </div>

      {/* Botones secundarios */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" full icon="heart">Guardar</Button>
        <Button variant="outline" size="sm" full icon="share" onClick={handleShare}>Compartir</Button>
      </div>
    </div>
  );
}

export default EventDetail;
