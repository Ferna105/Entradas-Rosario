import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageContainer } from "@/components/ui";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo EventoAbierto trata tus datos personales: finalidad, conservación, derechos y contacto.",
};

const section = "space-y-3 text-[15px] leading-relaxed text-zinc-300";
const h2 = "text-lg font-semibold text-white";

export default function PrivacidadPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Política de privacidad
        </h1>
        <p className="mb-8 text-sm text-zinc-500">
          Última actualización: marzo de 2026. Texto orientativo; revisá con asesoramiento
          legal según tu operación.
        </p>
        <Card className="space-y-10 p-6 sm:p-8">
          <section className={section}>
            <h2 className={h2}>1. Responsable</h2>
            <p>
              El sitio EventoAbierto (la &quot;Plataforma&quot;) trata datos personales
              conforme a la Ley 25.326 de Protección de Datos Personales de Argentina y
              normativa complementaria, en la medida aplicable al servicio.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>2. Datos que podemos tratar</h2>
            <p>
              Según cómo uses la Plataforma, podemos tratar: nombre, correo electrónico,
              datos de cuenta y autenticación; información relacionada con compras de
              entradas (evento, cantidad, identificadores de transacción); datos técnicos
              (dirección IP, tipo de navegador) cuando sea necesario por seguridad o
              funcionamiento; y comunicaciones que nos envíes por formulario de contacto u
              otros canales.
            </p>
            <p>
              Los pagos con tarjeta u otros medios suelen procesarse a través de Mercado
              Pago u otros proveedores; esos datos los trata el proveedor según sus propias
              políticas.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>3. Finalidades</h2>
            <p>
              Usamos los datos para crear y mantener tu cuenta, procesar compras y
              entregarte entradas (incluido envío de correos transaccionales), prevenir
              fraude, cumplir obligaciones legales, mejorar el servicio y responder tus
              consultas.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>4. Base legal y conservación</h2>
            <p>
              El tratamiento se basa en la ejecución del servicio que solicitás, el
              interés legítimo en la seguridad de la Plataforma y, cuando corresponda, tu
              consentimiento. Conservamos los datos el tiempo necesario para esas
              finalidades y según plazos legales o de auditoría.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>5. Cesiones y encargados</h2>
            <p>
              Podemos compartir datos con proveedores que nos prestan hosting, email,
              pagos o analítica, bajo acuerdos que exigen confidencialidad y seguridad. No
              vendemos tus datos personales a terceros para su marketing.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>6. Tus derechos</h2>
            <p>
              Podés solicitar acceso, rectificación o actualización de tus datos, y en los
              casos previstos por ley, su supresión, cese del envío de publicidad u oposición
              al tratamiento. Podés ejercer derechos contactándonos por los medios indicados
              abajo. También podés presentar una reclamación ante la Dirección Nacional de
              Protección de Datos Personales (Argentina).
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>7. Seguridad</h2>
            <p>
              Aplicamos medidas razonables para proteger la información. Ningún sistema es
              100&nbsp;% seguro; usá contraseñas fuertes y no compartas tu cuenta.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>8. Menores</h2>
            <p>
              El servicio no está dirigido a menores de 13 años de forma autónoma. Si sos
              padre/madre o tutor y creés que cargamos datos de un menor, contactanos.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>9. Cambios</h2>
            <p>
              Podemos actualizar esta política; publicaremos la versión vigente en el sitio
              con la fecha de actualización.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>10. Contacto</h2>
            <p>
              Para ejercer derechos o consultas de privacidad:{" "}
              <Link
                href="/contacto"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                formulario de contacto
              </Link>
              ,{" "}
              <a
                href="mailto:rosario.entradas.ok@gmail.com"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                rosario.entradas.ok@gmail.com
              </a>{" "}
              o tel.{" "}
              <a
                href="tel:+543413092012"
                className="font-medium text-violet-400 hover:text-violet-300"
              >
                +54 341 309-2012
              </a>
              .
            </p>
          </section>
        </Card>
      </div>
    </PageContainer>
  );
}
