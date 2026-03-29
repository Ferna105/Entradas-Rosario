export interface TicketTypePublic {
  id: number;
  event_id: number;
  name: string;
  price: number;
  capacity: number;
  sort_order: number;
  sold: number;
  remaining: number;
  isSoldOut: boolean;
}

export interface Event {
  id: number;
  seller_id: number;
  name: string;
  description: string;
  location: string;
  event_date: string;
  image: string | null;
  status: "draft" | "published" | "cancelled" | "finished";
  marketplace_fee_percent: number;
  created_at: string;
  minPrice: number;
  ticketTypes: TicketTypePublic[];
}

export interface TicketTypeFormRow {
  id?: number;
  name: string;
  price: number;
  capacity: number;
  sortOrder?: number;
}

export interface CreateEventData {
  name: string;
  description?: string;
  location?: string;
  event_date: string;
  image?: string;
  ticketTypes: TicketTypeFormRow[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: "draft" | "published" | "cancelled" | "finished";
}
