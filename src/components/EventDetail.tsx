"use client";

import { FC, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";
import { Button, Card, Input, Label, PageContainer } from "@/components/ui";

interface EventDetailProps {
  event: Event;
}

interface BuyerInfo {
  email: string;
  emailConfirm: string;
  name: string;
  quantity: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const EventDetail: FC<EventDetailProps> = ({ event }) => {
  const sortedTypes = useMemo(
    () =>
      [...event.ticketTypes].sort((a, b) => a.sort_order - b.sort_order),
    [event.ticketTypes]
  );

  const hasTypes = sortedTypes.length > 0;

  const firstAvailableId = useMemo(() => {
    const t = sortedTypes.find((x) => !x.isSoldOut && x.remaining > 0);
    return t?.id ?? sortedTypes[0]?.id ?? 0;
  }, [sortedTypes]);

  const [selectedTicketTypeId, setSelectedTicketTypeId] =
    useState<number>(firstAvailableId);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    email: "",
    emailConfirm: "",
    name: "",
    quantity: 1,
  });
  const [emailMismatch, setEmailMismatch] = useState(false);

  useEffect(() => {
    setSelectedTicketTypeId(firstAvailableId);
  }, [firstAvailableId]);

  useEffect(() => {
    const t = sortedTypes.find((x) => x.id === selectedTicketTypeId);
    const m = t ? Math.max(0, t.remaining) : 0;
    if (m <= 0) return;
    setBuyerInfo((prev) =>
      prev.quantity > m ? { ...prev, quantity: m } : prev
    );
  }, [selectedTicketTypeId, sortedTypes]);

  if (!hasTypes) {
    return (
      <PageContainer className="py-6 sm:py-10">
        <Card className="p-6 text-center text-zinc-400">
          Este evento aún no tiene tipos de entrada configurados.
        </Card>
      </PageContainer>
    );
  }

  const selectedType = sortedTypes.find((t) => t.id === selectedTicketTypeId);
  const maxQty = selectedType
    ? Math.max(0, selectedType.remaining)
    : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "emailConfirm") {
      setEmailMismatch(false);
    }
    setBuyerInfo((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handlePayment = async () => {
    if (!selectedType || selectedType.isSoldOut || maxQty <= 0) return;
    const email = buyerInfo.email.trim();
    const emailConfirm = buyerInfo.emailConfirm.trim();
    if (email !== emailConfirm) {
      setEmailMismatch(true);
      return;
    }
    try {
      setIsLoading(true);
      const { initPoint } = await eventsService.createPaymentPreference({
        eventId: event.id,
        ticketTypeId: selectedTicketTypeId,
        buyerEmail: email,
        buyerName: buyerInfo.name,
        quantity: Math.min(buyerInfo.quantity, maxQty),
      });

      window.location.href = initPoint;
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Hubo un error al procesar el pago. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="py-6 sm:py-10">
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-video w-full sm:aspect-[21/9] sm:max-h-[min(420px,50vh)] sm:min-h-[240px]">
          <Image
            fill
            src={
              event.image ||
              "https://placehold.co/1200x600/27272a/a1a1aa/png?text=Sin+imagen"
            }
            alt={event.name}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1152px"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent sm:hidden" />
        </div>
        <div className="space-y-6 p-5 sm:p-8">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
              {event.name}
            </h1>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              {formatDate(event.event_date)} · {formatTime(event.event_date)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{event.location}</p>
          </div>

          <Card className="border-white/5 bg-zinc-950/50 p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
              {event.description}
            </p>
          </Card>

          <div className="space-y-3 border-t border-white/10 pt-6">
            <p className="text-sm font-medium text-zinc-300">
              Tipos de entrada
            </p>
            <ul className="space-y-2">
              {sortedTypes.map((tt) => (
                <li
                  key={tt.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-2.5 text-sm"
                >
                  <span className="font-medium text-white">{tt.name}</span>
                  <span className="text-violet-400">
                    {tt.price.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="w-full text-xs text-zinc-500 sm:w-auto sm:text-sm">
                    {tt.isSoldOut || tt.remaining <= 0 ? (
                      <span className="font-medium text-amber-500/90">
                        Agotada
                      </span>
                    ) : (
                      <>Quedan {tt.remaining} disponibles</>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                Desde{" "}
                <span className="text-lg font-bold text-violet-400">
                  {event.minPrice.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 2,
                  })}
                </span>
              </p>
            </div>

            {!showForm ? (
              <Button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full shrink-0 sm:w-auto"
                disabled={sortedTypes.every((t) => t.isSoldOut || t.remaining <= 0)}
              >
                Comprar entradas
              </Button>
            ) : (
              <div className="w-full max-w-md space-y-4 sm:ml-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePayment();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="ticketType" className="mb-1.5">
                      Tipo de entrada
                    </Label>
                    <select
                      id="ticketType"
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none focus:border-violet-500/50"
                      value={selectedTicketTypeId || ""}
                      onChange={(e) =>
                        setSelectedTicketTypeId(Number(e.target.value))
                      }
                    >
                      {sortedTypes.map((tt) => (
                        <option
                          key={tt.id}
                          value={tt.id}
                          disabled={tt.isSoldOut || tt.remaining <= 0}
                        >
                          {tt.name} —{" "}
                          {tt.price.toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                          {tt.isSoldOut || tt.remaining <= 0
                            ? " (Agotada)"
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="name" className="mb-1.5">
                      Nombre completo
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={buyerInfo.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="mb-1.5">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={buyerInfo.email}
                      onChange={handleInputChange}
                      placeholder="tucorreo@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailConfirm" className="mb-1.5">
                      Confirmar email
                    </Label>
                    <Input
                      type="email"
                      id="emailConfirm"
                      name="emailConfirm"
                      required
                      autoComplete="email"
                      value={buyerInfo.emailConfirm}
                      onChange={handleInputChange}
                      placeholder="Repetí tu correo"
                      aria-invalid={emailMismatch}
                    />
                    {emailMismatch && (
                      <p className="mt-1.5 text-sm text-red-400" role="alert">
                        Los correos no coinciden. Verificá que sean iguales.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="mb-1.5">
                      Cantidad de entradas
                    </Label>
                    <Input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min={1}
                      max={Math.max(1, maxQty)}
                      required
                      value={buyerInfo.quantity}
                      onChange={handleInputChange}
                      placeholder="1"
                      disabled={maxQty <= 0}
                    />
                  </div>
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowForm(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isLoading ||
                        maxQty <= 0 ||
                        !selectedType ||
                        selectedType.isSoldOut
                      }
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? "Procesando…" : "Continuar al pago"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default EventDetail;
