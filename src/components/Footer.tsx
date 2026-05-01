"use client";

import { FC } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/ui";

const Footer: FC = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-900 py-10 sm:py-12">
      <PageContainer>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">EventoAbierto</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              Comprá entradas en segundos. Vendé las tuyas con MercadoPago. Sin vueltas.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Enlaces rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-zinc-400 transition-colors hover:text-violet-400"
                >
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-sm text-zinc-400 transition-colors hover:text-violet-400"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-zinc-400 transition-colors hover:text-violet-400"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terminos"
                  className="text-sm text-zinc-400 transition-colors hover:text-violet-400"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-sm text-zinc-400 transition-colors hover:text-violet-400"
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                Email:{" "}
                <a
                  href="mailto:rosario.entradas.ok@gmail.com"
                  className="text-violet-400 transition-colors hover:text-violet-300"
                >
                  rosario.entradas.ok@gmail.com
                </a>
              </li>
              <li>
                Tel:{" "}
                <a
                  href="tel:+543413092012"
                  className="text-violet-400 transition-colors hover:text-violet-300"
                >
                  +54 341 309-2012
                </a>
              </li>
              <li>Rosario, Santa Fe</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} EventoAbierto. Todos los derechos
            reservados.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
