import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageContainer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé Entradas Rosario: plataforma para comprar y vender entradas a eventos de música en toda Argentina.",
};

export default function NosotrosPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Nosotros
        </h1>
        <Card className="space-y-6 p-6 sm:p-8">
          <section className="space-y-3 text-[15px] leading-relaxed text-zinc-300">
            <h2 className="text-lg font-semibold text-white">Qué hacemos</h2>
            <p>
              <strong className="text-zinc-200">Entradas Rosario</strong> es una plataforma
              pensada para conectar a la gente con los eventos: recitales, fiestas,
              festivales y mucho más. Facilitamos la venta de entradas en línea de forma
              simple y segura, para que los organizadores puedan enfocarse en el evento y
              el público en disfrutarlo.
            </p>
          </section>

          <section className="space-y-3 text-[15px] leading-relaxed text-zinc-300">
            <h2 className="text-lg font-semibold text-white">Nuestra misión</h2>
            <p>
              Queremos ser el lugar de referencia en Rosario para descubrir eventos y
              conseguir entradas sin complicaciones. Trabajamos con tecnología moderna,
              pagos integrados y un equipo que responde cuando nos necesitás.
            </p>
          </section>

          <section className="space-y-3 text-[15px] leading-relaxed text-zinc-300">
            <h2 className="text-lg font-semibold text-white">Para compradores</h2>
            <p>
              Podés buscar eventos, elegir tu tipo de entrada y pagar de forma segura. Recibís
              tus entradas con código QR para presentar en la puerta del evento.
            </p>
          </section>

          <section className="space-y-3 text-[15px] leading-relaxed text-zinc-300">
            <h2 className="text-lg font-semibold text-white">Para organizadores</h2>
            <p>
              Ofrecemos herramientas para publicar eventos, definir tipos de entrada y
              cobrar a través de medios de pago confiables. Si tenés dudas o querés sumar
              tu evento,{" "}
              <Link
                href="/contacto"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                escribinos
              </Link>
              .
            </p>
          </section>
        </Card>
      </div>
    </PageContainer>
  );
}
