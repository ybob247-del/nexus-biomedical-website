import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';
import '../styles/endoguard-phase1-paywall.css';

/**
 * EndoGuard Phase 1 Paywall Component
 * 
 * LOCKED COPY — Phase 1 Paywall
 * 
 * This component displays the Phase 1 paywall with:
 * - Locked headline, subheadline, value bullets, and CTA
 * - EN/ES toggle support
 * - $79 one-time payment (no subscriptions)
 * - Routes to Stripe checkout
 * - No diagnostic claims
 * - Preserves assessment logic
 */

export default function EndoGuardPhase1Paywall() {
  const { t, i18n } = useTranslation();
  const { trackAction } = useAnalytics('endoguard_phase1_paywall');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isSpanish = i18n.language === 'es';

  // LOCKED COPY — English
  const copyEN = {
    headline: "Understand Your Hormone Risk — Before It Becomes a Diagnosis",
    subheadline: "A one-time preventive hormone risk report that helps you decide whether it makes sense to talk to a doctor — and what to talk about.",
    valueBullets: [
      "Clear next step — Understand whether your symptoms and exposures suggest patterns worth medical attention",
      "Doctor-ready summary — Share a concise, primary-care–friendly summary at your visit",
      "Evidence-informed — Based on peer-reviewed medical literature and preventive screening principles",
      "No diagnosis, no subscriptions — One-time report designed to support informed decisions, not replace care"
    ],
    ctaButtonText: "Unlock My Hormone Risk Report — $79 (One-Time)",
    ctaSubtext: "(No subscription. No recurring charges.)",
    disclaimer: "Important: EndoGuard™ is a preventive screening tool. It does not diagnose medical conditions or replace professional medical care. Results are based on self-reported information and are intended to support earlier, more informed conversations with a healthcare provider."
  };

  // LOCKED COPY — US-Spanish (Neutral Spanish, not Spain)
  const copyES = {
    headline: "Comprenda su riesgo hormonal — antes de que se convierta en un diagnóstico",
    subheadline: "Un informe preventivo de riesgo hormonal, de pago único, que le ayuda a decidir si conviene hablar con un médico — y sobre qué hablar.",
    valueBullets: [
      "Siguiente paso claro — Comprenda si sus síntomas y exposiciones muestran patrones que merecen atención médica",
      "Resumen listo para su médico — Comparta un resumen claro y fácil de revisar en su consulta",
      "Basado en evidencia — Fundamentado en literatura médica revisada por expertos y principios de prevención",
      "Sin diagnóstico ni suscripciones — Informe de una sola vez diseñado para apoyar decisiones informadas"
    ],
    ctaButtonText: "Desbloquear mi informe de riesgo hormonal — $79 (Pago único)",
    ctaSubtext: "(Sin suscripción. Sin cargos recurrentes.)",
    disclaimer: "Importante: EndoGuard™ es una herramienta de evaluación preventiva. No diagnostica condiciones médicas ni reemplaza la atención médica profesional. Los resultados se basan en información autodeclarada y están diseñados para apoyar conversaciones médicas más tempranas e informadas."
  };

  const copy = isSpanish ? copyES : copyEN;

  const handleUnlockClick = async () => {
    try {
      setIsProcessing(true);
      trackAction('paywall_cta_click', {
        language: i18n.language,
        price: 79,
        currency: 'USD',
        timestamp: new Date().toISOString()
      });

      // Call backend to create Stripe checkout session
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: process.env.REACT_APP_ENDOGUARD_PRICE_ID || 'price_endoguard_phase1',
          language: i18n.language,
          successUrl: `${window.location.origin}/endoguard/payment-success`,
          cancelUrl: `${window.location.origin}/endoguard/assessment`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionUrl } = await response.json();
      
      // Redirect to Stripe checkout
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Unable to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <section className="endoguard-phase1-paywall">
      <div className="paywall-container">
        {/* Header Section */}
        <div className="paywall-header">
          <h1 className="paywall-headline">{copy.headline}</h1>
          <p className="paywall-subheadline">{copy.subheadline}</p>
        </div>

        {/* Value Bullets */}
        <div className="paywall-value-section">
          <ul className="paywall-bullets">
            {copy.valueBullets.map((bullet, index) => (
              <li key={index} className="paywall-bullet-item">
                <span className="bullet-icon">✓</span>
                <span className="bullet-text">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Section */}
        <div className="paywall-cta-section">
          <button
            className="paywall-cta-button"
            onClick={handleUnlockClick}
            disabled={isProcessing}
            aria-label={copy.ctaButtonText}
          >
            {isProcessing ? 'Processing...' : copy.ctaButtonText}
          </button>
          <p className="paywall-cta-subtext">{copy.ctaSubtext}</p>
        </div>

        {/* Disclaimer */}
        <div className="paywall-disclaimer-section">
          <p className="paywall-disclaimer">{copy.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
