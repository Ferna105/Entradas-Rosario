"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/services/api";

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
}

export default function CompraExitoPage() {
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="bg-white rounded-2xl shadow-xl p-10">
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
          ) : (
            <p className="text-gray-600 mt-4">
              Tu compra fue procesada correctamente.
            </p>
          )}

          <p className="text-gray-500 text-sm mt-6">
            Pronto recibirás un email con tus entradas y código QR.
          </p>

          <Link
            href="/"
            className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
