"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button, Card, Input, Label, PageContainer } from "@/components/ui";

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

  const pill =
    "min-h-[44px] flex-1 rounded-xl border px-3 py-2.5 text-center text-xs font-semibold transition-colors sm:text-sm";
  const pillActive = "border-violet-500 bg-violet-600/25 text-violet-200 ring-1 ring-violet-500/40";
  const pillIdle =
    "border-white/10 bg-zinc-950/50 text-zinc-400 hover:border-white/20 hover:text-zinc-200";

  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-8 sm:py-10">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
            Crear cuenta
          </h1>
          <p className="mb-8 text-center text-sm text-zinc-500">
            Registrate en Entradas Rosario
          </p>

          {error && (
            <div
              className="mb-6 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="mb-1.5">
                Nombre completo
              </Label>
              <Input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="mb-1.5">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-1.5">
                Contraseña
              </Label>
              <Input
                type="password"
                id="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="mb-1.5">
                Confirmar contraseña
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí tu contraseña"
                autoComplete="new-password"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-zinc-300">Tipo de cuenta</p>
              <p className="mb-2 text-xs text-zinc-500">
                Los escaneadores de QR se invitan desde el panel del organizador al crear un evento.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setType("buyer")}
                  className={`${pill} ${type === "buyer" ? pillActive : pillIdle}`}
                >
                  Comprador
                </button>
                <button
                  type="button"
                  onClick={() => setType("seller")}
                  className={`${pill} ${type === "seller" ? pillActive : pillIdle}`}
                >
                  Organizador
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creando cuenta…" : "Crear cuenta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300">
              Iniciá sesión
            </Link>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
