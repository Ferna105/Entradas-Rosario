import { apiClient } from "./api";
import { Event } from "@/types/event";

export const favoritesService = {
  async getFavorites(): Promise<Event[]> {
    return apiClient.get<Event[]>("/favorites");
  },

  async addFavorite(eventId: number): Promise<void> {
    return apiClient.post<void>(`/favorites/${eventId}`, {});
  },

  async removeFavorite(eventId: number): Promise<void> {
    return apiClient.delete(`/favorites/${eventId}`);
  },
};
