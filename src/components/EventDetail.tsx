'use client';

import { FC, useState } from 'react';
import Image from 'next/image';

interface EventDetailProps {
  event: {
    id: string;
    name: string;
    date: string;
    time: string;
    image: string;
    venue: string;
    availableTickets: number;
    price: number;
  };
}

const EventDetail: FC<EventDetailProps> = ({ event }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          eventName: event.name,
          price: event.price,
          quantity: 1, // Por defecto compra 1 entrada
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el pago');
      }

      const data = await response.json();
      window.location.href = data.initPoint; // Redirige a la URL de pago de MercadoPago
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al procesar el pago. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del evento */}
        <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Información del evento */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">{event.venue}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-lg">{event.date} - {event.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span className="text-lg">{event.availableTickets} entradas disponibles</span>
              </div>
            </div>
          </div>

          {/* Sección de compra */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold">${event.price.toLocaleString('es-AR')}</span>
              <span className="text-sm text-gray-500">por entrada</span>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? 'Procesando...' : 'Comprar Entradas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 