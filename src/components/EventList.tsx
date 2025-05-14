'use client';

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  image: string;
  venue: string;
}

interface EventListProps {
  events: Event[];
}

const EventList: FC<EventListProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-48">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{event.name}</h3>
            <p className="text-gray-600 mb-2">{event.date} - {event.time}</p>
            <p className="text-gray-500 mb-4">{event.venue}</p>
            <Link
              href={`/eventos/${event.id}`}
              className="block w-full text-center bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Comprar Entradas
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList; 