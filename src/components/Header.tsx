import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-black text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-gray-300 transition-colors">
            Puerta de escape
          </Link>
        </div>
        <ul className="flex gap-6 text-base font-medium">
          <li>
            <Link href="/contacto" className="hover:text-gray-300 transition-colors">
              Contacto
            </Link>
          </li>
          <li>
            <Link href="/eventos" className="hover:text-gray-300 transition-colors">
              Eventos
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-gray-300 transition-colors">
              Inicio de sesión
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 