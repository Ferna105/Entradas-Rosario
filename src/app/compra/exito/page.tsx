"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/services/api";
import { Card, PageContainer } from "@/components/ui";

interface TicketInfo {
  id: number;
  qr_code: string;
  qr_data: string;
  status: string;
}

interface PurchaseInfo {
  id: number;
  buyer_name: string;
  buyer_email: string;
  quantity: number;
  total_amount: number;
  payment_status: string;
  event: {
    name: string;
    event_date: string;
    location: string;
  };
  tickets: TicketInfo[];
}

function CompraExitoContent() {
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get("purchase");
  const [purchase, setPurchase] = useState<PurchaseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!purchaseId) {
      setLoading(false);
      return;
    }

    async function loadPurchase() {
      try {
        const data = await apiClient.get<PurchaseInfo>(
          `/payments/purchase/${purchaseId}`
        );
        setPurchase(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    loadPurchase();
  }, [purchaseId]);

  if (loading) {
    return (
      <PageContainer className="flex min-h-[80vh] items-center justify-center py-10">
        <p className="text-sm text-zinc-500">Cargando…</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-10">
      <div className="w-full max-w-2xl text-center">
        <Card className="p-8 sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <svg
              className="h-10 w-10 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mb-3 text-xl font-bold text-white sm:text-2xl md:text-3xl">
            ¡Compra exitosa!
          </h1>

          {purchase ? (
            <>
              <div className="mt-6 space-y-2 rounded-xl border border-white/10 bg-zinc-950/50 p-5 text-left">
                <p className="text-lg font-semibold text-white">
                  {purchase.event.name}
                </p>
                <p className="text-sm text-zinc-400">
                  {new Date(purchase.event.event_date).toLocaleDateString(
                    "es-AR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
                <p className="text-sm text-zinc-400">{purchase.event.location}</p>
                <div className="mt-2 border-t border-white/10 pt-2">
                  <p className="text-sm text-zinc-300">
                    Comprador: {purchase.buyer_name}
                  </p>
                  <p className="text-sm text-zinc-300">
                    Cantidad: {purchase.quantity}{" "}
                    {purchase.quantity === 1 ? "entrada" : "entradas"}
                  </p>
                  <p className="mt-1 font-semibold text-violet-400">
                    Total: $
                    {Number(purchase.total_amount).toLocaleString("es-AR")}
                  </p>
                </div>
              </div>

              {purchase.tickets && purchase.tickets.length > 0 && (
                <div className="mt-8 text-left">
                  <h2 className="mb-4 text-lg font-bold text-white sm:text-xl">
                    {purchase.tickets.length > 1
                      ? `Tus ${purchase.tickets.length} entradas`
                      : "Tu entrada"}
                  </h2>
                  <p className="mb-6 text-sm text-zinc-500">
                    Presentá {purchase.tickets.length > 1 ? "estos códigos QR" : "este código QR"} en la entrada del evento
                  </p>

                  <div className="grid grid-cols-1 gap-6">
                    {purchase.tickets.map((ticket, index) => (
                      <div
                        key={ticket.id}
                        className="rounded-2xl border border-white/10 bg-zinc-950/40 p-6"
                      >
                        <p className="mb-3 text-sm text-zinc-500">
                          Entrada {index + 1} de {purchase.tickets.length}
                        </p>
                        {ticket.qr_code && (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element -- data URL del QR */}
                            <img
                              src={ticket.qr_code}
                              alt={`QR Entrada ${index + 1}`}
                              className="mx-auto h-56 w-56 max-w-full sm:h-64 sm:w-64"
                            />
                          </>
                        )}
                        <p className="mt-3 break-all font-mono text-xs text-zinc-500">
                          {ticket.qr_data}
                        </p>
                        <span
                          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            ticket.status === "valid"
                              ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25"
                              : ticket.status === "used"
                              ? "bg-zinc-500/15 text-zinc-400 ring-1 ring-white/10"
                              : "bg-red-500/15 text-red-300 ring-1 ring-red-500/25"
                          }`}
                        >
                          {ticket.status === "valid"
                            ? "Válida"
                            : ticket.status === "used"
                            ? "Utilizada"
                            : "Cancelada"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-amber-500/25 bg-amber-950/30 p-4 text-left">
                <p className="text-sm text-amber-200/90">
                  <strong className="text-amber-100">Importante:</strong> También recibirás{" "}
                  {purchase.tickets?.length > 1
                    ? "tus entradas"
                    : "tu entrada"}{" "}
                  por email a <strong className="text-white">{purchase.buyer_email}</strong>. Cada QR es
                  de uso único y será escaneado al ingresar al evento.
                </p>
              </div>
            </>
          ) : (
            <p className="mt-4 text-zinc-400">
              Tu compra fue procesada correctamente. Pronto recibirás un email
              con tus entradas.
            </p>
          )}

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

export default function CompraExitoPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="flex min-h-[80vh] items-center justify-center py-10">
          <p className="text-sm text-zinc-500">Cargando…</p>
        </PageContainer>
      }
    >
      <CompraExitoContent />
    </Suspense>
  );
}
