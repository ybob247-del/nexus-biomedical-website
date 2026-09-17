import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import brand from '../config/brand';

/**
 * Frequently asked questions for the consumer brand's landing page.
 *
 * The first answer is the privacy promise in plain words. It has to stay true
 * to how the site works; the Privacy Policy has the detail.
 */
export default function ConsumerFAQ() {
  const { i18n } = useTranslation();
  const es = i18n.language?.startsWith('es');
  const price = brand.offer.priceLabel;
  const email = <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>;

  const items = es
    ? [
        {
          q: '¿Guardan mis respuestas o mis resultados?',
          a: (
            <>
              No. Tus respuestas se usan solo para calcular tus resultados y se te devuelven. No las
              guardamos en ninguna base de datos, no creamos cuentas y no vendemos tu información. Para
              redactar partes del resumen, algunas respuestas pasan por nuestro proveedor de IA, sin
              guardarse de nuestro lado. Detalles en la{' '}
              <Link to="/privacy">Política de privacidad</Link>.
            </>
          ),
        },
        {
          q: '¿Es un diagnóstico?',
          a: 'No. Es una herramienta educativa que organiza lo que notas para que puedas conversarlo con tu profesional de salud. No diagnostica ni trata ninguna enfermedad.',
        },
        {
          q: '¿Qué es gratis y qué incluye el pago?',
          a: `La evaluación y tu resumen son gratis. El Kit de preparación para tu consulta cuesta ${price}, pago único: desbloquea tus resultados completos y un PDF para imprimir.`,
        },
        {
          q: '¿Es una suscripción? ¿Y si no me sirve?',
          a: (
            <>
              No es una suscripción y no se te volverá a cobrar. Si el kit no te sirve, pide un
              reembolso completo dentro de 14 días. Ver la{' '}
              <Link to="/refund-policy">Política de reembolso</Link>.
            </>
          ),
        },
        {
          q: '¿Qué pasa si pierdo mi PDF?',
          a: 'Como no guardamos tus resultados, no podemos enviarte una copia. Descárgalo o imprímelo en cuanto lo tengas. Si lo pierdes, puedes volver a hacer la evaluación y escribirnos sobre tu compra.',
        },
        {
          q: '¿Quién puede ver lo que envío?',
          a: (
            <>
              Solo lo que tú nos envíes por correo (por ejemplo, un reporte de problema) lo ve nuestro
              equipo de soporte en {email}. Si te suscribes a nuestros correos, guardamos tu correo y
              tu nombre para enviártelos. Nunca vendemos tu información.
            </>
          ),
        },
      ]
    : [
        {
          q: 'Do you store my answers or results?',
          a: (
            <>
              No. Your answers are used only to calculate your results, which are sent back to you. We
              don&apos;t save them in any database, there are no accounts, and we never sell your
              information. To write parts of your summary, some answers pass through our AI provider;
              nothing is kept on our side. Details are in the{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </>
          ),
        },
        {
          q: 'Is this a diagnosis?',
          a: 'No. It is an educational tool that organizes what you have been noticing so you can talk it through with your clinician. It does not diagnose or treat any condition.',
        },
        {
          q: 'What is free, and what does the kit add?',
          a: `The assessment and your summary are free. The Appointment Prep Kit is ${price}, one time: it unlocks your full results and a printable PDF.`,
        },
        {
          q: 'Is it a subscription? What if it doesn’t help?',
          a: (
            <>
              It is not a subscription, and you won&apos;t be charged again. If the kit doesn&apos;t
              help, ask for a full refund within 14 days. See the{' '}
              <Link to="/refund-policy">Refund Policy</Link>.
            </>
          ),
        },
        {
          q: 'What if I lose my PDF?',
          a: 'Because we don’t keep your results, we can’t send you a copy. Download or print it as soon as you have it. If you lose it, you can retake the assessment and email us about your purchase.',
        },
        {
          q: 'Who can see what I send you?',
          a: (
            <>
              Only what you email us yourself (for example a problem report) is seen by our support team
              at {email}. If you join our email list, we keep your email and name to send you those
              emails. We never sell your information.
            </>
          ),
        },
      ];

  return (
    <section className="nii-faq" aria-labelledby="nii-faq-title">
      <h2 id="nii-faq-title">{es ? 'Preguntas frecuentes' : 'Frequently Asked Questions'}</h2>
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <div className="nii-faq-answer">{item.a}</div>
        </details>
      ))}
    </section>
  );
}
