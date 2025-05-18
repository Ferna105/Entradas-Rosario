import { apiClient } from './api';
import { Event } from '@/types/event';

interface CreatePaymentPreferenceParams {
  eventId: number;
  eventName: string;
  price: number;
  quantity: number;
}

export const eventsService = {
  async getEvent(id: string): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`);
  },

  async getUpcomingEvents(): Promise<Event[]> {
    return apiClient.get<Event[]>('/events/upcoming');
  },

  async createPaymentPreference(params: CreatePaymentPreferenceParams): Promise<{ initPoint: string }> {
    return apiClient.post<{ initPoint: string }>('/payments/create-preference', params);
  }
}; 