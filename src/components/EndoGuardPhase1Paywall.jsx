import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';
import brand from '../config/brand';
import '../styles/endoguard-phase1-paywall.css';

/**
 * Paid offer shown after the free assessment.
 *
 * The offer (price, sku, and whether results are held back) comes from brand
 * config. Nexus shows its original one-time report. Not Imagining It sells the
 * Appointment Prep Kit, which unlocks the rest of the results and the PDF.
 *
 * Before sending the buyer to Stripe, the results are kept on this device so
 * they are still there when the buyer returns. Nothing is sent to our servers.
 */

export const PENDING_RESULTS_KEY = 'nii_pending_results';

export default function EndoGuardPhase1Paywall({ results }) {
  const { i18n } = useTranslation();
  const { trackAction } = useAnalytics('endoguard_phase1_paywall');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isSpanish = i18n.language === 'es';
  const offer = brand.offer;

  const nexusEN = {
    headline: "Understand Your Hormone Risk — Before Your Next Doctor's Visit",
    subheadline: "A one-time preventive hormone risk report that helps you decide whether it makes sense to talk to a doctor — and what to talk about.",
    valueBullets: [
      "Clear next step — Understand whether your symptoms and exposures suggest patterns worth medical attention",
      "Doctor-ready summary — Share a concise, primary-care–friendly summary at your visit",
      "Sources listed — Every source we reference is listed in your report with its citation",
      "No diagnosis, no subscriptions — One-time report designed to support informed decisions, not replace care"
    ],
    ctaButtonText: `Unlock My Hormone Risk Report — ${offer.priceLabel} (One-Time)`,
    ctaSubtext: "(No subscription. No recurring charges.)",
    disclaimer: "Important: EndoGuard™ is an educational tool. It does not diagnose medical conditions, does not recommend treatment, and does not replace professional medical care. Results are based on self-reported information and are intended to support earlier, more informed conversations with a healthcare provider."
  };

  const nexusES = {
    headline: "Comprenda su riesgo hormonal — antes de su próxima visita al médico",
    subheadline: "Un informe preventivo de riesgo hormonal, de pago único, que le ayuda a decidir si conviene hablar con un médico — y sobre qué hablar.",
    valueBullets: [
      "Siguiente paso claro — Comprenda si sus síntomas y exposiciones muestran patrones que merecen atención médica",
      "Resumen listo para su médico — Comparta un resumen claro y fácil de revisar en su consulta",
      "Fuentes listadas — Cada fuente que referenciamos aparece en su informe con su cita",
      "Sin diagnóstico ni suscripciones — Informe de una sola vez diseñado para apoyar decisiones informadas"
    ],
    ctaButtonText: `Desbloquear mi informe de riesgo hormonal — ${offer.priceLabel} (Pago único)`,
    ctaSubtext: "(Sin suscripción. Sin cargos recurrentes.)",
    disclaimer: "Importante: EndoGuard™ es una herramienta educativa. No diagnostica condiciones médicas, no recomienda tratamientos ni reemplaza la atención médica profesional. Los resultados se basan en información autodeclarada y están diseñados para apoyar conversaciones médicas más tempranas e informadas."
  };

  const kitEN = {
    headline: "Get Your Appointment Prep Kit",
    subheadline: "Your summary is above. The kit unlocks the rest of your results and a printable PDF, organized so your next appointment starts from your record instead of from scratch.",
    valueBullets: [
      "Your complete results — Every section of your assessment, not just the summary",
      "Tests worth discussing — Lab tests you could ask your clinician about, based on what you reported",
      "Recommendations and next steps — Organized so you know what to bring up first",
      "A printable PDF — Yours to keep, or to hand to your clinician"
    ],
    ctaButtonText: `Get My Appointment Prep Kit — ${offer.priceLabel} (One-Time)`,
    ctaSubtext: "(No subscription. No recurring charges.)",
    disclaimer: `Important: ${brand.name} is an educational tool. It does not diagnose medical conditions, does not recommend treatment, and does not replace professional medical care. It organizes what you reported so you can have a more informed conversation with a healthcare provider.`
  };

  const kitES = {
    headline: "Obtén tu kit para la consulta",
    subheadline: "Tu resumen está arriba. El kit desbloquea el resto de tus resultados y un PDF para imprimir, organizado para que tu próxima consulta empiece desde tu registro y no desde cero.",
    valueBullets: [
      "Tus resultados completos — Cada sección de tu evaluación, no solo el resumen",
      "Análisis que vale la pena conversar — Pruebas de laboratorio que podrías consultar con tu médico, según lo que reportaste",
      "Recomendaciones y próximos pasos — Organizados para que sepas qué mencionar primero",
      "Un PDF para imprimir — Para guardarlo o entregárselo a tu médico"
    ],
    ctaButtonText: `Obtener mi kit para la consulta — ${offer.priceLabel} (Pago único)`,
    ctaSubtext: "(Sin suscripción. Sin cargos recurrentes.)",
    disclaimer: `Importante: ${brand.name} es una herramienta educativa. No diagnostica condiciones médicas, no recomienda tratamientos ni reemplaza la atención médica profesional. Organiza lo que reportaste para que tengas una conversación más informada con un profesional de la salud.`
  };

  const copy = brand.isConsumerBrand
    ? (isSpanish ? kitES : kitEN)
    : (isSpanish ? nexusES : nexusEN);

  const handleUnlockClick = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(isSpanish ? 'Ingrese un correo electrónico válido.' : 'Please enter a valid email address.');
      return;
    }
    if (!import.meta.env.VITE_ENDOGUARD_PRICE_ID) {
      setError(isSpanish
        ? 'El pago no está configurado todavía. Intente más tarde.'
        : 'Checkout is not configured yet. Please try again later.');
      return;
    }

    try {
      setError('');
      setIsProcessing(true);
      trackAction('paywall_cta_click', {
        language: i18n.language,
        price: offer.amountCents / 100,
        sku: offer.sku,
        currency: 'USD',
        timestamp: new Date().toISOString()
      });

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: import.meta.env.VITE_ENDOGUARD_PRICE_ID,
          email,
          platform: 'endoguard',
          sku: offer.sku,
          successPath: brand.routes.assessment,
          cancelPath: brand.routes.assessment,
          language: i18n.language
        })
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      const checkoutUrl = data.url || data.sessionUrl;

      if (!checkoutUrl) {
        throw new Error('No checkout URL returned');
      }

      // Keep the results on this device so they are still here when the buyer
      // returns from checkout. Nothing is sent to our servers.
      if (results) {
        try {
          localStorage.setItem(PENDING_RESULTS_KEY, JSON.stringify({ results, savedAt: Date.now() }));
        } catch (storageError) {
          console.warn('Could not keep results on this device:', storageError);
        }
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(isSpanish
        ? 'No pudimos iniciar el pago. Verifique su correo e intente de nuevo.'
        : "We couldn't start checkout. Check your email address and try again.");
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
          <label className="paywall-email-label" htmlFor="paywall-email">
            {isSpanish ? 'Correo electrónico (para el recibo)' : 'Email address (for your receipt)'}
          </label>
          <input
            id="paywall-email"
            className="paywall-email-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isSpanish ? 'nombre@ejemplo.com' : 'you@example.com'}
            disabled={isProcessing}
          />
          {error && <p className="paywall-error" role="alert">{error}</p>}
          <button
            className="paywall-cta-button"
            onClick={handleUnlockClick}
            disabled={isProcessing}
            aria-label={copy.ctaButtonText}
          >
            {isProcessing ? (isSpanish ? 'Procesando...' : 'Processing...') : copy.ctaButtonText}
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
