"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Event } from "@/types/event";
import { eventsService } from "@/services/events";

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
    setBuyerInfo(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
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
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{event.name}</h1>
          <p className="text-gray-800 mb-2">
            {formatDate(event.event_date)} - {formatTime(event.event_date)}
          </p>
          <p className="text-gray-800 mb-4">{event.location}</p>
          <p className="text-gray-900 mb-6">{event.description}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-bold text-black">${event.price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })}</p>
              <p className="text-gray-800">
                Capacidad: {event.capacity} personas
              </p>
            </div>
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
              >
                Comprar Entradas
              </button>
            ) : (
              <div className="w-full max-w-md">
                <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={buyerInfo.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-400 shadow-sm focus:border-2 focus:border-black focus:ring-black text-gray-900 placeholder-gray-500 bg-white py-2 px-4 text-base transition-colors duration-150"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={buyerInfo.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-400 shadow-sm focus:border-2 focus:border-black focus:ring-black text-gray-900 placeholder-gray-500 bg-white py-2 px-4 text-base transition-colors duration-150"
                      placeholder="tucorreo@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-semibold text-gray-900">
                      Cantidad de entradas
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max={event.capacity}
                      required
                      value={buyerInfo.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-400 shadow-sm focus:border-2 focus:border-black focus:ring-black text-gray-900 placeholder-gray-500 bg-white py-2 px-4 text-base transition-colors duration-150"
                      placeholder="1"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      {isLoading ? "Procesando..." : "Continuar al pago"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
