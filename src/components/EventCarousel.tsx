'use client';

import { FC } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  image: string;
}

interface EventCarouselProps {
  events: Event[];
}

const EventCarousel: FC<EventCarouselProps> = ({ events }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    className: "slick-carousel"
  };

  return (
    <div className="w-full">
      <style jsx global>{`
        .slick-carousel {
          width: 100%;
        }
        .slick-slide {
          height: 400px;
        }
        .slick-dots {
          bottom: 20px;
        }
        .slick-dots li button:before {
          color: white;
        }
        .slick-prev, .slick-next {
          z-index: 10;
        }
        .slick-prev {
          left: 20px;
        }
        .slick-next {
          right: 20px;
        }
        .slick-prev:before, .slick-next:before {
          font-size: 24px;
        }
      `}</style>
      <Slider {...settings}>
        {events.map((event) => (
          <div key={event.id} className="relative h-[400px]">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-8">
                <h2 className="text-4xl font-bold mb-4">{event.name}</h2>
                <p className="text-xl mb-4">{event.date} - {event.time}</p>
                <Link 
                  href={`/eventos/${event.id}`}
                  className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                >
                  Comprar Entradas
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EventCarousel; 