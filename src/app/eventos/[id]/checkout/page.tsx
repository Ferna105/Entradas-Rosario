"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { eventsService } from "@/services/events";
import { Event, TicketTypePublic } from "@/types/event";
import {
  Badge,
  Button,
  Card,
  Icon,
  Input,
  PageContainer,
  Skeleton,
  Stepper,
} from "@/components/ui";

const CHECKOUT_STEPS = ["Entradas", "Datos", "Pago", "Listo"];

const GRADIENTS = [
  "linear-gradient(135deg, #7338f5 0%, #ff5470 60%, #ffd91f 100%)",
  "linear-gradient(135deg, #1a0744 0%, #7338f5 50%, #4dabff 100%)",
  "linear-gradient(135deg, #ff5470 0%, #7338f5 50%, #2e0e6e 100%)",
  "linear-gradient(135deg, #2e0e6e 0%, #7338f5 50%, #ffd91f 100%)",
  "linear-gradient(135deg, #ffd91f 0%, #ff5470 50%, #7338f5 100%)",
];
const getGradient = (id: number) => GRADIENTS[id % GRADIENTS.length];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
const formatTime = (d: string) =>
  new Date(d).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

// ── Resumen lateral ──────────────────────────────────────────────────────────
interface ResumenPanelProps {
  event: Event;
  selectedType: TicketTypePublic | undefined;
  qty: number;
  gradient: string;
}

