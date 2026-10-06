import { useTranslation } from 'react-i18next';

/**
 * Offers the free 14-day symptom tracker to visitors who are not ready for the
 * $39 kit, so they leave with something and join the email list instead of
 * leaving with nothing.
 *
 * The tracker pages are hosted by Kit on pages.notimaginingit.com. Sign-up
 * there is covered by the privacy policy (Kit is named as the email provider),
 * and nothing from the assessment is passed along: this is a plain link, with
 * no answers, results or identifiers in it.
 *
 * `variant="inline"` is a sentence under a button; `variant="card"` is a
 * short boxed offer for places with more room.
 */

export const TRACKER_URL = {
  en: 'https://pages.notimaginingit.com/tracker',
  es: 'https://pages.notimaginingit.com/registro',
};

const COPY = {
  en: {
    lead: 'Not ready yet?',
    link: 'Get the free 14-day symptom tracker',
    cardTitle: 'Not ready for the kit?',
    cardBody: 'Start with a free printable 14-day tracker. Two minutes a night, then bring patterns to your appointment instead of a jumbled list.',
    cardCta: 'Get the free tracker',
    note: 'Free. You will get a confirmation email with the PDF.',
  },
  es: {
    lead: '¿Aún no estás lista?',
    link: 'Descarga el registro de síntomas gratis de 14 días',
    cardTitle: '¿Todavía no quieres el kit?',
    cardBody: 'Empieza con un registro gratis de 14 días para imprimir. Dos minutos cada noche, y llevas patrones a tu consulta en vez de una lista revuelta.',
    cardCta: 'Descargar el registro gratis',
    note: 'Gratis. Recibirás un correo de confirmación con el PDF.',
  },
};

export default function FreeTrackerLink({ variant = 'inline' }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const c = COPY[lang];
  const href = TRACKER_URL[lang];

  if (variant === 'card') {
    return (
      <aside className="nii-free-tracker-card">
        <h3>{c.cardTitle}</h3>
        <p>{c.cardBody}</p>
        <a className="nii-free-tracker-button" href={href}>
          {c.cardCta}
        </a>
        <p className="nii-free-tracker-note">{c.note}</p>
      </aside>
    );
  }

  return (
    <p className="nii-free-tracker-inline">
      {c.lead}{' '}
      <a href={href}>{c.link}</a>
    </p>
  );
}
