import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageContainer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Términos y condiciones de uso del sitio Entradas Rosario. Leé las reglas de compra, uso de la plataforma y responsabilidades.",
};

const section = "space-y-3 text-[15px] leading-relaxed text-zinc-300";
const h2 = "text-lg font-semibold text-white";

export default function TerminosPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Términos y condiciones
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Última actualización: marzo de 2026. Este texto es orientativo; conviene revisarlo
          con asesoramiento legal antes de uso comercial.
        </p>
        <Card className="space-y-10 p-6 sm:p-8">
          <section className={section}>
            <h2 className={h2}>1. Aceptación</h2>
            <p>
              Al acceder o utilizar el sitio web y los servicios de Entradas Rosario (en
              adelante, la &quot;Plataforma&quot;), el usuario acepta estos términos y
              condiciones. Si no estás de acuerdo, no utilices la Plataforma.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>2. Descripción del servicio</h2>
            <p>
              La Plataforma permite a los organizadores publicar eventos y vender entradas,
              y a los compradores registrarse, adquirir entradas y recibir comprobantes
              digitales (por ejemplo, códigos QR). Los pagos pueden procesarse a través de
              proveedores externos (como Mercado Pago), según la configuración del sistema.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>3. Cuenta de usuario</h2>
            <p>
              Podés necesitar una cuenta para ciertas operaciones. Sos responsable de la
              confidencialidad de tu contraseña y de la veracidad de los datos que cargues.
              La Plataforma puede suspender cuentas ante uso indebido o fraude.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>4. Compras y precios</h2>
            <p>
              Los precios, cargos y disponibilidad de entradas son definidos por cada
              organizador. La confirmación de la compra y la emisión de entradas pueden
              depender de la aprobación del pago por el proveedor de pagos. Los reembolsos,
              cambios o cancelaciones se rigen por la política del organizador del evento y
              por la normativa aplicable.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>5. Uso de las entradas</h2>
            <p>
              Las entradas son personales o según las reglas del evento. No está permitida
              su reproducción, reventa no autorizada ni su uso con fines ilícitos. El
              organizador puede negar el ingreso por motivos de seguridad, capacidad o
              incumplimiento de las reglas del evento.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>6. Limitación de responsabilidad</h2>
            <p>
              La Plataforma actúa como intermediario tecnológico entre compradores y
              organizadores. No somos responsables por la realización, modificación o
              cancelación de eventos por parte de terceros, ni por daños indirectos o
              lucro cesante, en la medida permitida por la ley argentina aplicable.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>7. Propiedad intelectual</h2>
            <p>
              Los contenidos de la Plataforma (marcas, diseño, textos, software) están
              protegidos. No podés copiarlos ni usarlos sin autorización, salvo lo permitido
              por ley.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>8. Ley aplicable</h2>
            <p>
              Estos términos se interpretan según las leyes de la República Argentina. Para
              cualquier controversia, las partes podrán someterse a los tribunales
              ordinarios con competencia en la ciudad de Rosario, provincia de Santa Fe,
              salvo normas imperativas en contrario.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>9. Contacto</h2>
            <p>
              Para consultas:{" "}
              <Link
                href="/contacto"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                página de contacto
              </Link>{" "}
              o{" "}
              <a
                href="mailto:rosario.entradas.ok@gmail.com"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                rosario.entradas.ok@gmail.com
              </a>
              .
            </p>
          </section>
        </Card>
      </div>
    </PageContainer>
  );
}
