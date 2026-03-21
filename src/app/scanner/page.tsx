"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  scannerService,
  ScanResult,
  ScannerEvent,
  EventStats,
} from "@/services/scanner";
import { Html5Qrcode } from "html5-qrcode";

export default function ScannerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<ScannerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ScannerEvent | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [error, setError] = useState("");
  const [loadingEvents, setLoadingEvents] = useState(true);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.type !== "scanner")) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.type === "scanner") {
      loadEvents();
    }
  }, [user]);

  async function loadEvents() {
    try {
      const data = await scannerService.getMyEvents();
      setEvents(data);
    } catch {
      setError("Error al cargar eventos asignados");
    } finally {
      setLoadingEvents(false);
    }
  }

  async function loadStats(eventId: number) {
    try {
      const data = await scannerService.getEventStats(eventId);
      setStats(data);
    } catch {
      /* silent */
    }
  }

  const handleScan = useCallback(
    async (qrData: string) => {
      if (!selectedEvent) return;

      setScanning(false);
      stopCamera();

      try {
        const result = await scannerService.scanTicket(
          qrData,
          selectedEvent.id
        );
        setScanResult(result);
        loadStats(selectedEvent.id);

        if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
        resultTimeoutRef.current = setTimeout(() => {
          setScanResult(null);
        }, 5000);
      } catch {
        setScanResult({
          valid: false,
          message: "Error al procesar el escaneo",
        });
      }
    },
    [selectedEvent]
  );

  async function startCamera() {
    setScanResult(null);
    setScanning(true);

    try {
      const html5Qrcode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5Qrcode;

      await html5Qrcode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScan(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setError(
        "No se pudo acceder a la cámara. Verificá los permisos del navegador."
      );
      setScanning(false);
    }
  }

  function stopCamera() {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current = null;
        })
        .catch(() => {});
    }
    setScanning(false);
  }

  function selectEvent(event: ScannerEvent) {
    setSelectedEvent(event);
    setScanResult(null);
    loadStats(event.id);
  }

  function backToEvents() {
    stopCamera();
    setSelectedEvent(null);
    setScanResult(null);
    setStats(null);
  }

  useEffect(() => {
    return () => {
      stopCamera();
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    };
  }, []);

  if (authLoading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!selectedEvent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Escáner de Entradas
        </h1>
        <p className="text-gray-500 mb-6">
          Hola {user.name}, seleccioná un evento para escanear entradas.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {loadingEvents ? (
          <p className="text-gray-400 text-center py-10">
            Cargando eventos...
          </p>
        ) : events.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No tenés eventos asignados</p>
            <p className="text-gray-400 text-sm mt-2">
              Pedile al organizador que te asigne a un evento
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => selectEvent(event)}
                className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-400 hover:shadow-md transition-all"
              >
                <p className="font-semibold text-gray-900">{event.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(event.event_date).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-400">{event.location}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button
        onClick={backToEvents}
        className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Volver a eventos
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
          <h2 className="text-white font-bold text-lg">{selectedEvent.name}</h2>
          <p className="text-indigo-100 text-sm">
            {new Date(selectedEvent.event_date).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {stats.scanned}
              </p>
              <p className="text-xs text-gray-500">Ingresaron</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
              <p className="text-xs text-gray-500">Pendientes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        )}

        <div className="p-4">
          {scanResult && (
            <div
              className={`mb-4 rounded-xl p-6 text-center ${
                scanResult.valid
                  ? "bg-green-50 border-2 border-green-400"
                  : "bg-red-50 border-2 border-red-400"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  scanResult.valid ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {scanResult.valid ? (
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <p
                className={`text-lg font-bold ${
                  scanResult.valid ? "text-green-700" : "text-red-700"
                }`}
              >
                {scanResult.valid ? "ACCESO PERMITIDO" : "ACCESO DENEGADO"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  scanResult.valid ? "text-green-600" : "text-red-600"
                }`}
              >
                {scanResult.message}
              </p>

              {scanResult.ticket && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-gray-700 text-sm">
                    {scanResult.ticket.buyerName}
                  </p>
                  {scanResult.ticket.buyerEmail && (
                    <p className="text-gray-400 text-xs">
                      {scanResult.ticket.buyerEmail}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            id="qr-reader"
            className={`rounded-lg overflow-hidden ${
              scanning ? "block" : "hidden"
            }`}
            style={{ width: "100%" }}
          />

          {!scanning ? (
            <button
              onClick={startCamera}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Escanear Entrada
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold mt-3 hover:bg-gray-700 transition-colors"
            >
              Detener cámara
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
