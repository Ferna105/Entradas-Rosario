'use client';

import { FC } from 'react';
import Link from 'next/link';

const Footer: FC = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Entradas Rosario</h3>
            <p className="text-gray-400">
              Tu plataforma de confianza para comprar entradas a los mejores eventos de Rosario.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/eventos" className="text-gray-400 hover:text-white">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-400 hover:text-white">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@entradasrosario.com</li>
              <li>Tel: (0341) 123-4567</li>
              <li>Rosario, Santa Fe</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Entradas Rosario. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 