"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button, Card, Input, PageContainer, Tabs } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState<"buyer" | "seller">("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, type);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-8 sm:py-10">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-text-primary sm:text-2xl md:text-3xl">
            Crear cuenta
          </h1>
          <p className="mb-8 text-center text-sm text-text-tertiary">
            Registrate en Entradas Rosario
          </p>

          {error && (
            <div
              className="mb-6 rounded-xl border border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Nombre completo"
              placeholder="Tu nombre"
              autoComplete="name"
            />

            <Input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="tucorreo@email.com"
              autoComplete="email"
            />

            <Input
              type="password"
              id="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />

            <Input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirmar contraseña"
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
            />

            <div>
              <p className="mb-3 text-sm font-medium text-text-primary">Tipo de cuenta</p>
              <Tabs
                variant="pills"
                value={type}
                onChange={(v) => setType(v as "buyer" | "seller")}
                items={[
                  { value: "buyer", label: "Comprador" },
                  { value: "seller", label: "Organizador" },
                ]}
                className="w-full justify-center"
              />
              <p className="mt-2 text-xs text-text-tertiary">
                Los escaneadores de QR se invitan desde el panel del organizador al crear un evento.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              full
              disabled={loading}
              loading={loading}
            >
              Crear cuenta
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
