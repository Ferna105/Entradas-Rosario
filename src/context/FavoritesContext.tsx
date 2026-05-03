"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { favoritesService } from "@/services/favorites";

interface FavoritesContextType {
  favoriteIds: Set<number>;
  loading: boolean;
  isFavorited: (eventId: number) => boolean;
  toggle: (eventId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const events = await favoritesService.getFavorites();
      setFavoriteIds(new Set(events.map((e) => e.id)));
    } catch {
      // ignore — user still sees non-functional hearts
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorited = (eventId: number) => favoriteIds.has(eventId);

  const toggle = async (eventId: number) => {
    if (!user) return;

    const wasFavorited = favoriteIds.has(eventId);

    // optimistic update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorited) next.delete(eventId);
      else next.add(eventId);
      return next;
    });

    try {
      if (wasFavorited) {
        await favoritesService.removeFavorite(eventId);
      } else {
        await favoritesService.addFavorite(eventId);
      }
    } catch {
      // revert on error
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) next.add(eventId);
        else next.delete(eventId);
        return next;
      });
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, loading, isFavorited, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
