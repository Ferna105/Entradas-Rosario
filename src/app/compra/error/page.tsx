"use client";

import Link from "next/link";
import { Card, PageContainer } from "@/components/ui";

export default function CompraErrorPage() {
  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-10">
      <div className="w-full max-w-lg text-center">
        <Card className="p-8 sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
            <svg
              className="h-10 w-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="mb-3 text-xl font-bold text-white sm:text-2xl md:text-3xl">
            Error en el pago
          </h1>
          <p className="text-zinc-400">
            No se pudo procesar tu pago. No se realizó ningún cargo.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Podés intentarlo nuevamente o contactarnos si el problema persiste.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex min-h-[44px] min-w-[200px] items-center justify-center rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Volver al inicio
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
