"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { favoritesService } from "@/services/favorites";
import { Event } from "@/types/event";
import { EmptyState, Skeleton, Button } from "@/components/ui";
import { EventCard } from "@/components/EventCard";
import Link from "next/link";

function FavoritosSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="overflow-hidden rounded-[16px] border border-ink-4 bg-ink-2">
          <Skeleton height={180} className="rounded-none" />
          <div className="flex flex-col gap-3 p-4">
            <Skeleton height={18} width="40%" />
            <Skeleton height={22} width="80%" />
            <Skeleton height={14} width="55%" />
            <div className="mt-1 flex items-center justify-between border-t border-ink-4 pt-3">
              <div className="space-y-1">
                <Skeleton height={10} width={40} />
                <Skeleton height={22} width={80} />
              </div>
              <Skeleton height={36} width={110} rounded />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MisFavoritosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await favoritesService.getFavorites();
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    loadFavorites();
  }, [user, authLoading, router, loadFavorites]);

  if (authLoading || loading) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-6 py-10 lg:px-8">
        <div className="mb-8 space-y-2">
          <Skeleton height={40} width={240} />
          <Skeleton height={16} width={320} />
        </div>
        <FavoritosSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold tracking-snug text-text-primary">
          Mis favoritos
        </h1>
        <p className="mt-1 text-[15px] text-text-secondary">
          {events.length > 0
            ? `${events.length} evento${events.length !== 1 ? "s" : ""} guardado${events.length !== 1 ? "s" : ""}`
            : "Los eventos que guardás aparecen acá"}
        </p>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Todavía no guardaste eventos"
          description="Tocá el corazón en cualquier evento para guardarlo acá."
          action={
            <Link href="/">
              <Button variant="primary">Explorar eventos</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
