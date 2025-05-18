"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";

interface EventDetailProps {
  event: Event;
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

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const { initPoint } = await eventsService.createPaymentPreference({
        eventId: event.id,
        eventName: event.name,
        price: event.price,
        quantity: 1, // Por defecto compra 1 entrada
      });
      
      window.location.href = initPoint; // Redirige a la URL de pago de MercadoPago
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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Image
          width={1000}
          height={1000}
          src={
            event.image ||
            "https://placehold.co/1200x600/CCCCCC/FFFFFF/png?text=Sin+imagen"
          }
          alt={event.name}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
          <p className="text-gray-600 mb-2">
            {formatDate(event.event_date)} - {formatTime(event.event_date)}
          </p>
          <p className="text-gray-600 mb-4">{event.location}</p>
          <p className="text-gray-700 mb-6">{event.description}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold">${event.price}</p>
              <p className="text-gray-600">
                Capacidad: {event.capacity} personas
              </p>
            </div>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              {isLoading ? "Procesando..." : "Comprar Entradas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
