'use client';

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types/event';

interface EventListProps {
  events: Event[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EventList: FC<EventListProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48">
            <Image
              src={event.image || 'https://placehold.co/600x400/CCCCCC/FFFFFF/png?text=Sin+imagen'}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{event.name}</h3>
            <p className="text-gray-600 mb-2">
              {formatDate(event.event_date)} - {formatTime(event.event_date)}
            </p>
            <p className="text-gray-600 mb-2">{event.location}</p>
            <p className="text-gray-700 mb-4">{event.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">${event.price}</span>
              <Link
                href={`/eventos/${event.id}`}
                className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Comprar Entradas
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList; 