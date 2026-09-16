import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import brand from '../../config/brand';
import LegalPage from './LegalPage';

/**
 * Terms of service for the consumer brand. Short and plain on purpose.
 * No arbitration clause and no class-action waiver, by design.
 * English and Spanish live side by side so they stay in sync.
 */
export default function TermsOfService() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  const email = <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>;
  const price = brand.offer.priceLabel;

  if (lang === 'es') {
    return (
      <LegalPage
        title="Términos del servicio"
        updated="Última actualización: 16 de septiembre de 2026"
      >
        <h2>Acerca de estos términos</h2>
        <p>
          Estos términos se aplican a tu uso de {brand.domain}. {brand.name} es una marca de{' '}
          {brand.legalName}, una empresa de Texas, Estados Unidos (&quot;nosotros&quot;). Al usar el
          sitio, aceptas estos términos. Si no estás de acuerdo, por favor no lo uses.
        </p>

        <h2>Quién puede usar el sitio</h2>
        <p>
          Debes tener 18 años o más. El sitio es para tu uso personal, no comercial.
        </p>

        <h2>Qué es y qué no es</h2>
        <p>
          {brand.name} es una herramienta educativa que te ayuda a preparar una conversación con tu
          médico. No diagnostica, no trata ninguna enfermedad y no reemplaza a un profesional de la
          salud. Lee nuestro <Link to="/medical-disclaimer">aviso médico</Link>.
        </p>

        <h2>Tu compra</h2>
        <ul>
          <li>El Kit de preparación para tu consulta es un producto digital de pago único de {price}.
            No es una suscripción.</li>
          <li>Se entrega de inmediato en tu navegador después del pago.</li>
          <li>El precio se muestra en dólares estadounidenses (USD) al pagar. Tu banco podría cobrarte
            comisiones por conversión de moneda.</li>
          <li>Los pagos los procesa Stripe.</li>
          <li>Los reembolsos se rigen por nuestra{' '}
            <Link to="/refund-policy">política de reembolso</Link>.</li>
        </ul>

        <h2>Texto escrito con IA</h2>
        <p>
          Partes de tus resultados las redacta un sistema de inteligencia artificial. Ese texto puede ser
          incorrecto o estar incompleto. No lo tomes como consejo médico.
        </p>

        <h2>Uso aceptable</h2>
        <p>Por favor, no:</p>
        <ul>
          <li>Extraigas contenido del sitio de forma automatizada (scraping).</li>
          <li>Intentes atacar, sobrecargar o interferir con el sitio.</li>
          <li>Revendas, copies o redistribuyas nuestro contenido.</li>
        </ul>

        <h2>Nuestro contenido</h2>
        <p>
          El contenido y el diseño del sitio pertenecen a {brand.legalName}. Puedes guardar e imprimir
          tus propios resultados y tu PDF para uso personal, incluso para compartirlos con tu médico.
        </p>

        <h2>Sin garantías</h2>
        <p>
          El sitio y su contenido se ofrecen &quot;tal cual&quot;. En la medida en que la ley lo
          permita, no ofrecemos garantías de ningún tipo, incluida la de que los resultados sean
          exactos, completos o adecuados para tu situación.
        </p>

        <h2>Límite de responsabilidad</h2>
        <p>
          En la medida en que la ley lo permita, nuestra responsabilidad total hacia ti se limita a lo
          que nos hayas pagado en los 12 meses anteriores o, si no nos pagaste nada, a 50 dólares
          estadounidenses. Algunas leyes no permiten estos límites. En ese caso, no se aplican a ti.
        </p>

        <h2>Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de Texas, Estados Unidos. Esto no te quita las
          protecciones obligatorias para consumidores del país o estado donde vives.
        </p>

        <h2>Cambios a estos términos</h2>
        <p>
          Podemos actualizar estos términos. Publicaremos la nueva versión aquí con una fecha nueva. Los
          cambios se aplican desde ese momento en adelante.
        </p>

        <h2>Contacto</h2>
        <p>¿Preguntas? Escríbenos a {email}.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Terms of Service" updated="Last updated September 16, 2026">
      <h2>About these terms</h2>
      <p>
        These terms cover your use of {brand.domain}. {brand.name} is a brand of {brand.legalName}, a
        business based in Texas, USA (&quot;we&quot; or &quot;us&quot;). By using the site, you agree to
        these terms. If you don&apos;t agree, please don&apos;t use it.
      </p>

      <h2>Who can use the site</h2>
      <p>You must be 18 or older. The site is for your personal, non-commercial use.</p>

      <h2>What it is, and what it isn&apos;t</h2>
      <p>
        {brand.name} is an educational tool that helps you prepare for a conversation with your
        clinician. It does not diagnose or treat any condition, and it does not replace a clinician.
        Please read our <Link to="/medical-disclaimer">Medical Disclaimer</Link>.
      </p>

      <h2>Your purchase</h2>
      <ul>
        <li>The Appointment Prep Kit is a one-time digital product for {price}. It is not a
          subscription.</li>
        <li>It is delivered immediately in your browser after payment.</li>
        <li>The price is shown in US dollars (USD) at checkout. Your bank may charge currency
          conversion fees.</li>
        <li>Payments are processed by Stripe.</li>
        <li>Refunds follow our <Link to="/refund-policy">Refund Policy</Link>.</li>
      </ul>

      <h2>AI-written text</h2>
      <p>
        Parts of your results are written by an AI system. That text can be wrong or incomplete. Don&apos;t
        treat it as medical advice.
      </p>

      <h2>Using the site fairly</h2>
      <p>Please don&apos;t:</p>
      <ul>
        <li>Scrape or copy the site with automated tools.</li>
        <li>Try to attack, overload or interfere with the site.</li>
        <li>Resell, copy or redistribute our content.</li>
      </ul>

      <h2>Our content</h2>
      <p>
        The site&apos;s content and design belong to {brand.legalName}. You may save and print your own
        results and PDF for personal use, including sharing them with your clinician.
      </p>

      <h2>No warranty</h2>
      <p>
        The site and its content are provided &quot;as is.&quot; To the extent the law allows, we make no
        warranties of any kind, including that results are accurate, complete or right for your
        situation.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, our total liability to you is limited to the amount you paid us in
        the 12 months before the claim, or US$50 if you paid us nothing. Some laws don&apos;t allow
        these limits. Where that&apos;s the case, they don&apos;t apply to you.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Texas, USA. This does not take away any mandatory
        consumer protections you have under the laws of the country or state where you live.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. We will post the new version here with a new date. Changes apply
        from then on.
      </p>

      <h2>Contact</h2>
      <p>Questions? Email {email}.</p>
    </LegalPage>
  );
}
