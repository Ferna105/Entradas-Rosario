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

export type EventCategory =
  | "musica"
  | "trap"
  | "rock"
  | "electronica"
  | "festival"
  | "otros";

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "musica", label: "música" },
  { value: "trap", label: "trap" },
  { value: "rock", label: "rock" },
  { value: "electronica", label: "electrónica" },
  { value: "festival", label: "festival" },
  { value: "otros", label: "otros" },
];

export interface Event {
  id: number;
  seller_id: number;
  name: string;
  description: string;
  location: string;
  event_date: string;
  image: string | null;
  status: "draft" | "published" | "cancelled" | "finished";
  category: EventCategory;
  marketplace_fee_percent: number;
  show_attendees: boolean;
  created_at: string;
  minPrice: number;
  ticketTypes: TicketTypePublic[];
}

export interface PublicAttendee {
  name: string;
  initial: string;
}

export interface AttendeesResponse {
  total: number;
  attendees: PublicAttendee[];
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
  category?: EventCategory;
  show_attendees?: boolean;
  ticketTypes: TicketTypeFormRow[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: "draft" | "published" | "cancelled" | "finished";
}
