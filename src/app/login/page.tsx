"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button, Card, Input, Label, PageContainer } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="flex min-h-[80vh] flex-col items-center justify-center py-10">
      <div className="w-full max-w-md">
        <Card className="p-6 sm:p-8">
          <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
            Iniciar sesión
          </h1>
          <p className="mb-8 text-center text-sm text-zinc-500">
            Ingresá a tu cuenta de Entradas Rosario
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            ¿No tenés cuenta?{" "}
            <Link
              href="/registro"
              className="font-semibold text-violet-400 hover:text-violet-300"
            >
              Registrate
            </Link>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
