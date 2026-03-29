import { apiClient } from "./api";
import { Event, CreateEventData, UpdateEventData } from "@/types/event";

interface CreatePaymentPreferenceParams {
  eventId: number;
  ticketTypeId: number;
  buyerEmail: string;
  buyerName: string;
  quantity: number;
}

export const eventsService = {
  async getEvent(id: string): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`);
  },

  async getUpcomingEvents(): Promise<Event[]> {
    return apiClient.get<Event[]>("/events/upcoming");
  },

  async getMyEvents(): Promise<Event[]> {
    return apiClient.get<Event[]>("/events/my-events");
  },

  async createEvent(data: CreateEventData): Promise<Event> {
    const payload = {
      name: data.name,
      description: data.description,
      location: data.location,
      event_date: data.event_date,
      image: data.image,
      ticketTypes: data.ticketTypes.map((t, i) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        capacity: t.capacity,
        sortOrder: t.sortOrder ?? i,
      })),
    };
    return apiClient.post<Event>("/events", payload);
  },

  async updateEvent(id: number, data: UpdateEventData): Promise<Event> {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.description !== undefined) payload.description = data.description;
    if (data.location !== undefined) payload.location = data.location;
    if (data.event_date !== undefined) payload.event_date = data.event_date;
    if (data.image !== undefined) payload.image = data.image;
    if (data.status !== undefined) payload.status = data.status;
    if (data.ticketTypes !== undefined) {
      payload.ticketTypes = data.ticketTypes.map((t, i) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        capacity: t.capacity,
        sortOrder: t.sortOrder ?? i,
      }));
    }
    return apiClient.put<Event>(`/events/${id}`, payload);
  },

  async deleteEvent(id: number): Promise<void> {
    return apiClient.delete(`/events/${id}`);
  },

  async createPaymentPreference(
    params: CreatePaymentPreferenceParams
  ): Promise<{ initPoint: string }> {
    return apiClient.post<{ initPoint: string }>(
      "/payments/create-preference",
      params
    );
  },
};
