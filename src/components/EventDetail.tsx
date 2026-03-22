"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";
import { Button, Card, Input, Label, PageContainer } from "@/components/ui";

interface EventDetailProps {
  event: Event;
}

interface BuyerInfo {
  email: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    email: "",
    name: "",
    quantity: 1,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerInfo((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const { initPoint } = await eventsService.createPaymentPreference({
        eventId: event.id,
        buyerEmail: buyerInfo.email,
        buyerName: buyerInfo.name,
        quantity: buyerInfo.quantity,
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

          <div className="flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-2xl font-bold text-violet-400">
                {event.price.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Capacidad: {event.capacity} personas
              </p>
            </div>

            {!showForm ? (
              <Button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full shrink-0 sm:w-auto"
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
                      value={buyerInfo.email}
                      onChange={handleInputChange}
                      placeholder="tucorreo@email.com"
                    />
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
                      max={event.capacity}
                      required
                      value={buyerInfo.quantity}
                      onChange={handleInputChange}
                      placeholder="1"
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
                      disabled={isLoading}
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
