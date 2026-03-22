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
import { Card, PageContainer } from "@/components/ui";

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
    } catch {
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
      <PageContainer className="flex min-h-[80vh] items-center justify-center py-10">
        <p className="text-sm text-zinc-500">Cargando…</p>
      </PageContainer>
    );
  }

  if (!selectedEvent) {
    return (
      <PageContainer className="max-w-lg py-6 sm:py-8">
        <h1 className="mb-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
          Escáner de entradas
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          Hola {user.name}, seleccioná un evento para escanear entradas.
        </p>

        {error && (
          <div
            className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 p-4"
            role="alert"
          >
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {loadingEvents ? (
          <p className="py-10 text-center text-sm text-zinc-500">Cargando eventos…</p>
        ) : events.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-zinc-400">No tenés eventos asignados</p>
            <p className="mt-2 text-sm text-zinc-500">
              Pedile al organizador que te asigne a un evento
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => selectEvent(event)}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 p-4 text-left transition-colors hover:border-violet-500/40 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <p className="font-semibold text-white">{event.name}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {new Date(event.event_date).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-zinc-600">{event.location}</p>
              </button>
            ))}
          </div>
        )}
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-lg py-4 sm:py-6">
      <button
        type="button"
        onClick={backToEvents}
        className="mb-4 flex min-h-[44px] items-center text-sm text-zinc-400 transition-colors hover:text-white"
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

      <Card className="overflow-hidden p-0">
        <div className="sticky top-[52px] z-10 border-b border-white/10 bg-gradient-to-r from-violet-700 to-violet-600 p-4 sm:relative sm:top-0">
          <h2 className="text-lg font-bold text-white">{selectedEvent.name}</h2>
          <p className="text-sm text-violet-100/90">
            {new Date(selectedEvent.event_date).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-2 border-b border-white/10 bg-zinc-950/50 p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-violet-400">{stats.scanned}</p>
              <p className="text-xs text-zinc-500">Ingresaron</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{stats.valid}</p>
              <p className="text-xs text-zinc-500">Pendientes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-300">{stats.total}</p>
              <p className="text-xs text-zinc-500">Total</p>
            </div>
          </div>
        )}

        <div className="p-4">
          {scanResult && (
            <div
              className={`mb-4 rounded-2xl border-2 p-6 text-center ${
                scanResult.valid
                  ? "border-emerald-500/50 bg-emerald-950/40"
                  : "border-red-500/50 bg-red-950/40"
              }`}
            >
              <div
                className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${
                  scanResult.valid ? "bg-emerald-500/20" : "bg-red-500/20"
                }`}
              >
                {scanResult.valid ? (
                  <svg
                    className="h-8 w-8 text-emerald-400"
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
                    className="h-8 w-8 text-red-400"
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
                  scanResult.valid ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {scanResult.valid ? "ACCESO PERMITIDO" : "ACCESO DENEGADO"}
              </p>
              <p
                className={`mt-1 text-sm ${
                  scanResult.valid ? "text-emerald-400/90" : "text-red-400/90"
                }`}
              >
                {scanResult.message}
              </p>

              {scanResult.ticket && (
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p className="text-sm text-zinc-200">{scanResult.ticket.buyerName}</p>
                  {scanResult.ticket.buyerEmail && (
                    <p className="text-xs text-zinc-500">{scanResult.ticket.buyerEmail}</p>
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
              type="button"
              onClick={startCamera}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
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
              type="button"
              onClick={stopCamera}
              className="mt-3 w-full min-h-[44px] rounded-xl border border-white/15 bg-zinc-800 py-3 font-semibold text-zinc-100 transition-colors hover:bg-zinc-700"
            >
              Detener cámara
            </button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
