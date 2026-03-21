"use client";

import Link from "next/link";

export default function CompraErrorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
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

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Error en el pago
          </h1>
          <p className="text-gray-600">
            No se pudo procesar tu pago. No se realizó ningún cargo.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Podés intentarlo nuevamente o contactarnos si el problema persiste.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
