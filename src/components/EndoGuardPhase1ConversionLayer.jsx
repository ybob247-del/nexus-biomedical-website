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
  
  const isSpanish = i18n.language === 'es';

  const handleCTAClick = () => {
    trackAction('phase1_cta_click', {
      language: i18n.language,
      timestamp: new Date().toISOString()
    });
    
    // Scroll to assessment section
    const assessmentSection = document.querySelector('.endoguard-assessment');
    if (assessmentSection) {
      assessmentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Locked copy (English)
  const copyEN = {
    headline: "Understand Your Hormone Risk — Before It Becomes a Diagnosis",
    subheadline: "EndoGuard™ is a preventive hormone risk stratification report designed to help you and your primary care provider identify early hormone-related risk — before years of confusion, misdiagnosis, or delayed care.",
    valueBullets: [
      "Personalized hormone risk tier: Low / Moderate / High",
      "Clear next-step guidance backed by peer-reviewed evidence",
      "PCP-ready summary you can bring to your doctor",
      "Preventive, non-diagnostic, designed for real-world care"
    ],
    ctaButtonText: "Get My Hormone Risk Report",
    secondaryLine: "Not a diagnosis. No subscriptions. One clear report — built to support primary care–led evaluation.",
    footerDisclaimer: "EndoGuard™ is a preventive screening and education tool. It does not diagnose disease or replace medical care."
  };

  // Locked copy (Spanish) - Parallel structure
  const copyES = {
    headline: "Comprende Tu Riesgo Hormonal — Antes de Convertirse en un Diagnóstico",
    subheadline: "EndoGuard™ es un informe de estratificación del riesgo hormonal preventivo diseñado para ayudarte a ti y a tu médico de atención primaria a identificar el riesgo hormonal temprano — antes de años de confusión, diagnóstico erróneo o atención retrasada.",
    valueBullets: [
      "Nivel de riesgo hormonal personalizado: Bajo / Moderado / Alto",
      "Orientación clara del próximo paso respaldada por evidencia revisada por pares",
      "Resumen listo para el médico de atención primaria que puedes llevar a tu doctor",
      "Preventivo, no diagnóstico, diseñado para la atención del mundo real"
    ],
    ctaButtonText: "Obtén Mi Informe de Riesgo Hormonal",
    secondaryLine: "No es un diagnóstico. Sin suscripciones. Un informe claro — construido para apoyar la evaluación dirigida por atención primaria.",
    footerDisclaimer: "EndoGuard™ es una herramienta de detección preventiva y educación. No diagnostica enfermedades ni reemplaza la atención médica."
  };

  const copy = isSpanish ? copyES : copyEN;

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
