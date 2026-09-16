import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import brand from '../../config/brand';

/**
 * Shared layout for the consumer legal pages (privacy, terms, medical
 * disclaimer, refunds). Each page passes its already-localized title, date
 * line and body; this adds the heading, the "On this site" links and the
 * page title.
 */
const NAV_LABELS = {
  en: {
    heading: 'On this site',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    medical: 'Medical Disclaimer',
    refund: 'Refund Policy',
  },
  es: {
    heading: 'En este sitio',
    privacy: 'Política de privacidad',
    terms: 'Términos del servicio',
    medical: 'Aviso médico',
    refund: 'Política de reembolso',
  },
};

export default function LegalPage({ title, updated, children }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const labels = NAV_LABELS[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = `${title} — ${brand.name}`;
  }, [title]);

  return (
    <main className="nii-legal">
      <h1>{title}</h1>
      <p className="nii-legal-updated">{updated}</p>

      {children}

      <nav className="nii-legal-nav" aria-label={labels.heading}>
        <h2>{labels.heading}</h2>
        <ul>
          <li><Link to="/privacy">{labels.privacy}</Link></li>
          <li><Link to="/terms">{labels.terms}</Link></li>
          <li><Link to="/medical-disclaimer">{labels.medical}</Link></li>
          <li><Link to="/refund-policy">{labels.refund}</Link></li>
        </ul>
      </nav>
    </main>
  );
}
