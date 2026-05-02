"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/services/api";
import { Button, Card, Icon, Input, PageContainer } from "@/components/ui";

interface ValidateResponse {
  eventName: string;
  eventDate: string;
  location: string | null;
  organizerName: string;
  emailMasked: string;
}

function AcceptScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [validateLoading, setValidateLoading] = useState(true);
  const [validateError, setValidateError] = useState("");
  const [info, setInfo] = useState<ValidateResponse | null>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!token.trim()) {
      setValidateError("Enlace inválido o incompleto.");
      setValidateLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await apiClient.get<ValidateResponse>("/scanner/invitations/validate", {
          params: { token: token.trim() },
        });
        if (!cancelled) {
          setInfo(data);
        }
      } catch (e) {
        if (!cancelled) {
          setValidateError(e instanceof Error ? e.message : "No se pudo cargar la invitación.");
        }
      } finally {
        if (!cancelled) setValidateLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (password !== confirmPassword) {
      setSubmitError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setSubmitError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (name.trim().length < 2) {
      setSubmitError("Ingresá tu nombre completo");
      return;
    }

    setSubmitLoading(true);
    try {
      await apiClient.post("/scanner/invitations/accept", {
        token: token.trim(),
        name: name.trim(),
        password,
      });
      router.push("/login?scanner=1");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (validateLoading) {
    return (
      <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-8">
        <p className="text-sm text-zinc-500">Cargando invitación…</p>
      </PageContainer>
    );
  }

  if (validateError || !info) {
    return (
      <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-8">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <h1 className="mb-2 text-lg font-bold text-text-primary">Invitación no disponible</h1>
          <p className="text-sm text-text-tertiary">{validateError || "No se encontró la invitación."}</p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-semibold text-violet-400 transition-colors hover:text-violet-300"
          >
            Ir al inicio de sesión
          </Link>
        </Card>
      </PageContainer>
    );
  }

  const eventDateStr = new Date(info.eventDate).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-8 sm:py-10">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 ring-2 ring-violet-400/50">
              <Icon name="qr" size={32} className="text-violet-400" />
            </div>
          </div>
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            Completá tu cuenta de escaneador
          </h1>
          <p className="mb-6 text-center text-sm text-text-tertiary">
            Te invitó <span className="text-text-primary">{info.organizerName}</span> para el evento{" "}
            <span className="font-medium text-text-primary">{info.eventName}</span>
          </p>

          <div className="mb-6 rounded-xl border border-ink-4 bg-ink-2/60 p-4 text-sm">
            <div className="flex items-start gap-3">
              <Icon name="calendar" size={16} className="mt-0.5 shrink-0 text-text-tertiary" />
              <div>
                <p className="text-text-primary">{eventDateStr}</p>
              </div>
            </div>
            {info.location && (
              <div className="mt-3 flex items-start gap-3">
                <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-text-tertiary" />
                <p className="text-text-secondary">{info.location}</p>
              </div>
            )}
            <div className="mt-3 flex items-start gap-3">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-text-tertiary" />
              <p className="text-text-tertiary">{info.emailMasked}</p>
            </div>
          </div>

          {submitError && (
            <div
              className="mb-6 rounded-xl border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Nombre completo"
              placeholder="Tu nombre"
              autoComplete="name"
            />
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
            <Input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirmar contraseña"
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
            />
            <Button
              type="submit"
              variant="primary"
              full
              loading={submitLoading}
              disabled={submitLoading}
            >
              Aceptar y crear cuenta
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-tertiary">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="font-semibold text-violet-400 transition-colors hover:text-violet-300">
              Iniciá sesión
            </Link>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function AcceptScannerPage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="flex min-h-[80vh] items-center justify-center py-8">
          <p className="text-sm text-zinc-500">Cargando…</p>
        </PageContainer>
      }
    >
      <AcceptScannerContent />
    </Suspense>
  );
}
