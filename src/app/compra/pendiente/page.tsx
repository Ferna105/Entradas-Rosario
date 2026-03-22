"use client";

import Link from "next/link";
import { Card, PageContainer } from "@/components/ui";

export default function CompraPendientePage() {
  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-10">
      <div className="w-full max-w-lg text-center">
        <Card className="p-8 sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-500/30">
            <svg
              className="h-10 w-10 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="mb-3 text-xl font-bold text-white sm:text-2xl md:text-3xl">
            Pago pendiente
          </h1>
          <p className="text-zinc-400">
            Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Esto puede tardar unos minutos dependiendo del método de pago elegido.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Volver al inicio
          </Link>
        </Card>
      </div>
    </PageContainer>
  );
}
