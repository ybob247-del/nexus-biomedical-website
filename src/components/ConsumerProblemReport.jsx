import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import brand from '../config/brand';

/**
 * "Report a problem" for the consumer brand.
 *
 * The Nexus bug widget captures a screenshot of the page and stores it, with the
 * visitor's email and IP address, in a database. On this site the page can show
 * someone's health answers, and the site promises never to save them. So this
 * version stores nothing: it prepares an email to support in the visitor's own
 * mail app, shows exactly what will be included, and warns them not to add
 * health details. Any screenshot is theirs to attach, or not.
 */
export default function ConsumerProblemReport() {
  const { i18n } = useTranslation();
  const es = i18n.language?.startsWith('es');
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [includeTechnical, setIncludeTechnical] = useState(true);

  // Page address without the query string or hash: a Stripe session id or any
  // other parameter stays out of the email.
  const pageAddress = `${window.location.origin}${window.location.pathname}`;
  const technical = `${es ? 'Página' : 'Page'}: ${pageAddress}\n${es ? 'Navegador' : 'Browser'}: ${navigator.userAgent}`;

  const openEmail = () => {
    const subject = es ? 'Reporte de un problema en el sitio' : 'Website problem report';
    const body = [
      description.trim() || (es ? '(Describe qué pasó)' : '(Describe what happened)'),
      includeTechnical ? `\n---\n${technical}` : '',
    ].join('\n');
    window.location.href = `mailto:${brand.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpen(false);
  };

  return (
    <>
      <button type="button" className="nii-report-button" onClick={() => setOpen(true)}>
        {es ? 'Reportar un problema' : 'Report a problem'}
      </button>

      {open && (
        <div className="nii-report-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="nii-report-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nii-report-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="nii-report-title">{es ? 'Reportar un problema' : 'Report a problem'}</h2>

            <p className="nii-report-notice">
              {es
                ? 'Esto abre un correo a nuestro equipo de soporte. Solo lo ve soporte, nunca lo vendemos y no se guarda en este sitio. Por favor, no escribas tus síntomas, respuestas ni otros datos de salud. Si agregas una captura de pantalla, recorta o tapa cualquier información personal.'
                : 'This opens an email to our support team. Only support sees it, we never sell it, and nothing is saved on this site. Please don’t include your symptoms, answers or other health details. If you attach a screenshot, crop or cover any personal information first.'}
            </p>

            <label htmlFor="nii-report-description">
              {es ? '¿Qué pasó?' : 'What went wrong?'}
            </label>
            <textarea
              id="nii-report-description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={es ? 'Ej.: el botón de pago no hizo nada' : 'e.g. the payment button did nothing'}
            />

            <label className="nii-report-check">
              <input
                type="checkbox"
                checked={includeTechnical}
                onChange={(e) => setIncludeTechnical(e.target.checked)}
              />
              <span>
                {es
                  ? 'Incluir la dirección de la página y el tipo de navegador (ayuda a encontrar el problema):'
                  : 'Include the page address and browser type (helps us find the problem):'}
              </span>
            </label>
            {includeTechnical && <pre className="nii-report-technical">{technical}</pre>}

            <div className="nii-report-actions">
              <button type="button" className="nii-report-cancel" onClick={() => setOpen(false)}>
                {es ? 'Cancelar' : 'Cancel'}
              </button>
              <button type="button" className="nii-report-send" onClick={openEmail}>
                {es ? 'Abrir correo para enviar' : 'Open email to send'}
              </button>
            </div>
            <p className="nii-report-fallback">
              {es ? '¿No se abrió tu correo? Escríbenos a ' : 'Email app didn’t open? Write to '}
              <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
