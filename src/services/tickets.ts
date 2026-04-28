import { apiClient } from "./api";

export interface MyEventSummary {
  id: number;
  name: string;
  location: string | null;
  event_date: string;
  image: string | null;
  ticketCount: number;
}

export interface MyEventTicket {
  id: number;
  qr_code: string;
  qr_data: string;
  status: string;
  scanned_at: string | null;
  ticket_type_name: string | null;
  purchase_id: number;
  buyer_name: string | null;
}

export interface MyEventTickets {
  event: {
    id: number;
    name: string;
    description: string | null;
    location: string | null;
    event_date: string;
    image: string | null;
  };
  tickets: MyEventTicket[];
}

export const ticketsService = {
  async getMyEvents(): Promise<MyEventSummary[]> {
    return apiClient.get<MyEventSummary[]>("/tickets/my-tickets/events");
  },

  async getMyEventTickets(eventId: number): Promise<MyEventTickets> {
    return apiClient.get<MyEventTickets>(
      `/tickets/my-tickets/event/${eventId}`
    );
  },
};
