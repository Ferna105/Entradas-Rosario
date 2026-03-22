"use client";

import { FC } from "react";
import Slider from "react-slick";
import Link from "next/link";
import { Event } from "@/types/event";

interface EventCarouselProps {
  events: Event[];
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

const EventCarousel: FC<EventCarouselProps> = ({ events }) => {
  const settings = {
    dots: true,
    infinite: events.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: events.length > 0,
    autoplaySpeed: 5000,
    arrows: true,
    className: "slick-carousel",
  };

  if (events.length === 0) return null;

  return (
    <div className="w-full px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
        <Slider {...settings}>
          {events.map((event) => (
            <div key={event.id} className="relative outline-none">
              <div
                className="event-carousel-slide relative w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${event.image || "https://placehold.co/1200x600/27272a/a1a1aa/png?text=Sin+imagen"})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-center sm:p-10 md:justify-center md:text-left">
                  <h2 className="mb-2 text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                    {event.name}
                  </h2>
                  <p className="mb-6 text-sm text-zinc-200 sm:text-base md:text-lg">
                    {formatDate(event.event_date)} · {formatTime(event.event_date)}
                  </p>
                  <div className="flex justify-center md:justify-start">
                    <Link
                      href={`/eventos/${event.id}`}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                    >
                      Comprar entradas
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EventCarousel;
