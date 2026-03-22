"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/types/event";
import { Card } from "@/components/ui";

interface EventListProps {
  events: Event[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
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

const EventList: FC<EventListProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden p-0 transition-shadow hover:border-white/15">
          <div className="relative aspect-video w-full">
            <Image
              src={
                event.image ||
                "https://placehold.co/600x400/27272a/a1a1aa/png?text=Sin+imagen"
              }
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div className="space-y-3 p-4 sm:p-5">
            <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">
              {event.name}
            </h3>
            <p className="text-sm text-zinc-400">
              <span className="font-medium text-zinc-300">
                {formatDate(event.event_date)}
              </span>
              <span className="text-zinc-500"> · </span>
              {formatTime(event.event_date)}
            </p>
            <p className="line-clamp-2 text-sm text-zinc-500">{event.location}</p>
            <p className="line-clamp-2 text-sm text-zinc-400">{event.description}</p>
            <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-lg font-bold text-violet-400">
                ${event.price.toLocaleString("es-AR")}
              </span>
              <Link
                href={`/eventos/${event.id}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                Ver evento
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EventList;
