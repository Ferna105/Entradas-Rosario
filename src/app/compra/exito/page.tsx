"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/services/api";

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
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
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

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            ¡Compra exitosa!
          </h1>

          {purchase ? (
            <>
              <div className="text-left bg-gray-50 rounded-lg p-5 mt-6 space-y-2">
                <p className="text-gray-900 font-semibold text-lg">
                  {purchase.event.name}
                </p>
                <p className="text-gray-600 text-sm">
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
                <p className="text-gray-600 text-sm">
                  {purchase.event.location}
                </p>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <p className="text-gray-700 text-sm">
                    Comprador: {purchase.buyer_name}
                  </p>
                  <p className="text-gray-700 text-sm">
                    Cantidad: {purchase.quantity}{" "}
                    {purchase.quantity === 1 ? "entrada" : "entradas"}
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">
                    Total: $
                    {Number(purchase.total_amount).toLocaleString("es-AR")}
                  </p>
                </div>
              </div>

              {purchase.tickets && purchase.tickets.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {purchase.tickets.length > 1
                      ? `Tus ${purchase.tickets.length} entradas`
                      : "Tu entrada"}
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Presentá {purchase.tickets.length > 1 ? "estos códigos QR" : "este código QR"} en la entrada del evento
                  </p>

                  <div className="grid gap-6">
                    {purchase.tickets.map((ticket, index) => (
                      <div
                        key={ticket.id}
                        className="border-2 border-gray-200 rounded-xl p-6 bg-white"
                      >
                        <p className="text-gray-500 text-sm mb-3">
                          Entrada {index + 1} de {purchase.tickets.length}
                        </p>
                        {ticket.qr_code && (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element -- data URL del QR */}
                            <img
                              src={ticket.qr_code}
                              alt={`QR Entrada ${index + 1}`}
                              className="w-64 h-64 mx-auto"
                            />
                          </>
                        )}
                        <p className="text-xs text-gray-400 mt-3 font-mono break-all">
                          {ticket.qr_data}
                        </p>
                        <span
                          className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                            ticket.status === "valid"
                              ? "bg-green-100 text-green-700"
                              : ticket.status === "used"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-700"
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

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6 text-left">
                <p className="text-amber-800 text-sm">
                  <strong>Importante:</strong> También recibirás{" "}
                  {purchase.tickets?.length > 1
                    ? "tus entradas"
                    : "tu entrada"}{" "}
                  por email a <strong>{purchase.buyer_email}</strong>. Cada QR es
                  de uso único y será escaneado al ingresar al evento.
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mt-4">
              Tu compra fue procesada correctamente. Pronto recibirás un email
              con tus entradas.
            </p>
          )}

          <Link
            href="/"
            className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CompraExitoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <p className="text-gray-400">Cargando...</p>
        </div>
      }
    >
      <CompraExitoContent />
    </Suspense>
  );
}
