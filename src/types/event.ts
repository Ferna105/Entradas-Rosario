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
  created_at: string;
}
