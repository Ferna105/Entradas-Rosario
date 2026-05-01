import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá a EventoAbierto por formulario, email o teléfono. Respondemos consultas sobre eventos y la plataforma.",
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
