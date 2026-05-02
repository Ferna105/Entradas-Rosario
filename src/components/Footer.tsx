"use client";

import Link from "next/link";
import { Icon, PageContainer } from "@/components/ui";

const COLS = [
  {
    title: "Comprar",
    links: [
      { label: "Explorar eventos", href: "/" },
      { label: "Esta semana", href: "/#esta-semana" },
      { label: "Mis entradas", href: "/mis-entradas" },
    ],
  },
  {
    title: "Vender",
    links: [
      { label: "Crear un evento", href: "/eventos/crear" },
      { label: "Cómo funciona", href: "/nosotros" },
      { label: "Vincular MercadoPago", href: "/dashboard" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Contacto", href: "/contacto" },
      { label: "Términos", href: "/terminos" },
      { label: "Privacidad", href: "/privacidad" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-4 bg-ink-0">
      <PageContainer className="py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">

          {/* Marca */}
          <div>
            <div className="mb-4 flex items-center gap-[10px]">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-yellow-300"
                style={{ transform: "rotate(-8deg)" }}
              >
                <Icon name="flash" size={18} color="var(--violet-900)" strokeWidth={2.5} />
              </div>
              <span className="text-[18px] font-bold tracking-snug">Entradas Rosario</span>
            </div>
            <p className="mb-5 max-w-[320px] text-[14px] leading-relaxed text-text-secondary">
              Comprá entradas en segundos. Vendé las tuyas con MercadoPago. Sin vueltas.
            </p>

            {/* Redes */}
            <div className="flex gap-2">
              {(["instagram", "twitter", "music"] as const).map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-4 bg-ink-2 text-text-secondary transition-colors hover:text-text-primary"
                  aria-label={icon}
                >
                  <Icon name={icon} size={16} />
                </button>
              ))}
            </div>

            {/* MP badge */}
            <div className="mt-6 inline-flex items-center gap-[10px] rounded-full border border-ink-4 bg-ink-2 px-[14px] py-[10px] text-[12px] text-text-secondary">
              <span
                className="h-2 w-2 rounded-full bg-success"
                style={{ boxShadow: "0 0 8px var(--success)" }}
              />
              Pagos procesados por MercadoPago
            </div>
          </div>

          {/* Columnas de links */}
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                {col.title}
              </div>
              <div className="flex flex-col gap-[10px]">
                {col.links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-[13px] text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink-4 pt-6">
          <div className="text-[12px] text-text-tertiary">
            © {new Date().getFullYear()} Entradas Rosario · Hecho en Argentina 🇦🇷
          </div>
          <div className="flex gap-5 text-[12px] text-text-tertiary">
            <Link href="/terminos" className="hover:text-text-secondary transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-text-secondary transition-colors">Privacidad</Link>
            <span>ES · ARS</span>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
