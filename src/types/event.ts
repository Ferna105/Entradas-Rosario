export interface Event {
  id: number;
  seller_id: number;
  name: string;
  description: string;
  location: string;
  event_date: string;
  price: number;
  capacity: number;
  image: string | null;
  status: 'draft' | 'published' | 'cancelled' | 'finished';
  marketplace_fee_percent: number;
  created_at: string;
}

export interface CreateEventData {
  name: string;
  description?: string;
  location?: string;
  event_date: string;
  price: number;
  capacity: number;
  image?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'draft' | 'published' | 'cancelled' | 'finished';
}
