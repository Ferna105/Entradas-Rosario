import { apiClient } from "./api";

export interface ScanResult {
  valid: boolean;
  message: string;
  ticket?: {
    id: number;
    buyerName: string;
    buyerEmail?: string;
    eventName: string;
  };
}

export interface EventStats {
  total: number;
  scanned: number;
  valid: number;
  cancelled: number;
}

export interface ScannerEvent {
  id: number;
  name: string;
  event_date: string;
  location: string;
  image: string;
}

export const scannerService = {
  async getMyEvents(): Promise<ScannerEvent[]> {
    return apiClient.get<ScannerEvent[]>("/scanner/my-events");
  },

  async scanTicket(qrData: string, eventId: number): Promise<ScanResult> {
    return apiClient.post<ScanResult>("/scanner/scan", { qrData, eventId });
  },

  async getEventStats(eventId: number): Promise<EventStats> {
    return apiClient.get<EventStats>(`/scanner/event/${eventId}/stats`);
  },
};
