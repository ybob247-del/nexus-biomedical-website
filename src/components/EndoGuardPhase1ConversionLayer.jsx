import { useNavigate } from 'react-router-dom';
import brand, { brandifyDeep } from '../config/brand';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';
import '../styles/endoguard-phase1-conversion.css';

/**
 * EndoGuard Phase 1 Conversion Layer
 * 
 * STRUCTURAL ONLY - This component adds a conversion layer above the existing
 * EndoGuard assessment page. It does NOT modify, edit, or remove any existing content.
 * 
 * Purpose:
 * - Clearly explain the Phase 1 paid offer ($79-$99 one-time report)
 * - Drive users to the primary CTA: "Get My Hormone Risk Report"
 * - Maintain preventive positioning (not diagnostic)
 * - Preserve all existing assessment logic and Phase 2 content
 * 
 * Implementation:
 * - Added as a new section ABOVE the existing assessment
 * - Does NOT replace or edit existing EndoGuard page
 * - Does NOT change assessment flow or logic
 * - Does NOT add subscriptions, coaching, or new features
 */

export default function EndoGuardPhase1ConversionLayer() {
  const { t, i18n } = useTranslation();
  const { trackAction } = useAnalytics('endoguard_phase1');
  
  const navigate = useNavigate();
  const isSpanish = i18n.language?.startsWith('es');

  const handleCTAClick = () => {
    trackAction('phase1_cta_click', {
      language: i18n.language,
      timestamp: new Date().toISOString()
    });
    
    // If the assessment is already on this page, scroll to it.
    // Otherwise (e.g. the /endoguard marketing page) navigate to the assessment route.
    const assessmentSection = document.querySelector('#endoguard-assessment');
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(isSpanish && !brand.isConsumerBrand ? '/es/endoguard/assessment' : brand.routes.assessment);
    }
  };

  // Locked copy (English)
  const copyEN = {
    headline: "Understand Your Hormone Risk — Before Your Next Doctor's Visit",
    subheadline: "EndoGuard™ turns what you have been noticing into a clear one-page summary you can hand to your doctor — so the appointment starts from your record, not from scratch.",
    valueBullets: [
      "A clear one-page summary of what you reported",
      "The five things most worth raising first",
      "One clear next step"
    ],
    ctaButtonText: "Get My Hormone Risk Report",
    secondaryLine: "Not a diagnosis. No subscriptions. One clear report — built to support primary care–led evaluation.",
    footerDisclaimer: "EndoGuard™ is an educational tool. It does not diagnose disease, does not tell you what treatment to have, and does not replace medical care."
  };

  // Locked copy (Spanish) - Parallel structure
  const copyES = {
    headline: "Comprende Tu Riesgo Hormonal — Antes de Tu Próxima Visita al Médico",
    subheadline: "EndoGuard™ convierte lo que has estado notando en un resumen claro de una página que puedes entregar a tu médico — para que la consulta empiece desde tu registro, no desde cero.",
    valueBullets: [
      "Un resumen claro de una página de lo que reportaste",
      "Las cinco cosas más importantes que mencionar primero",
      "Un siguiente paso claro"
    ],
    ctaButtonText: "Obtén Mi Informe de Riesgo Hormonal",
    secondaryLine: "No es un diagnóstico. Sin suscripciones. Un informe claro — construido para apoyar la evaluación dirigida por atención primaria.",
    footerDisclaimer: "EndoGuard™ es una herramienta educativa. No diagnostica enfermedades, no indica qué tratamiento recibir, ni reemplaza la atención médica."
  };

  // Copy is written with the original product name; swap it for this brand.
  const copy = brandifyDeep(isSpanish ? copyES : copyEN);

  return (
    <section className="endoguard-phase1-conversion-layer">
      <div className="conversion-container">
        {/* Hero Section */}
        <div className="conversion-hero">
          <h1 className="conversion-headline">{copy.headline}</h1>
          <p className="conversion-subheadline">{copy.subheadline}</p>
        </div>

        {/* Value Bullets */}
        <div className="conversion-value-section">
          <ul className="value-bullets">
            {copy.valueBullets.map((bullet, index) => (
              <li key={index} className="value-bullet-item">
                <span className="bullet-icon">✓</span>
                <span className="bullet-text">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Primary CTA */}
        <div className="conversion-cta-section">
          <button 
            className="conversion-cta-button"
            onClick={handleCTAClick}
            aria-label={copy.ctaButtonText}
          >
            {copy.ctaButtonText}
          </button>
        </div>

        {/* Secondary Reassurance Line */}
        <p className="conversion-secondary-line">{copy.secondaryLine}</p>

        {/* Footer Disclaimer */}
        <p className="conversion-footer-disclaimer">{copy.footerDisclaimer}</p>
      </div>
    </section>
  );
}
