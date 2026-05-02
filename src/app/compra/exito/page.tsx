"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/services/api";
import { Badge, Card, Icon, PageContainer, Skeleton } from "@/components/ui";

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

function ticketStatusLabel(status: string) {
  if (status === "valid") return "Válida";
  if (status === "used") return "Utilizada";
  return "Cancelada";
}

function ticketStatusTone(status: string): "success" | "neutral" | "danger" {
  if (status === "valid") return "success";
  if (status === "used") return "neutral";
  return "danger";
}

function CompraExitoContent() {
  const searchParams = useSearchParams();
  const purchaseId = searchParams.get("purchase");
  const [purchase, setPurchase] = useState<PurchaseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!purchaseId) { setLoading(false); return; }
    apiClient
      .get<PurchaseInfo>(`/payments/purchase/${purchaseId}`)
      .then(setPurchase)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [purchaseId]);

  if (loading) {
    return (
      <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-10">
        <div className="w-full max-w-2xl space-y-4">
          <Skeleton className="mx-auto h-20 w-20 rounded-full" />
          <Skeleton className="mx-auto h-8 w-56 rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-2xl" />
        </div>
      </PageContainer>
    );
  }

  const eventDate = purchase
    ? new Date(purchase.event.event_date).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-10">
      <div className="w-full max-w-2xl">
        {/* Ícono de estado */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full"
            style={{
              background: "rgba(34,197,94,0.12)",
              boxShadow: "0 0 0 12px rgba(34,197,94,0.06)",
            }}
          >
            <Icon name="check" size={36} color="var(--success)" strokeWidth={2.2} />
          </div>
          <h1 className="text-[28px] font-bold tracking-snug sm:text-[34px]">
            ¡Compra exitosa!
          </h1>
          {purchase && (
            <p className="mt-2 text-[15px] text-text-secondary">
              Tus{" "}
              {purchase.quantity === 1 ? "entrada fue enviada" : "entradas fueron enviadas"} a{" "}
              <strong className="text-text-primary">{purchase.buyer_email}</strong>
            </p>
          )}
        </div>

        {purchase ? (
          <div className="space-y-4">
            {/* Detalle de la compra */}
            <Card className="p-5">
              <div className="text-[11px] tracking-[0.08em] text-text-tertiary mb-3">
                DETALLE DE LA COMPRA
              </div>
              <div className="space-y-2">
                <div className="text-[17px] font-semibold">{purchase.event.name}</div>
                {eventDate && (
                  <div className="flex items-center gap-2 text-[14px] text-text-secondary">
                    <Icon name="calendar" size={15} />
                    {eventDate}
                  </div>
                )}
                {purchase.event.location && (
                  <div className="flex items-center gap-2 text-[14px] text-text-secondary">
                    <Icon name="pin" size={15} />
                    {purchase.event.location}
                  </div>
                )}
                <div className="border-t border-ink-4 pt-3 mt-3 space-y-1">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-secondary">Comprador</span>
                    <span className="font-medium">{purchase.buyer_name}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-secondary">
                      {purchase.quantity === 1 ? "Entrada" : "Entradas"}
                    </span>
                    <span className="font-medium">{purchase.quantity}</span>
                  </div>
                  <div className="flex justify-between text-[14px]">
                    <span className="text-text-secondary">Total</span>
                    <span className="text-[16px] font-bold text-yellow-300">
                      ${Number(purchase.total_amount).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* QR tickets */}
            {purchase.tickets?.length > 0 && (
              <div>
                <div className="mb-3 text-[11px] tracking-[0.08em] text-text-tertiary">
                  {purchase.tickets.length === 1 ? "TU ENTRADA" : `TUS ${purchase.tickets.length} ENTRADAS`}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {purchase.tickets.map((ticket, index) => (
                    <Card key={ticket.id} className="p-5 text-center">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[12px] text-text-tertiary">
                          Entrada {index + 1} de {purchase.tickets.length}
                        </span>
                        <Badge tone={ticketStatusTone(ticket.status)} size="sm">
                          {ticketStatusLabel(ticket.status)}
                        </Badge>
                      </div>
                      {ticket.qr_code && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={ticket.qr_code}
                          alt={`QR Entrada ${index + 1}`}
                          className="mx-auto h-52 w-52 max-w-full"
                        />
                      )}
                      <p className="mt-2 break-all font-mono text-[10px] text-text-tertiary">
                        {ticket.qr_data}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Nota email */}
            <div className="flex gap-3 rounded-[14px] border border-yellow-300/20 bg-yellow-300/5 p-4">
              <Icon name="info" size={18} color="var(--yellow-300)" className="mt-0.5 flex-shrink-0" />
              <p className="text-[13px] text-text-secondary leading-relaxed">
                También recibís{" "}
                {purchase.tickets?.length > 1 ? "las entradas" : "la entrada"} por email. Cada QR es de uso único y será escaneado al ingresar al evento.
              </p>
            </div>
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-text-secondary">
              Tu compra fue procesada. Pronto recibís un email con{" "}
              {purchaseId ? "tus entradas." : "la confirmación."}
            </p>
          </Card>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/mis-entradas"
            className="inline-flex h-[52px] items-center justify-center rounded-xl bg-yellow-300 px-8 text-[15px] font-semibold text-text-on-yellow transition-all hover:brightness-110"
          >
            Ver mis entradas
          </Link>
          <Link
            href="/"
            className="inline-flex h-[52px] items-center justify-center rounded-xl border border-transparent px-8 text-[15px] font-medium text-text-primary transition-all hover:bg-ink-3"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default function CompraExitoPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="flex min-h-[80vh] items-center justify-center py-10">
          <Skeleton className="h-[320px] w-full max-w-2xl rounded-2xl" />
        </PageContainer>
      }
    >
      <CompraExitoContent />
    </Suspense>
  );
}
