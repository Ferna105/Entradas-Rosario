"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Event, EVENT_CATEGORIES, EventCategory } from "@/types/event";
import { Badge, Icon } from "@/components/ui";

const GRADIENTS = [
  "linear-gradient(135deg, #7338f5 0%, #ff5470 60%, #ffd91f 100%)",
  "linear-gradient(135deg, #1a0744 0%, #7338f5 50%, #4dabff 100%)",
  "linear-gradient(135deg, #ff5470 0%, #7338f5 50%, #2e0e6e 100%)",
  "linear-gradient(135deg, #2e0e6e 0%, #7338f5 50%, #ffd91f 100%)",
  "linear-gradient(135deg, #ffd91f 0%, #ff5470 50%, #7338f5 100%)",
  "linear-gradient(135deg, #4316a3 0%, #ff5470 60%, #ffb547 100%)",
];

function getGradient(id: number) {
  return GRADIENTS[id % GRADIENTS.length];
}

function formatDay(d: string) {
  return String(new Date(d).getDate()).padStart(2, "0");
}

function formatMonth(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { month: "short" }).toUpperCase();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCategory(category: EventCategory) {
  return EVENT_CATEGORIES.find((c) => c.value === category)?.label || category;
}

interface EventCardProps {
  event: Event;
  variant?: "default" | "wide";
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const [hovered, setHovered] = useState(false);
  const gradient = getGradient(event.id);
  const day = formatDay(event.event_date);
  const month = formatMonth(event.event_date);

  if (variant === "wide") {
    return (
      <Link href={`/eventos/${event.id}`} className="block">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={[
            "grid grid-cols-[200px_1fr_auto] gap-5 rounded-[16px] border p-4",
            "bg-ink-2 transition-all duration-200 cursor-pointer",
            hovered ? "border-ink-5 -translate-y-0.5" : "border-ink-4",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className="relative h-[140px] overflow-hidden rounded-[10px]"
            style={{ background: gradient }}
          >
            {event.image && (
              <Image src={event.image} alt={event.name} fill className="object-cover" unoptimized />
            )}
          </div>

          <div className="flex flex-col justify-center gap-2">
            <div className="flex gap-2">
              <Badge tone="violet" size="sm">Música</Badge>
            </div>
            <h3 className="text-[22px] font-semibold leading-[1.15] tracking-snug">{event.name}</h3>
            <div className="flex gap-4 text-[13px] text-text-secondary mt-1">
              <span className="flex items-center gap-[6px]">
                <Icon name="calendar" size={14} />
                {formatDate(event.event_date)}
              </span>
              {event.location && (
                <span className="flex items-center gap-[6px]">
                  <Icon name="pin" size={14} />
                  {event.location}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center items-end gap-2">
            <span className="text-[11px] text-text-tertiary tracking-[0.08em]">DESDE</span>
            <span className="text-[24px] font-bold text-yellow-300 tracking-snug">
              ${event.minPrice.toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/eventos/${event.id}`} className="block">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={[
          "overflow-hidden rounded-[16px] border bg-ink-2 cursor-pointer",
          "transition-all duration-200",
          hovered
            ? "border-violet-500 -translate-y-1 shadow-[0_20px_40px_-20px_rgba(115,56,245,0.5)]"
            : "border-ink-4",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Image area */}
        <div
          className="relative h-[180px] overflow-hidden"
          style={{ background: gradient }}
        >
          {event.image && (
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          )}

          {/* Heart button */}
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-text-secondary hover:text-danger transition-colors"
            aria-label="Guardar evento"
          >
            <Icon name="heart" size={16} />
          </button>

          {/* Date overlay */}
          <div className="absolute bottom-3 left-3 flex flex-col rounded-[10px] bg-black/70 backdrop-blur-md px-3 py-2">
            <span className="text-[22px] font-bold text-white leading-none">{day}</span>
            <span className="text-[11px] text-white/80 uppercase tracking-[0.1em]">{month}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[10px] p-4">
          <Badge tone="violet" size="sm">{formatCategory(event.category)}</Badge>
          <h3 className="text-[17px] font-semibold leading-[1.2] tracking-snug">{event.name}</h3>
          {event.location && (
            <div className="flex items-center gap-[6px] text-[13px] text-text-secondary">
              <Icon name="pin" size={14} />
              {event.location}
            </div>
          )}
          <div className="mt-1 flex items-center justify-between border-t border-ink-4 pt-3">
            <div>
              <div className="text-[10px] text-text-tertiary tracking-[0.08em]">DESDE</div>
              <div className="text-[18px] font-bold text-yellow-300 tracking-snug">
                ${event.minPrice.toLocaleString("es-AR")}
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-[14px] py-[8px] text-[13px] font-semibold text-text-on-yellow">
              Comprar
              <Icon name="arrowRight" size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
