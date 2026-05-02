"use client";

import Link from "next/link";
import { Card, Icon, PageContainer } from "@/components/ui";

export default function CompraPendientePage() {
  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-10">
      <div className="w-full max-w-lg text-center">
        {/* Ícono de estado */}
        <div
          className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full"
          style={{
            background: "rgba(255,217,31,0.12)",
            boxShadow: "0 0 0 12px rgba(255,217,31,0.06)",
          }}
        >
          <Icon name="clock" size={34} color="var(--yellow-300)" strokeWidth={2} />
        </div>

        <h1 className="text-[28px] font-bold tracking-snug sm:text-[34px]">
          Pago pendiente
        </h1>
        <p className="mt-3 text-[15px] text-text-secondary">
          Tu pago está siendo procesado. Te notificamos por email cuando se confirme.
        </p>
        <p className="mt-2 text-[13px] text-text-tertiary">
          Esto puede tardar unos minutos según el método de pago elegido.
        </p>

        <Card className="mt-6 p-5 text-left">
          <div className="flex gap-3">
            <Icon name="info" size={18} color="var(--text-tertiary)" className="mt-0.5 flex-shrink-0" />
            <div className="text-[13px] text-text-secondary leading-relaxed space-y-1">
              <p>No cerrés esta pestaña hasta recibir la confirmación por email.</p>
              <p>Si el pago fue aprobado, las entradas llegarán a tu correo en los próximos minutos.</p>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/mis-entradas"
            className="inline-flex h-[52px] items-center justify-center rounded-xl bg-yellow-300 px-8 text-[15px] font-semibold text-text-on-yellow transition-all hover:brightness-110"
          >
            Ver mis entradas
          </Link>
          <Link
            href="/"
            className="inline-flex h-[52px] items-center justify-center rounded-xl border border-transparent px-8 text-[15px] font-medium text-text-primary transition-all hover:bg-ink-3"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
