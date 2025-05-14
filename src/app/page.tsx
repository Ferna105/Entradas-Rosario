import EventCarousel from '@/components/EventCarousel';
import EventList from '@/components/EventList';
import Footer from '@/components/Footer';

// Mock data - In a real application, this would come from an API
const mockEvents = [
  {
    id: '1',
    name: 'Coldplay en Rosario',
    date: '15 de Marzo, 2024',
    time: '20:00',
    image: 'https://placehold.co/1200x400/1DB954/FFFFFF/png?text=Coldplay+en+Rosario',
    venue: 'Estadio Gigante de Arroyito'
  },
  {
    id: '2',
    name: 'Metallica World Tour',
    date: '20 de Marzo, 2024',
    time: '21:00',
    image: 'https://placehold.co/1200x400/000000/FFFFFF/png?text=Metallica+World+Tour',
    venue: 'Estadio Gigante de Arroyito'
  },
  {
    id: '3',
    name: 'Taylor Swift - The Eras Tour',
    date: '25 de Marzo, 2024',
    time: '19:30',
    image: 'https://placehold.co/1200x400/FF69B4/FFFFFF/png?text=Taylor+Swift+-+The+Eras+Tour',
    venue: 'Estadio Gigante de Arroyito'
  },
  {
    id: '4',
    name: 'Los Redondos - Tributo',
    date: '30 de Marzo, 2024',
    time: '22:00',
    image: 'https://placehold.co/600x400/FF0000/FFFFFF/png?text=Los+Redondos+-+Tributo',
    venue: 'Teatro Broadway'
  },
  {
    id: '5',
    name: 'La Renga',
    date: '5 de Abril, 2024',
    time: '21:00',
    image: 'https://placehold.co/600x400/0000FF/FFFFFF/png?text=La+Renga',
    venue: 'Estadio Gigante de Arroyito'
  },
  {
    id: '6',
    name: 'Divididos',
    date: '10 de Abril, 2024',
    time: '20:30',
    image: 'https://placehold.co/600x400/FFA500/FFFFFF/png?text=Divididos',
    venue: 'Teatro Broadway'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <EventCarousel events={mockEvents.slice(0, 3)} />
        <div className="container mx-auto py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Próximos Eventos</h2>
          <EventList events={mockEvents} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
