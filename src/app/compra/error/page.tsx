"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, Icon, PageContainer, Skeleton } from "@/components/ui";

function CompraErrorContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event");

  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-10">
      <div className="w-full max-w-lg text-center">
        {/* Ícono de estado */}
        <div
          className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full"
          style={{
            background: "rgba(239,68,68,0.12)",
            boxShadow: "0 0 0 12px rgba(239,68,68,0.06)",
          }}
        >
          <Icon name="close" size={34} color="var(--danger)" strokeWidth={2.2} />
        </div>

        <h1 className="text-[28px] font-bold tracking-snug sm:text-[34px]">
          Error en el pago
        </h1>
        <p className="mt-3 text-[15px] text-text-secondary">
          No se pudo procesar tu pago. No se realizó ningún cargo.
        </p>
        <p className="mt-2 text-[13px] text-text-tertiary">
          Podés intentarlo nuevamente o contactarnos si el problema persiste.
        </p>

        <Card className="mt-6 p-5 text-left">
          <div className="flex gap-3">
            <Icon name="info" size={18} color="var(--text-tertiary)" className="mt-0.5 flex-shrink-0" />
            <div className="text-[13px] text-text-secondary leading-relaxed space-y-1">
              <p>Verificá que los datos de tu tarjeta sean correctos.</p>
              <p>Si el problema persiste, contactanos a través de la sección de ayuda.</p>
            </div>
          </div>
        </Card>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={eventId ? `/eventos/${eventId}` : "/"}
            className="inline-flex h-[52px] items-center justify-center rounded-xl bg-yellow-300 px-8 text-[15px] font-semibold text-text-on-yellow transition-all hover:brightness-110"
          >
            {eventId ? "Intentar de nuevo" : "Ver eventos"}
          </Link>
          <Link
            href="/contacto"
            className="inline-flex h-[52px] items-center justify-center rounded-xl border border-transparent px-8 text-[15px] font-medium text-text-primary transition-all hover:bg-ink-3"
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default function CompraErrorPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="flex min-h-[80vh] items-center justify-center py-10">
          <Skeleton className="h-[280px] w-full max-w-lg rounded-2xl" />
        </PageContainer>
      }
    >
      <CompraErrorContent />
    </Suspense>
  );
}
