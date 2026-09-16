import { useTranslation } from 'react-i18next';
import brand from '../config/brand';
import LegalPage from './consumer-legal/LegalPage';

/**
 * Refund policy for the consumer brand's one-time purchase.
 *
 * Card networks and Stripe expect a site that sells to state its refund terms
 * plainly. Kept short and in plain language on purpose. English and Spanish
 * live side by side so they stay in sync.
 */
export default function RefundPolicy() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  const { priceLabel } = brand.offer;
  const email = <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>;

  if (lang === 'es') {
    return (
      <LegalPage
        title="Política de reembolso"
        updated="Última actualización: 16 de septiembre de 2026"
      >
        <h2>Qué estás comprando</h2>
        <p>
          El Kit de preparación para tu consulta es una compra digital única de {priceLabel} (USD). No
          es una suscripción y no se te volverá a cobrar. Tienes acceso a tus resultados completos y a
          un PDF para imprimir justo después del pago.
        </p>

        <h2>Reembolso dentro de 14 días</h2>
        <p>
          Si el kit no te sirvió, escríbenos a{' '}
          <a href={`mailto:${brand.supportEmail}?subject=Solicitud%20de%20reembolso`}>
            {brand.supportEmail}
          </a>{' '}
          dentro de los 14 días posteriores a tu compra y pide un reembolso. Incluye el correo
          electrónico que usaste al pagar. No necesitas darnos un motivo.
        </p>
        <p>
          Te devolvemos el monto completo a la tarjeta o al medio de pago que usaste. Por lo general
          enviamos el reembolso dentro de los 3 días hábiles siguientes a tu solicitud, y tu banco puede
          tardar entre 5 y 10 días hábiles más en reflejarlo.
        </p>

        <h2>Cobros duplicados o por error</h2>
        <p>
          Si se te cobró dos veces o por error, escríbenos en cualquier momento y te devolveremos el
          cobro de más.
        </p>

        <h2>Preguntas</h2>
        <p>
          Escríbenos a {email}. {brand.name} es una marca de {brand.legalName}.
        </p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Refund Policy" updated="Last updated September 16, 2026">
      <h2>What you are buying</h2>
      <p>
        The Appointment Prep Kit is a one-time digital purchase of {priceLabel} (US). It is not a
        subscription, and you will not be charged again. You get access to your full results and a
        printable PDF right after payment.
      </p>

      <h2>14-day refund</h2>
      <p>
        If the kit did not help you, email{' '}
        <a href={`mailto:${brand.supportEmail}?subject=Refund%20request`}>{brand.supportEmail}</a>{' '}
        within 14 days of your purchase and ask for a refund. Include the email address you used at
        checkout. You do not need to give a reason.
      </p>
      <p>
        We refund the full amount to the card or payment method you used. Refunds are usually sent
        within 3 business days of your request, and your bank may take a further 5 to 10 business
        days to show them.
      </p>

      <h2>Duplicate or mistaken charges</h2>
      <p>
        If you were charged twice or charged in error, email us at any time and we will refund the
        extra charge.
      </p>

      <h2>Questions</h2>
      <p>
        Email {email}. {brand.name} is a brand of {brand.legalName}.
      </p>
    </LegalPage>
  );
}
