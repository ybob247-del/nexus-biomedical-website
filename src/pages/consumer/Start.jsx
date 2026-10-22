import { useEffect } from 'react';
import brand from '../../config/brand';
import NiiMark from '../../components/brand/NiiMark';
import '../../styles/consumer-start.css';

/**
 * /start: the single link for every social bio (TikTok allows only one).
 *
 * Bilingual on purpose, with no toggle: both languages are shown at once so a
 * viewer picks theirs with one tap. Two buttons and nothing else: no form, no
 * pitch. It carries no tracking code of its own. The only counter on this site
 * is the cookie-free aggregate Cloudflare beacon in the page head, described in
 * the privacy policy.
 */
const TRACKER_EN = 'https://pages.notimaginingit.com/tracker';
const TRACKER_ES = 'https://pages.notimaginingit.com/registro';

export default function Start() {
  useEffect(() => {
    const prev = document.title;
    document.title = 'Not Imagining It: Free 14-Day Tracker / Guía gratuita de 14 días';
    return () => { document.title = prev; };
  }, []);

  return (
    <main className="nii-start">
      <div className="nii-start-mark" aria-hidden="true"><NiiMark size={56} /></div>
      <h1 className="nii-start-name">{brand.name}</h1>
      <p className="nii-start-pick">Pick your language <span aria-hidden="true">/</span> Elige tu idioma</p>

      <a className="nii-start-btn nii-start-btn-en" href={TRACKER_EN} lang="en">
        <span className="nii-start-btn-main">Free 14-Day Tracker</span>
        <span className="nii-start-btn-sub">English</span>
      </a>
      <a className="nii-start-btn nii-start-btn-es" href={TRACKER_ES} lang="es">
        <span className="nii-start-btn-main">Guía gratuita de 14 días</span>
        <span className="nii-start-btn-sub">Español</span>
      </a>

      <p className="nii-start-note">Educational only. Not medical advice. / Solo educativo. No es consejo médico.</p>
    </main>
  );
}
