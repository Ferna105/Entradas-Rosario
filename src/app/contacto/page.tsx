"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Input,
  Label,
  PageContainer,
  Textarea,
} from "@/components/ui";
import { sendContactMessage } from "@/services/contact";

export default function ContactoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await sendContactMessage({
        name,
        email,
        message,
        subject: subject.trim() || undefined,
      });
      setSuccess(true);
      setMessage("");
      setSubject("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el mensaje. Intentá de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer className="flex min-h-[80vh] flex-col py-10 sm:py-14">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Contacto
        </h1>
        <p className="mb-8 text-center text-sm text-zinc-400">
          Escribinos y te respondemos a la brevedad. También podés escribir a{" "}
          <a
            href="mailto:rosario.entradas.ok@gmail.com"
            className="font-medium text-violet-400 hover:text-violet-300"
          >
            rosario.entradas.ok@gmail.com
          </a>{" "}
          o llamar al{" "}
          <a
            href="tel:+543413092012"
            className="font-medium text-violet-400 hover:text-violet-300"
          >
            +54 341 309-2012
          </a>
          .
        </p>

        <Card className="p-6 sm:p-8">
          {success && (
            <div
              className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200"
              role="status"
            >
              Mensaje enviado. Gracias por contactarnos.
            </div>
          )}

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
                Nombre
              </Label>
              <Input
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
              <Label htmlFor="subject" className="mb-1.5">
                Asunto <span className="font-normal text-zinc-500">(opcional)</span>
              </Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej.: consulta sobre un evento"
              />
            </div>

            <div>
              <Label htmlFor="message" className="mb-1.5">
                Mensaje
              </Label>
              <Textarea
                id="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribí tu mensaje (mínimo 10 caracteres)"
                minLength={10}
                className="resize-y"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando…" : "Enviar mensaje"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            <Link href="/" className="text-violet-400 hover:text-violet-300">
              Volver al inicio
            </Link>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
