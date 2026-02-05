import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import '../styles/spanish-landing.css';

const RxGuardSpanishLanding = () => {
  return (
    <div className="spanish-landing">
      <Helmet>
        <title>RxGuard™ - Verificador de Interacciones Medicamentosas con IA | Nexus Biomedical Intelligence</title>
        <meta name="description" content="RxGuard™ utiliza inteligencia artificial para detectar interacciones peligrosas entre medicamentos. Proteja su salud con análisis instantáneo de sus medicamentos. Prueba gratuita de 14 días." />
        <meta name="keywords" content="interacciones medicamentosas, verificador de medicamentos, seguridad farmacéutica, IA médica, RxGuard, análisis de medicamentos" />
        <link rel="canonical" href="https://www.nexusbiomedical.ai/es/rxguard" />
        <meta property="og:title" content="RxGuard™ - Verificador de Interacciones Medicamentosas con IA" />
        <meta property="og:description" content="Detecte interacciones peligrosas entre medicamentos con IA avanzada. Prueba gratuita de 14 días." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.nexusbiomedical.ai/es/rxguard" />
        <link rel="alternate" hreflang="en" href="https://www.nexusbiomedical.ai/en/rxguard" />
        <link rel="alternate" hreflang="es" href="https://www.nexusbiomedical.ai/es/rxguard" />
        <link rel="alternate" hreflang="x-default" href="https://www.nexusbiomedical.ai/rxguard" />
      </Helmet>

      {/* Hero Section */}
      <section className="spanish-hero">
        <div className="container">
          <div className="hero-content">
            <div className="platform-badge">
              <span className="badge-icon">💊</span>
              <span>RxGuard™</span>
            </div>
            <h1 className="hero-title">
              Proteja su Salud con<br />
              <span className="gradient-text">Verificación Inteligente de Medicamentos</span>
            </h1>
            <p className="hero-subtitle">
              Identifique posibles interacciones medicamentosas para discutir con su farmacéutico o proveedor de salud.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">275,000+</div>
                <div className="stat-label">Visitas al hospital prevenibles por interacciones medicamentosas cada año</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">$30B+</div>
                <div className="stat-label">Costo anual de interacciones medicamentosas en EE.UU.</div>
              </div>
            </div>
            <div className="hero-cta">
              <Link to="/signup" className="cta-button primary">
                Comenzar Prueba Gratuita de 14 Días
              </Link>
              <Link to="/rxguard/dashboard" className="cta-button secondary">
                Ver Demo Interactiva
              </Link>
            </div>
            <p className="hero-note">✨ Sin tarjeta de crédito requerida • Cancele en cualquier momento</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="container">
          <h2 className="section-title">El Problema: Interacciones Medicamentosas Peligrosas</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">⚠️</div>
              <h3>1 de cada 5 adultos</h3>
              <p>toma 5 o más medicamentos simultáneamente, aumentando el riesgo de interacciones peligrosas</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">🏥</div>
              <h3>275,000 hospitalizaciones</h3>
              <p>por año en EE.UU. son causadas por interacciones medicamentosas prevenibles</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">💰</div>
              <h3>$30 mil millones</h3>
              <p>en costos de atención médica cada año debido a interacciones medicamentosas</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">👨‍⚕️</div>
              <h3>Sobrecarga de farmacéuticos</h3>
              <p>Los farmacéuticos verifican cientos de recetas diariamente, aumentando el riesgo de errores</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Cómo Funciona RxGuard™</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Ingrese Sus Medicamentos</h3>
              <p>Agregue todos sus medicamentos recetados, de venta libre, suplementos y vitaminas a su lista personal</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Análisis con IA</h3>
              <p>Nuestra IA analiza instantáneamente su lista contra bases de datos de FDA, RxNorm y literatura médica</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Reciba Alertas Inteligentes</h3>
              <p>Obtenga alertas codificadas por color (Bajo/Moderado/Alto riesgo) con explicaciones clínicas detalladas</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Tome Acción</h3>
              <p>Comparta el informe con su médico, explore alternativas más seguras y monitoree su salud</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Características Poderosas de RxGuard™</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Búsqueda Inteligente de Medicamentos</h3>
              <p>Base de datos de 100,000+ medicamentos con autocompletado y búsqueda por nombre genérico o comercial</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Detección en Tiempo Real</h3>
              <p>Análisis instantáneo de interacciones mientras agrega medicamentos a su lista</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Puntuación de Riesgo</h3>
              <p>Sistema de puntuación claro (Bajo/Moderado/Alto) basado en severidad y evidencia científica</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Alternativas Más Seguras</h3>
              <p>Sugerencias de medicamentos alternativos con menor riesgo de interacciones</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Acceso Móvil</h3>
              <p>Verifique medicamentos en cualquier lugar desde su teléfono o tableta</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacidad Garantizada</h3>
              <p>Sus datos médicos están encriptados y nunca se comparten sin su permiso</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Informes en PDF</h3>
              <p>Descargue informes profesionales para compartir con su médico o farmacéutico</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Alertas Automáticas</h3>
              <p>Reciba notificaciones cuando se descubran nuevas interacciones en su lista</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title">Planes y Precios</h2>
          <p className="pricing-subtitle">Elija el plan que mejor se adapte a sus necesidades</p>
          <div className="pricing-grid">
            {/* Basic Plan */}
            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">Básico</h3>
                <div className="plan-price">
                  <span className="price-amount">$39</span>
                  <span className="price-period">/mes</span>
                </div>
              </div>
              <ul className="plan-features">
                <li>✅ Hasta 10 medicamentos</li>
                <li>✅ Detección de interacciones en tiempo real</li>
                <li>✅ Alertas de riesgo codificadas por color</li>
                <li>✅ Base de datos de FDA y RxNorm</li>
                <li>✅ Informes en PDF</li>
                <li>✅ Acceso móvil</li>
                <li>✅ Soporte por email</li>
              </ul>
              <Link to="/signup" className="plan-button">
                Comenzar Prueba Gratuita
              </Link>
              <p className="plan-note">14 días gratis • Sin tarjeta requerida</p>
            </div>

            {/* Premium Plan */}
            <div className="pricing-card featured">
              <div className="popular-badge">Más Popular</div>
              <div className="plan-header">
                <h3 className="plan-name">Premium</h3>
                <div className="plan-price">
                  <span className="price-amount">$79</span>
                  <span className="price-period">/mes</span>
                </div>
              </div>
              <ul className="plan-features">
                <li>✅ Medicamentos ilimitados</li>
                <li>✅ Análisis con IA avanzada</li>
                <li>✅ Sugerencias de alternativas más seguras</li>
                <li>✅ Estrategias de mitigación clínica</li>
                <li>✅ Alertas automáticas de nuevas interacciones</li>
                <li>✅ Historial de análisis</li>
                <li>✅ Compartir con médicos</li>
                <li>✅ Soporte prioritario 24/7</li>
              </ul>
              <Link to="/signup" className="plan-button primary">
                Comenzar Prueba Gratuita
              </Link>
              <p className="plan-note">14 días gratis • Sin tarjeta requerida</p>
            </div>

            {/* Professional Plan */}
            <div className="pricing-card">
              <div className="plan-header">
                <h3 className="plan-name">Profesional</h3>
                <div className="plan-price">
                  <span className="price-amount">$199</span>
                  <span className="price-period">/mes</span>
                </div>
              </div>
              <ul className="plan-features">
                <li>✅ Todo en Premium, más:</li>
                <li>✅ Múltiples pacientes (hasta 50)</li>
                <li>✅ Panel de control para clínicos</li>
                <li>✅ Integración con EHR (próximamente)</li>
                <li>✅ Códigos ICD-10</li>
                <li>✅ Recomendaciones de pruebas</li>
                <li>✅ Gerente de cuenta dedicado</li>
                <li>✅ Capacitación personalizada</li>
              </ul>
              <Link to="/signup" className="plan-button">
                Contactar Ventas
              </Link>
              <p className="plan-note">Para profesionales de la salud</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Beneficios de RxGuard™</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🛡️</div>
              <h3>Prevención de Hospitalizaciones</h3>
              <p>Detecte interacciones peligrosas antes de que causen daño, potencialmente salvando vidas</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Ahorro de Costos</h3>
              <p>Evite costosas visitas a emergencias y hospitalizaciones por interacciones medicamentosas</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">😌</div>
              <h3>Tranquilidad</h3>
              <p>Tome sus medicamentos con confianza sabiendo que están siendo monitoreados por IA</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">👨‍⚕️</div>
              <h3>Mejor Comunicación</h3>
              <p>Comparta informes profesionales con su equipo médico para mejorar la coordinación</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>¿Qué es RxGuard™?</h3>
              <p>RxGuard™ es una plataforma de inteligencia artificial que analiza sus medicamentos para detectar interacciones peligrosas, ayudándole a evitar efectos secundarios graves.</p>
            </div>
            <div className="faq-item">
              <h3>¿Cómo funciona la prueba gratuita?</h3>
              <p>Obtenga acceso completo a RxGuard™ durante 14 días sin necesidad de tarjeta de crédito. Cancele en cualquier momento antes de que termine el período de prueba.</p>
            </div>
            <div className="faq-item">
              <h3>¿Mis datos están seguros?</h3>
              <p>Sí, todos sus datos médicos están encriptados y almacenados de forma segura. Nunca compartimos su información sin su permiso explícito.</p>
            </div>
            <div className="faq-item">
              <h3>¿RxGuard™ reemplaza a mi farmacéutico?</h3>
              <p>No, RxGuard™ es una herramienta complementaria. Siempre consulte con su médico o farmacéutico antes de hacer cambios en sus medicamentos.</p>
            </div>
            <div className="faq-item">
              <h3>¿Qué medicamentos están incluidos?</h3>
              <p>RxGuard™ incluye más de 100,000 medicamentos: recetados, de venta libre, suplementos y vitaminas.</p>
            </div>
            <div className="faq-item">
              <h3>¿Puedo usar RxGuard™ en mi teléfono?</h3>
              <p>Sí, RxGuard™ funciona en cualquier dispositivo: computadora, tableta o teléfono móvil.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Proteja su Salud Hoy</h2>
          <p className="cta-subtitle">
            Únase a miles de personas que ya están usando RxGuard™ para mantenerse seguros
          </p>
          <Link to="/signup" className="cta-button large">
            Comenzar Prueba Gratuita de 14 Días
          </Link>
          <p className="cta-note">✨ Sin tarjeta de crédito • Cancele en cualquier momento • Soporte en español</p>
        </div>
      </section>
    </div>
  );
};

export default RxGuardSpanishLanding;
