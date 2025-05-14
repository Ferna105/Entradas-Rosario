import EventDetail from '@/components/EventDetail';
import Footer from '@/components/Footer';

// Mock data - In a real application, this would come from an API
const mockEvent = {
  id: '1',
  name: 'Coldplay en Rosario',
  date: '15 de Marzo, 2024',
  time: '20:00',
  image: 'https://placehold.co/1200x600/1DB954/FFFFFF/png?text=Coldplay+en+Rosario',
  venue: 'Estadio Gigante de Arroyito',
  availableTickets: 1500,
  price: 10
};

export interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage() {
  // En una aplicación real, aquí buscarías el evento por ID en tu API
  // const event = await fetchEvent(params.id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <EventDetail event={mockEvent} />
      </main>
      <Footer />
    </div>
  );
} 