"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  Input,
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
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Contacto
          </h1>
          <p className="text-text-secondary">
            Escribinos y te respondemos a la brevedad. También podés escribir a{" "}
            <a
              href="mailto:rosario.entradas.ok@gmail.com"
              className="font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              rosario.entradas.ok@gmail.com
            </a>{" "}
            o llamar al{" "}
            <a
              href="tel:+543413092012"
              className="font-medium text-violet-400 transition-colors hover:text-violet-300"
            >
              +54 341 309-2012
            </a>
            .
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {success && (
            <div
              className="mb-6 rounded-xl border border-success bg-success/10 px-4 py-3 text-sm text-success"
              role="status"
            >
              Mensaje enviado. Gracias por contactarnos.
            </div>
          )}

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
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Nombre"
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
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              label="Asunto (opcional)"
              placeholder="Ej.: consulta sobre un evento"
            />

            <Textarea
              id="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label="Mensaje"
              placeholder="Escribí tu mensaje (mínimo 10 caracteres)"
              minLength={10}
            />

            <Button
              type="submit"
              variant="primary"
              full
              disabled={loading}
              loading={loading}
            >
              Enviar mensaje
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-tertiary">
            <Link href="/" className="text-violet-400 transition-colors hover:text-violet-300">
              Volver al inicio
            </Link>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
