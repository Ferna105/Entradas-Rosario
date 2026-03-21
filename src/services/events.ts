import { apiClient } from './api';
import { Event, CreateEventData, UpdateEventData } from '@/types/event';

interface CreatePaymentPreferenceParams {
  eventId: number;
  buyerEmail: string;
  buyerName: string;
  quantity: number;
}

export const eventsService = {
  async getEvent(id: string): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`);
  },

  async getUpcomingEvents(): Promise<Event[]> {
    return apiClient.get<Event[]>('/events/upcoming');
  },

  async getMyEvents(): Promise<Event[]> {
    return apiClient.get<Event[]>('/events/my-events');
  },

  async createEvent(data: CreateEventData): Promise<Event> {
    return apiClient.post<Event>('/events', data);
  },

  async updateEvent(id: number, data: UpdateEventData): Promise<Event> {
    return apiClient.put<Event>(`/events/${id}`, data);
  },

  async deleteEvent(id: number): Promise<void> {
    return apiClient.delete(`/events/${id}`);
  },

  async createPaymentPreference(params: CreatePaymentPreferenceParams): Promise<{ initPoint: string }> {
    return apiClient.post<{ initPoint: string }>('/payments/create-preference', params);
  },
};
