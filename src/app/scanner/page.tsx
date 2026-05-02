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
import { Button, Card, Icon, EmptyState, Skeleton, PageContainer } from "@/components/ui";
import { MiniKPI } from "@/components/MiniKPI";

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
        <h1 className="mb-2 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
          Escáner de entradas
        </h1>
        <p className="mb-6 text-sm text-text-tertiary">
          Hola {user.name}, seleccioná un evento para escanear entradas.
        </p>

        {error && (
          <div
            className="mb-4 rounded-xl border border-danger bg-danger/10 p-4"
            role="alert"
          >
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {loadingEvents ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={88} rounded />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon="qr"
            title="Sin eventos asignados"
            description="Pedile al organizador que te asigne a un evento para comenzar a escanear entradas."
          />
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => selectEvent(event)}
                className="w-full text-left"
              >
                <Card className="p-4 transition-all hover:border-violet-400 hover:bg-ink-3">
                  <p className="font-semibold text-text-primary">{event.name}</p>
                  <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Icon name="calendar" size={14} />
                      {new Date(event.event_date).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-tertiary">
                      <Icon name="pin" size={14} />
                      {event.location}
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        )}
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-lg py-4 sm:py-6">
      <Button
        type="button"
        variant="ghost"
        icon="chevronLeft"
        onClick={backToEvents}
        className="mb-4"
      >
        Volver a eventos
      </Button>

      <Card className="overflow-hidden p-0">
        <div className="sticky top-[52px] z-10 border-b border-ink-4 bg-ink-3 p-4 sm:relative sm:top-0">
          <h2 className="text-lg font-bold text-text-primary">{selectedEvent.name}</h2>
          <p className="text-sm text-text-tertiary">
            {new Date(selectedEvent.event_date).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-3 gap-3 border-b border-ink-4 bg-ink-2/60 p-4">
            <MiniKPI label="Ingresaron" value={String(stats.scanned)} tone="violet" />
            <MiniKPI label="Pendientes" value={String(stats.valid)} tone="success" />
            <MiniKPI label="Total" value={String(stats.total)} tone="neutral" />
          </div>
        )}

        <div className="p-4">
          {scanResult && (
            <div
              className={`mb-4 rounded-2xl border-2 p-6 text-center ${
                scanResult.valid
                  ? "border-success bg-success/10"
                  : "border-danger bg-danger/10"
              }`}
            >
              <div
                className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${
                  scanResult.valid ? "ring-2 ring-success ring-offset-2 ring-offset-ink-1 bg-success/10" : "ring-2 ring-danger ring-offset-2 ring-offset-ink-1 bg-danger/10"
                }`}
              >
                <Icon
                  name={scanResult.valid ? "check" : "close"}
                  size={32}
                  className={scanResult.valid ? "text-success" : "text-danger"}
                />
              </div>

              <p
                className={`text-lg font-bold ${
                  scanResult.valid ? "text-success" : "text-danger"
                }`}
              >
                {scanResult.valid ? "ACCESO PERMITIDO" : "ACCESO DENEGADO"}
              </p>
              <p
                className={`mt-1 text-sm ${
                  scanResult.valid ? "text-success/90" : "text-danger/90"
                }`}
              >
                {scanResult.message}
              </p>

              {scanResult.ticket && (
                <div className="mt-3 border-t border-ink-4 pt-3">
                  <p className="text-sm text-text-primary">{scanResult.ticket.buyerName}</p>
                  {scanResult.ticket.buyerEmail && (
                    <p className="text-xs text-text-tertiary">{scanResult.ticket.buyerEmail}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            id="qr-reader"
            className={`relative rounded-lg overflow-hidden ${
              scanning ? "block" : "hidden"
            }`}
            style={{ width: "100%" }}
          >
            {scanning && (
              <>
                {[
                  "top-8 left-8",
                  "top-8 right-8",
                  "bottom-8 left-8",
                  "bottom-8 right-8",
                ].map((pos, i) => (
                  <div
                    key={i}
                    className={`absolute w-6 h-6 border-2 border-yellow-300 ${pos} ${
                      pos.includes("top left") ? "border-b-0 border-r-0" : ""
                    } ${pos.includes("top right") ? "border-b-0 border-l-0" : ""} ${
                      pos.includes("bottom left") ? "border-t-0 border-r-0" : ""
                    } ${pos.includes("bottom right") ? "border-t-0 border-l-0" : ""}`}
                  />
                ))}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-b from-yellow-300 via-yellow-300 to-transparent opacity-75 animate-[scanline_2s_ease-in-out_infinite]"
                  style={{ width: "100%", height: "2px" }}
                />
              </>
            )}
          </div>

          {!scanning ? (
            <Button
              type="button"
              variant="violet"
              size="lg"
              full
              icon="qr"
              onClick={startCamera}
            >
              Escanear Entrada
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              full
              onClick={stopCamera}
              className="mt-3"
            >
              Detener cámara
            </Button>
          )}
        </div>
      </Card>
    </PageContainer>
  );
}