function ResumenPanel({ event, selectedType, qty, gradient }: ResumenPanelProps) {
  const unitPrice = selectedType ? Number(selectedType.price) : 0;
  const total = unitPrice * qty;

  return (
    <div className="overflow-hidden rounded-[20px] border border-ink-4 bg-ink-2">
      {/* Thumb del evento */}
      <div className="relative h-[160px]" style={{ background: gradient }}>
        {event.image && (
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            unoptimized
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(0deg, var(--ink-2) 0%, transparent 60%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-[16px] font-bold leading-tight">{event.name}</div>
          <div className="mt-1 text-[12px] text-text-secondary">
            {formatDate(event.event_date)} · {formatTime(event.event_date)}
          </div>
          {event.location && (
            <div className="mt-1 flex items-center gap-1 text-[12px] text-text-tertiary">
              <Icon name="pin" size={12} />
              {event.location}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="text-[11px] tracking-[0.08em] text-text-tertiary">RESUMEN</div>

        {selectedType ? (
          <>
            <div className="flex items-start justify-between gap-2 text-[14px]">
              <span className="text-text-secondary">
                {selectedType.name} × {qty}
              </span>
              <span className="whitespace-nowrap font-medium">
                ${total.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="border-t border-ink-4 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold">Total</span>
                <span className="text-[22px] font-bold tracking-snug text-yellow-300">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-[13px] text-text-tertiary">
            Seleccioná un tipo de entrada para ver el resumen.
          </p>
        )}

        <p className="text-[11px] text-text-tertiary">
          Hasta 12 cuotas sin interés con tarjeta de crédito vía MercadoPago.
        </p>
        <div className="flex items-center gap-2 text-[12px] text-text-tertiary">
          <Icon name="check" size={13} />
          Pago seguro · Entradas llegan al email
        </div>
      </div>
    </div>
  );
}

// ── Checkout ────────────────────────────────────────────────────────────────
function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = params.id as string;
  const typeIdParam = Number(searchParams.get("type") || "0");
  const qtyParam = Math.min(6, Math.max(1, Number(searchParams.get("qty") || "1")));

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  // Paso 1
  const [selectedId, setSelectedId] = useState(typeIdParam);
  const [qty, setQty] = useState(qtyParam);

  // Paso 2
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Paso 3
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    eventsService
      .getEvent(eventId)
      .then(setEvent)
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [eventId, router]);

  const sortedTypes = event
    ? [...event.ticketTypes].sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const selectedType = sortedTypes.find((t) => t.id === selectedId);
  const maxQty = selectedType ? Math.max(0, selectedType.remaining) : 0;

  const step1Valid =
    !!selectedType && !selectedType.isSoldOut && qty >= 1 && qty <= maxQty;
  const step2Valid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handlePayment = async () => {
    if (!event || !selectedType) return;
    setIsPaying(true);
    setPayError("");
    try {
      const { initPoint } = await eventsService.createPaymentPreference({
        eventId: event.id,
        ticketTypeId: selectedId,
        buyerEmail: email.trim(),
        buyerName: `${firstName.trim()} ${lastName.trim()}`,
        quantity: Math.min(qty, maxQty),
      });
      window.location.href = initPoint;
    } catch {
      setPayError("Hubo un error al procesar el pago. Intentá de nuevo.");
      setIsPaying(false);
    }
  };

  if (loading) {
    return (
      <PageContainer className="py-10">
        <div className="space-y-6">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <Skeleton className="h-[340px] rounded-2xl" />
            <Skeleton className="h-[280px] rounded-2xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!event) return null;

  const gradient = getGradient(event.id);

  return (
    <PageContainer className="py-6 pb-32 lg:py-10 lg:pb-16">
      {/* Volver */}
      <Link
        href={`/eventos/${event.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-[14px] text-text-secondary transition-colors hover:text-text-primary"
      >
        <Icon name="arrowLeft" size={15} />
        Volver al evento
      </Link>

      {/* Stepper */}
      <Stepper steps={CHECKOUT_STEPS} current={step} className="mb-10" />

      {/* Layout 2 columnas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* ── Columna izquierda: contenido del paso ── */}
        <div>
          {/* ── Paso 1: Entradas ── */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.08em] text-text-tertiary">
                ELEGÍ TU ENTRADA
              </p>
              <Card className="p-5">
                <div className="flex flex-col gap-3">
                  {sortedTypes.map((tt) => {
                    const disabled = tt.isSoldOut || tt.remaining <= 0;
                    const active = selectedId === tt.id;
                    return (
                      <button
                        key={tt.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          if (!disabled) {
                            setSelectedId(tt.id);
                            setQty(1);
                          }
                        }}
                        className={[
                          "flex items-center justify-between rounded-[12px] border p-4 text-left transition-all",
                          active
                            ? "border-violet-400 bg-[rgba(139,92,255,0.1)]"
                            : "border-ink-4 bg-ink-3",
                          disabled
                            ? "cursor-not-allowed opacity-40"
                            : "cursor-pointer hover:border-violet-400/50",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-semibold">
                              {tt.name}
                            </span>
                            {!disabled && tt.remaining > 0 && tt.remaining <= 20 && (
                              <Badge tone="yellow" size="sm">
                                Quedan {tt.remaining}
                              </Badge>
                            )}
                            {disabled && (
                              <Badge tone="neutral" size="sm">
                                Agotada
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-[18px] font-bold text-yellow-300">
                          ${Number(tt.price).toLocaleString("es-AR")}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Cantidad */}
                <div className="mt-5 flex items-center justify-between border-t border-ink-4 pt-4">
                  <div>
                    <div className="text-[14px] font-medium">Cantidad</div>
                    <div className="text-[12px] text-text-tertiary">
                      Máx 6 por compra
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-ink-3 p-1">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[20px] text-text-secondary transition-colors hover:text-text-primary"
                    >
                      −
                    </button>
                    <span className="min-w-[28px] text-center text-[15px] font-semibold">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQty(Math.min(Math.min(6, maxQty), qty + 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-[20px] text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  iconRight="arrowRight"
                  disabled={!step1Valid}
                  onClick={() => setStep(1)}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* ── Paso 2: Datos del titular ── */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.08em] text-text-tertiary">
                DATOS DEL TITULAR
              </p>
              <Card className="p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                    autoFocus
                  />
                  <Input
                    label="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pérez"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@email.com"
                    hint="A este email se enviarán las entradas con el código QR."
                    wrapperClassName="sm:col-span-2"
                  />
                </div>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="md"
                  icon="arrowLeft"
                  onClick={() => setStep(0)}
                >
                  Volver
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  iconRight="arrowRight"
                  disabled={!step2Valid}
                  onClick={() => setStep(2)}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {/* ── Paso 3: Pago ── */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.08em] text-text-tertiary">
                MEDIO DE PAGO
              </p>
              <Card className="p-5 space-y-4">
                {/* Bloque MP */}
                <div className="flex items-center gap-4 rounded-[12px] border border-ink-4 bg-ink-3 p-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#009EE3]">
                    <svg viewBox="0 0 32 32" width="22" height="22" fill="white">
                      <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2zm1.5 7.5h-4A1.5 1.5 0 0 0 12 11v10a1.5 1.5 0 0 0 1.5 1.5h4A1.5 1.5 0 0 0 19 21V11a1.5 1.5 0 0 0-1.5-1.5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold">MercadoPago</div>
                    <div className="text-[13px] text-text-secondary">
                      Tarjeta, débito, efectivo y más
                    </div>
                    <div className="mt-0.5 text-[12px] text-text-tertiary">
                      Hasta 12 cuotas sin interés con tarjeta de crédito
                    </div>
                  </div>
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <Icon
                      name="check"
                      size={13}
                      color="var(--success)"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                {/* Resumen del comprador */}
                <div className="rounded-[10px] border border-ink-4 bg-ink-1 p-4">
                  <div className="mb-2 text-[11px] tracking-[0.06em] text-text-tertiary">
                    COMPRANDO COMO
                  </div>
                  <div className="text-[15px] font-semibold">
                    {firstName} {lastName}
                  </div>
                  <div className="text-[13px] text-text-secondary">{email}</div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-2 text-[12px] text-violet-400 transition-colors hover:text-violet-300"
                  >
                    Cambiar datos
                  </button>
                </div>

                {payError && (
                  <div className="rounded-[10px] border border-danger/30 bg-danger/10 px-4 py-3">
                    <p className="text-[13px] text-danger">{payError}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[12px] text-text-tertiary">
                  <Icon name="check" size={13} />
                  Pago 100% seguro · Procesado por MercadoPago
                </div>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="md"
                  icon="arrowLeft"
                  onClick={() => setStep(1)}
                >
                  Volver
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  loading={isPaying}
                  iconRight="arrowRight"
                  onClick={handlePayment}
                >
                  Ir al pago
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Columna derecha: resumen sticky (desktop) ── */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <ResumenPanel
              event={event}
              selectedType={selectedType}
              qty={qty}
              gradient={gradient}
            />
          </div>
        </div>
      </div>

      {/* Resumen mobile (debajo del contenido) */}
      <div className="mt-8 lg:hidden">
        <ResumenPanel
          event={event}
          selectedType={selectedType}
          qty={qty}
          gradient={gradient}
        />
      </div>
    </PageContainer>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="py-10">
          <div className="space-y-6">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-[340px] w-full rounded-2xl" />
          </div>
        </PageContainer>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
